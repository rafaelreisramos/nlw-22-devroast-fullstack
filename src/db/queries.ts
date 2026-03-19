import { sql } from "drizzle-orm";
import { db } from "./index";

export type SubmissionRow = {
	id: string;
	code: string;
	language: string;
	score: number;
	verdict: string;
	roast_quote: string;
	line_count: number;
	created_at: Date;
};

export type IssueRow = {
	id: string;
	submission_id: string;
	title: string;
	description: string;
	severity: string;
	line_number: number | null;
	created_at: Date;
};

export type SuggestionRow = {
	id: string;
	submission_id: string;
	original_code: string;
	suggested_code: string;
	explanation: string;
	created_at: Date;
};

export type LeaderboardStats = {
	total: string;
	avg_score: string;
};

export type ShameLeaderboardItem = {
	id: string;
	code: string;
	language: string;
	score: number;
	created_at: Date;
};

export async function createSubmission(data: {
	code: string;
	language: string;
	score: number;
	verdict: string;
	roast_quote: string;
	line_count: number;
}): Promise<SubmissionRow> {
	const result = await db.execute(sql`
    INSERT INTO submissions (code, language, score, verdict, roast_quote, line_count)
    VALUES (${data.code}, ${data.language}, ${data.score}, ${data.verdict}, ${data.roast_quote}, ${data.line_count})
    RETURNING id, code, language, score, verdict, roast_quote, line_count, created_at
  `);
	return result.rows[0] as SubmissionRow;
}

export async function getSubmissionById(
	id: string,
): Promise<SubmissionRow | null> {
	const result = await db.execute(sql`
    SELECT id, code, language, score, verdict, roast_quote, line_count, created_at
    FROM submissions
    WHERE id = ${id}
  `);
	return (result.rows[0] as SubmissionRow) || null;
}

export async function getRecentSubmissions(
	limit = 10,
	offset = 0,
): Promise<SubmissionRow[]> {
	const result = await db.execute(sql`
    SELECT id, code, language, score, verdict, roast_quote, line_count, created_at
    FROM submissions
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);
	return result.rows as SubmissionRow[];
}

export async function getTopRoasted(limit = 10): Promise<SubmissionRow[]> {
	const result = await db.execute(sql`
    SELECT id, code, language, score, verdict, roast_quote, line_count, created_at
    FROM submissions
    ORDER BY score ASC, created_at DESC
    LIMIT ${limit}
  `);
	return result.rows as SubmissionRow[];
}

export async function createIssue(data: {
	submission_id: string;
	title: string;
	description: string;
	severity: string;
	line_number?: number;
}): Promise<IssueRow> {
	const result = await db.execute(sql`
    INSERT INTO issues (submission_id, title, description, severity, line_number)
    VALUES (${data.submission_id}, ${data.title}, ${data.description}, ${data.severity}, ${data.line_number ?? null})
    RETURNING id, submission_id, title, description, severity, line_number, created_at
  `);
	return result.rows[0] as IssueRow;
}

export async function createSuggestion(data: {
	submission_id: string;
	original_code: string;
	suggested_code: string;
	explanation: string;
}): Promise<SuggestionRow> {
	const result = await db.execute(sql`
    INSERT INTO suggestions (submission_id, original_code, suggested_code, explanation)
    VALUES (${data.submission_id}, ${data.original_code}, ${data.suggested_code}, ${data.explanation})
    RETURNING id, submission_id, original_code, suggested_code, explanation, created_at
  `);
	return result.rows[0] as SuggestionRow;
}

export async function getSubmissionWithDetails(id: string) {
	const submission = await getSubmissionById(id);

	if (!submission) return null;

	const issuesResult = await db.execute(sql`
    SELECT id, submission_id, title, description, severity, line_number, created_at
    FROM issues
    WHERE submission_id = ${id}
    ORDER BY 
      CASE severity 
        WHEN 'error' THEN 1 
        WHEN 'warning' THEN 2 
        ELSE 3 
      END,
      line_number ASC
  `);

	const suggestionsResult = await db.execute(sql`
    SELECT id, submission_id, original_code, suggested_code, explanation, created_at
    FROM suggestions
    WHERE submission_id = ${id}
  `);

	return {
		...submission,
		issues: issuesResult.rows as IssueRow[],
		suggestions: suggestionsResult.rows as SuggestionRow[],
	};
}

export async function getLeaderboardStats(): Promise<LeaderboardStats | null> {
	const result = await db.execute(sql`
    SELECT COUNT(*) as total, COALESCE(AVG(score), 0)::numeric(10,2) as avg_score
    FROM submissions
  `);
	return (result.rows[0] as LeaderboardStats) || null;
}

export async function createSubmissionWithDetails(data: {
	code: string;
	language: string;
	score: number;
	verdict: string;
	roast_quote: string;
	line_count: number;
	issues: Array<{
		title: string;
		description: string;
		severity: string;
		line_number?: number;
	}>;
	suggestions: Array<{
		original_code: string;
		suggested_code: string;
		explanation: string;
	}>;
}) {
	const submission = await createSubmission(data);

	const createdIssues = await Promise.all(
		data.issues.map((issue) =>
			createIssue({
				submission_id: submission.id,
				...issue,
			}),
		),
	);

	const createdSuggestions = await Promise.all(
		data.suggestions.map((suggestion) =>
			createSuggestion({
				submission_id: submission.id,
				...suggestion,
			}),
		),
	);

	return {
		...submission,
		issues: createdIssues,
		suggestions: createdSuggestions,
	};
}

export async function getShameLeaderboard(
	limit = 3,
): Promise<ShameLeaderboardItem[]> {
	const result = await db.execute(sql`
    SELECT id, code, language, score, created_at
    FROM submissions
    ORDER BY score ASC, created_at DESC
    LIMIT ${limit}
  `);
	return result.rows as ShameLeaderboardItem[];
}

export async function getTotalRoastsCount(): Promise<number> {
	const result = await db.execute(sql`
    SELECT COUNT(*) as count FROM submissions
  `);
	return Number((result.rows[0] as { count: string }).count);
}

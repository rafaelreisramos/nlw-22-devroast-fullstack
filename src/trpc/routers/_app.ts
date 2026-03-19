import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
	getLeaderboardStats,
	getShameLeaderboard,
	getTotalRoastsCount,
} from "@/db/queries";
import { issues, submissions, suggestions } from "@/db/schema";
import { analyzeCode } from "@/lib/ai/roast";
import { supportedLanguageSchema } from "@/lib/ai/types";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
	metrics: createTRPCRouter({
		getHomeStats: baseProcedure.query(async () => {
			const result = await db
				.select({
					totalSubmissions: sql<number>`count(*)`,
					avgScore: sql<number>`coalesce(avg(${submissions.score}), 0)::numeric(10,1)`,
				})
				.from(submissions);

			return {
				totalSubmissions: result[0]?.totalSubmissions ?? 0,
				avgScore: result[0]?.avgScore ?? 0,
			};
		}),
	}),
	shameLeaderboard: createTRPCRouter({
		getItems: baseProcedure.query(async () => {
			return getShameLeaderboard(3);
		}),
		getTotalCount: baseProcedure.query(async () => {
			return getTotalRoastsCount();
		}),
		getLeaderboardPage: baseProcedure.query(async () => {
			return getShameLeaderboard(20);
		}),
		getLeaderboardStats: baseProcedure.query(async () => {
			return getLeaderboardStats();
		}),
	}),
	roast: createTRPCRouter({
		submit: baseProcedure
			.input(
				z.object({
					code: z.string().min(1).max(2000),
					language: supportedLanguageSchema,
					roastMode: z.boolean(),
				}),
			)
			.mutation(async ({ input }) => {
				const { code, language, roastMode } = input;

				const result = await analyzeCode(code, language, roastMode);
				const lineCount = code.split("\n").length;

				const [submission] = await db
					.insert(submissions)
					.values({
						code,
						language,
						score: result.score,
						verdict: result.verdict,
						roastQuote: result.roastQuote,
						lineCount,
					})
					.returning();

				if (result.issues.length > 0) {
					await db.insert(issues).values(
						result.issues.map((issue) => ({
							submissionId: submission.id,
							title: issue.title,
							description: issue.description,
							severity: issue.severity,
							lineNumber: issue.lineNumber,
						})),
					);
				}

				if (result.suggestions.length > 0) {
					await db.insert(suggestions).values(
						result.suggestions.map((s) => ({
							submissionId: submission.id,
							originalCode: s.originalCode,
							suggestedCode: s.suggestedCode,
							explanation: s.explanation,
						})),
					);
				}

				return { id: submission.id };
			}),

		getById: baseProcedure
			.input(z.object({ id: z.string().uuid() }))
			.query(async ({ input }) => {
				const submission = await db.query.submissions.findFirst({
					where: eq(submissions.id, input.id),
				});

				if (!submission) {
					throw new Error("Submission not found");
				}

				const submissionIssues = await db.query.issues.findMany({
					where: eq(issues.submissionId, input.id),
				});

				const submissionSuggestions = await db.query.suggestions.findMany({
					where: eq(suggestions.submissionId, input.id),
				});

				return {
					...submission,
					issues: submissionIssues,
					suggestions: submissionSuggestions,
				};
			}),
	}),
});

export type AppRouter = typeof appRouter;

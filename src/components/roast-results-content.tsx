"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CodeBlockContent } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";

type Submission = {
	id: string;
	code: string;
	language: string;
	score: number;
	verdict: string;
	roastQuote: string;
	lineCount: number;
	createdAt: Date;
};

type Issue = {
	id: string;
	title: string;
	description: string;
	severity: string;
	lineNumber: number | null;
};

type Suggestion = {
	id: string;
	originalCode: string;
	suggestedCode: string;
	explanation: string;
};

function formatVerdict(verdict: string): string {
	return verdict.replace(/_/g, " ");
}

function mapSeverity(severity: string) {
	if (severity === "error") return "critical";
	if (severity === "info") return "info";
	return severity as "critical" | "warning" | "good" | "verdict" | "info";
}

export function RoastResultsContent({
	submission,
	issues,
	suggestions,
	codeHtml,
}: {
	submission: Submission;
	issues: Issue[];
	suggestions: Suggestion[];
	codeHtml: string;
}) {
	const diffLines = suggestions.flatMap((s) => [
		{ type: "removed" as const, prefix: "-", content: s.originalCode },
		{ type: "added" as const, prefix: "+", content: s.suggestedCode },
	]);

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page px-20 py-10">
			<div className="flex w-full max-w-5xl flex-col gap-10">
				<div className="flex items-center gap-12">
					<ScoreRing score={submission.score} className="shrink-0" />

					<div className="flex flex-col gap-4">
						<Badge variant="verdict">
							verdict: {formatVerdict(submission.verdict)}
						</Badge>

						<p className="font-mono text-xl leading-relaxed text-text-primary">
							{submission.roastQuote}
						</p>

						<div className="flex items-center gap-4">
							<span className="font-mono text-xs text-text-tertiary">
								lang: {submission.language}
							</span>
							<span className="text-text-tertiary">·</span>
							<span className="font-mono text-xs text-text-tertiary">
								{submission.lineCount} lines
							</span>
						</div>
					</div>
				</div>

				<div className="h-px w-full bg-border-primary" />

				<div className="flex flex-col gap-4">
					<SectionTitle>your_submission</SectionTitle>

					<div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
						<CodeBlockContent
							code={submission.code}
							language={submission.language}
							html={codeHtml}
						/>
					</div>
				</div>

				<div className="h-px w-full bg-border-primary" />

				<div className="flex flex-col gap-6">
					<SectionTitle>detailed_analysis</SectionTitle>

					<div className="grid grid-cols-2 gap-5">
						{issues.map((issue) => (
							<Card key={issue.id}>
								<Badge variant={mapSeverity(issue.severity)}>
									{issue.severity}
								</Badge>
								<CardTitle>{issue.title}</CardTitle>
								<CardDescription>{issue.description}</CardDescription>
							</Card>
						))}
					</div>
				</div>

				{suggestions.length > 0 && (
					<>
						<div className="h-px w-full bg-border-primary" />

						<div className="flex flex-col gap-6">
							<SectionTitle>suggested_fix</SectionTitle>

							<div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
								<div className="flex h-10 items-center gap-2 border-b border-border-primary px-4">
									<span className="font-mono text-xs text-text-secondary">
										your_code.ts → improved_code.ts
									</span>
								</div>

								<div className="flex flex-col py-1">
									{diffLines.map((line, index) => (
										<DiffLine key={index} type={line.type} prefix={line.prefix}>
											{line.content}
										</DiffLine>
									))}
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</main>
	);
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";
import { useTRPC } from "@/trpc/client";

function formatVerdict(verdict: string): string {
	return verdict.replace(/_/g, " ");
}

function mapSeverity(severity: string) {
	if (severity === "error") return "critical";
	return severity as "critical" | "warning" | "good" | "verdict";
}

export function RoastResultsContent({ id }: { id: string }) {
	const trpc = useTRPC();
	const { data: submission, isLoading } = useQuery(
		trpc.roast.getById.queryOptions({ id }),
	);

	if (isLoading) {
		return (
			<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
				<p className="font-mono text-text-secondary">loading...</p>
			</div>
		);
	}

	if (!submission) {
		return (
			<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
				<p className="font-mono text-text-secondary">submission not found</p>
			</div>
		);
	}

	const diffLines = submission.suggestions.flatMap((s) => [
		{ type: "removed" as const, prefix: "-", content: s.originalCode },
		{ type: "added" as const, prefix: "+", content: s.suggestedCode },
	]);

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page px-20 py-10">
			<div className="flex w-full max-w-5xl flex-col gap-10">
				<div className="flex items-center justify-center gap-12">
					<ScoreRing score={submission.score} />

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
						<CodeBlock code={submission.code} language={submission.language} />
					</div>
				</div>

				<div className="h-px w-full bg-border-primary" />

				<div className="flex flex-col gap-6">
					<SectionTitle>detailed_analysis</SectionTitle>

					<div className="grid grid-cols-2 gap-5">
						{submission.issues.map((issue) => (
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

				{submission.suggestions.length > 0 && (
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

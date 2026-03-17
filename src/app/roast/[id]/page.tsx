import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";

export async function generateStaticParams() {
	return [{ id: "00000000-0000-0000-0000-000000000000" }];
}

export async function generateMetadata() {
	return {
		title: "Roast Results | DevRoast",
		description: "Your code has been roasted - see the results",
	};
}

type DiffLineType = "removed" | "added" | "context";

const STATIC_ROAST_RESULT = {
	score: 3.5,
	verdict: "needs_serious_help",
	roastTitle:
		'"this code looks like it was written during a power outage... in 2005."',
	language: "javascript",
	lines: 7,
	code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
	issues: [
		{
			title: "Use modern syntax",
			description:
				"Use const/let instead of var, and prefer map/reduce over manual loops.",
			severity: "warning" as const,
		},
		{
			title: "Missing error handling",
			description:
				"No null checks for items or items[i].price. This will crash on invalid data.",
			severity: "critical" as const,
		},
		{
			title: "Consider arrow functions",
			description:
				"Modern JavaScript prefers arrow functions for better readability.",
			severity: "good" as const,
		},
		{
			title: "No input validation",
			description:
				"Function accepts any input without validation. Add type checking.",
			severity: "critical" as const,
		},
	],
	diff: [
		{
			type: "context" as DiffLineType,
			prefix: " ",
			content: "function calculateTotal(items) {",
		},
		{
			type: "removed" as DiffLineType,
			prefix: "-",
			content: "  var total = 0;",
		},
		{
			type: "added" as DiffLineType,
			prefix: "+",
			content: "  if (!Array.isArray(items)) return 0;",
		},
		{
			type: "added" as DiffLineType,
			prefix: "+",
			content: "  const total = items.reduce((sum, item) => {",
		},
		{
			type: "added" as DiffLineType,
			prefix: "+",
			content: "    return sum + (item?.price ?? 0);",
		},
		{ type: "added" as DiffLineType, prefix: "+", content: "  }, 0);" },
		{
			type: "context" as DiffLineType,
			prefix: " ",
			content: "  return total;",
		},
		{ type: "context" as DiffLineType, prefix: " ", content: "}" },
	],
};

export default async function RoastResultsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await params;

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page px-20 py-10">
			<div className="flex w-full max-w-5xl flex-col gap-10">
				{/* Score Hero */}
				<div className="flex items-center justify-center gap-12">
					<ScoreRing score={STATIC_ROAST_RESULT.score} />

					<div className="flex flex-col gap-4">
						{/* Badge */}
						<Badge variant="verdict">
							verdict: {STATIC_ROAST_RESULT.verdict}
						</Badge>

						{/* Roast Title */}
						<p className="font-mono text-xl leading-relaxed text-text-primary">
							{STATIC_ROAST_RESULT.roastTitle}
						</p>

						{/* Meta */}
						<div className="flex items-center gap-4">
							<span className="font-mono text-xs text-text-tertiary">
								lang: {STATIC_ROAST_RESULT.language}
							</span>
							<span className="text-text-tertiary">·</span>
							<span className="font-mono text-xs text-text-tertiary">
								{STATIC_ROAST_RESULT.lines} lines
							</span>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div className="h-px w-full bg-border-primary" />

				{/* Submitted Code Section */}
				<div className="flex flex-col gap-4">
					<SectionTitle>your_submission</SectionTitle>

					<div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
						<CodeBlock
							code={STATIC_ROAST_RESULT.code}
							language={STATIC_ROAST_RESULT.language}
						/>
					</div>
				</div>

				{/* Divider */}
				<div className="h-px w-full bg-border-primary" />

				{/* Analysis Section */}
				<div className="flex flex-col gap-6">
					<SectionTitle>detailed_analysis</SectionTitle>

					{/* Issues Grid */}
					<div className="grid grid-cols-2 gap-5">
						{STATIC_ROAST_RESULT.issues.map((issue, index) => (
							<Card key={index}>
								<Badge variant={issue.severity}>{issue.severity}</Badge>
								<CardTitle>{issue.title}</CardTitle>
								<CardDescription>{issue.description}</CardDescription>
							</Card>
						))}
					</div>
				</div>

				{/* Divider */}
				<div className="h-px w-full bg-border-primary" />

				{/* Suggested Fix Section */}
				<div className="flex flex-col gap-6">
					<SectionTitle>suggested_fix</SectionTitle>

					<div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
						{/* Diff Header */}
						<div className="flex h-10 items-center gap-2 border-b border-border-primary px-4">
							<span className="font-mono text-xs text-text-secondary">
								your_code.ts → improved_code.ts
							</span>
						</div>

						{/* Diff Body */}
						<div className="flex flex-col py-1">
							{STATIC_ROAST_RESULT.diff.map((line, index) => (
								<DiffLine key={index} type={line.type} prefix={line.prefix}>
									{line.content}
								</DiffLine>
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

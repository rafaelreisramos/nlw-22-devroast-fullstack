import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { codeToHtml } from "shiki";
import { RoastResultsContent } from "@/components/roast-results-content";
import { db } from "@/db";
import { issues, submissions, suggestions } from "@/db/schema";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const submission = await db.query.submissions.findFirst({
		where: eq(submissions.id, id),
	});

	if (!submission) {
		return { title: "Roast Not Found | DevRoast" };
	}

	return {
		title: `${submission.score}/10 - ${submission.language} | DevRoast`,
		description: submission.roastQuote,
		twitter: {
			card: "summary_large_image",
			images: [`/roast/${submission.id}/opengraph-image`],
		},
		openGraph: {
			title: `${submission.score}/10 - ${submission.language} | DevRoast`,
			description: submission.roastQuote,
			images: [{ url: `/roast/${submission.id}/opengraph-image` }],
		},
	};
}

export default async function RoastResultsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const submission = await db.query.submissions.findFirst({
		where: eq(submissions.id, id),
	});

	if (!submission) {
		notFound();
	}

	const submissionIssues = await db.query.issues.findMany({
		where: eq(issues.submissionId, id),
	});

	const submissionSuggestions = await db.query.suggestions.findMany({
		where: eq(suggestions.submissionId, id),
	});

	const codeHtml = await codeToHtml(submission.code, {
		lang: submission.language,
		theme: "vesper",
	});

	return (
		<Suspense
			fallback={
				<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
					<p className="font-mono text-text-secondary">loading...</p>
				</div>
			}
		>
			<RoastResultsContent
				submission={submission}
				issues={submissionIssues}
				suggestions={submissionSuggestions}
				codeHtml={codeHtml}
			/>
		</Suspense>
	);
}

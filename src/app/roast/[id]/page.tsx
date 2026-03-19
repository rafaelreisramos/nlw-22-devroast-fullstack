import { Suspense } from "react";
import { RoastResultsContent } from "@/components/roast-results-content";

export async function generateMetadata(_: { params: Promise<{ id: string }> }) {
	return { title: "Roast Result | DevRoast" };
}

export default async function RoastResultsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<Suspense
			fallback={
				<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
					<p className="font-mono text-text-secondary">loading...</p>
				</div>
			}
		>
			<RoastResultsContent id={id} />
		</Suspense>
	);
}

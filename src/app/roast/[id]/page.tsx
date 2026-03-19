import { RoastResultsContent } from "@/components/roast-results-content";
import { HydrateClient } from "@/trpc/hydrate-client";
import { caller, prefetch, trpc } from "@/trpc/server";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	try {
		const data = await caller.roast.getById({ id });
		return {
			title: `Roast Result (${data.score}/10) | DevRoast`,
			description: data.roastQuote,
		};
	} catch {
		return { title: "Roast Not Found | DevRoast" };
	}
}

export default async function RoastResultsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	prefetch(trpc.roast.getById.queryOptions({ id }));

	return (
		<HydrateClient>
			<RoastResultsContent id={id} />
		</HydrateClient>
	);
}

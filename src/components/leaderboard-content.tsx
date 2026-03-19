import { cacheLife } from "next/cache";
import { codeToHtml } from "shiki";
import { LeaderboardEntry } from "@/components/leaderboard-entry";
import { getLeaderboardStats, getShameLeaderboard } from "@/db/queries";

type LeaderboardItemWithHtml = Awaited<
	ReturnType<typeof getShameLeaderboard>
>[number] & {
	html: string;
};

async function LeaderboardContent() {
	"use cache";
	cacheLife({ stale: 3600 });

	const [items, stats] = await Promise.all([
		getShameLeaderboard(20),
		getLeaderboardStats(),
	]);

	const itemsWithHtml: LeaderboardItemWithHtml[] = await Promise.all(
		items.map(async (item) => ({
			...item,
			html: await codeToHtml(item.code, {
				lang: item.language,
				theme: "vesper",
			}),
		})),
	);

	return (
		<>
			{/* Stats Row */}
			<div className="flex items-center gap-2">
				<span className="font-mono text-xs text-text-tertiary">
					{Number(stats?.total ?? 0).toLocaleString()} submissions
				</span>
				<span className="text-text-tertiary">·</span>
				<span className="font-mono text-xs text-text-tertiary">
					avg score: {Number(stats?.avg_score ?? 0).toFixed(1)}/10
				</span>
			</div>

			{/* Leaderboard Entries */}
			<div className="flex flex-col gap-5">
				{itemsWithHtml.map((item, index) => (
					<LeaderboardEntry key={item.id} item={item} rank={index + 1} />
				))}
			</div>
		</>
	);
}

export { LeaderboardContent };

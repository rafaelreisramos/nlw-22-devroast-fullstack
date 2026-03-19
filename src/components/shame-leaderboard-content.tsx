import { codeToHtml } from "shiki";
import { CollapsibleCode } from "@/components/ui/collapsible-code";
import {
	LeaderboardRow,
	LeaderboardRowCode,
	LeaderboardRowLanguage,
	LeaderboardRowRank,
	LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";
import { getShameLeaderboard, getTotalRoastsCount } from "@/db/queries";

async function ShameLeaderboardContent() {
	const [items, totalCount] = await Promise.all([
		getShameLeaderboard(3),
		getTotalRoastsCount(),
	]);

	const itemsWithHtml = await Promise.all(
		items.map(async (item) => {
			const html = await codeToHtml(item.code, {
				lang: item.language,
				theme: "vesper",
			});
			return { ...item, html };
		}),
	);

	return (
		<>
			<div className="overflow-hidden rounded-sm border border-border-primary">
				<div className="flex items-center gap-6 border-b border-border-primary bg-bg-surface px-5 py-3">
					<div className="w-12">
						<span className="font-mono text-xs font-medium text-text-tertiary">
							#
						</span>
					</div>
					<div className="w-16">
						<span className="font-mono text-xs font-medium text-text-tertiary">
							score
						</span>
					</div>
					<div className="flex-1">
						<span className="font-mono text-xs font-medium text-text-tertiary">
							code
						</span>
					</div>
					<div className="w-24">
						<span className="font-mono text-xs font-medium text-text-tertiary">
							lang
						</span>
					</div>
				</div>
				{itemsWithHtml.map((item, index) => (
					<LeaderboardRow key={item.id}>
						<LeaderboardRowRank>{index + 1}</LeaderboardRowRank>
						<LeaderboardRowScore>{item.score.toFixed(1)}</LeaderboardRowScore>
						<LeaderboardRowCode>
							<CollapsibleCode html={item.html} />
						</LeaderboardRowCode>
						<LeaderboardRowLanguage>{item.language}</LeaderboardRowLanguage>
					</LeaderboardRow>
				))}
			</div>

			<div className="flex justify-center pt-4">
				<span className="font-mono text-xs text-text-tertiary">
					showing top 3 of {totalCount.toLocaleString()} · view full leaderboard
					&gt;&gt;
				</span>
			</div>
		</>
	);
}

export { ShameLeaderboardContent };

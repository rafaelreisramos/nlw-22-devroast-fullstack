import { CodeSection } from "@/components/code-section";
import { HomeMetrics } from "@/components/home-metrics";
import {
	LeaderboardRow,
	LeaderboardRowCode,
	LeaderboardRowLanguage,
	LeaderboardRowRank,
	LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";
import { SectionTitle } from "@/components/ui/section-title";
import { HydrateClient } from "@/trpc/hydrate-client";
import { prefetch, trpc } from "@/trpc/server";

export const revalidate = 0;

export default function Home() {
	prefetch(trpc.metrics.getHomeStats.queryOptions());

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page px-10 py-20">
			<div className="flex w-full max-w-5xl flex-col gap-8">
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="flex items-center gap-3">
						<span className="font-mono text-4xl font-bold text-accent-green">
							$
						</span>
						<h1 className="font-mono text-4xl font-bold text-text-primary">
							paste your code. get roasted.
						</h1>
					</div>
					<p className="font-mono text-sm text-text-secondary">
						{`// drop your code below and we'll rate it — brutally honest or full roast mode`}
					</p>
				</div>

				<CodeSection />

				<HydrateClient>
					<HomeMetrics />
				</HydrateClient>

				<div className="h-16" />

				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<SectionTitle>shame_leaderboard</SectionTitle>
						<div className="rounded-sm border border-border-primary px-3 py-1.5">
							<span className="font-mono text-xs text-text-secondary">
								$ view_all &gt;&gt;
							</span>
						</div>
					</div>

					<p className="font-mono text-sm text-text-tertiary">
						{`// the worst code on the internet, ranked by shame`}
					</p>

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
						<LeaderboardRow>
							<LeaderboardRowRank>1</LeaderboardRowRank>
							<LeaderboardRowScore>1.2</LeaderboardRowScore>
							<LeaderboardRowCode>
								<div className="flex flex-col gap-0.75">
									<span className="font-mono text-sm text-text-primary">{`eval(prompt("enter code"))`}</span>
									<span className="font-mono text-sm text-text-primary">
										document.write(response)
									</span>
									<span className="font-mono text-sm text-text-tertiary">{`// trust the user lol`}</span>
								</div>
							</LeaderboardRowCode>
							<LeaderboardRowLanguage>javascript</LeaderboardRowLanguage>
						</LeaderboardRow>
						<LeaderboardRow>
							<LeaderboardRowRank>2</LeaderboardRowRank>
							<LeaderboardRowScore>1.8</LeaderboardRowScore>
							<LeaderboardRowCode>
								<div className="flex flex-col gap-0.75">
									<span className="font-mono text-sm text-text-primary">
										if (x == true) {"{"} return true; {"}"}
									</span>
									<span className="font-mono text-sm text-text-primary">
										else if (x == false) {"{"} return false; {"}"}
									</span>
									<span className="font-mono text-sm text-text-primary">
										else {"{"} return !false; {"}"}
									</span>
								</div>
							</LeaderboardRowCode>
							<LeaderboardRowLanguage>typescript</LeaderboardRowLanguage>
						</LeaderboardRow>
						<LeaderboardRow>
							<LeaderboardRowRank>3</LeaderboardRowRank>
							<LeaderboardRowScore>2.1</LeaderboardRowScore>
							<LeaderboardRowCode>
								<div className="flex flex-col gap-0.75">
									<span className="font-mono text-sm text-text-primary">
										SELECT * FROM users WHERE 1=1
									</span>
									<span className="font-mono text-sm text-text-tertiary">
										-- TODO: add authentication
									</span>
								</div>
							</LeaderboardRowCode>
							<LeaderboardRowLanguage>sql</LeaderboardRowLanguage>
						</LeaderboardRow>
					</div>

					<div className="flex justify-center pt-4">
						<span className="font-mono text-xs text-text-tertiary">
							showing top 3 of 2,847 · view full leaderboard &gt;&gt;
						</span>
					</div>
				</div>
			</div>
		</main>
	);
}

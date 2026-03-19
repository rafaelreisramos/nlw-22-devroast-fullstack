import { Suspense } from "react";
import { CodeSection } from "@/components/code-section";
import { HomeMetrics } from "@/components/home-metrics";
import { ShameLeaderboardContent } from "@/components/shame-leaderboard-content";
import { ShameLeaderboardSkeleton } from "@/components/shame-leaderboard-skeleton";
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

					<Suspense fallback={<ShameLeaderboardSkeleton />}>
						<ShameLeaderboardContent />
					</Suspense>
				</div>
			</div>
		</main>
	);
}

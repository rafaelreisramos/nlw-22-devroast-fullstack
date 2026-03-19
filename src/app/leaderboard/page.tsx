import { LeaderboardContent } from "@/components/leaderboard-content";

export const metadata = {
	title: "Shame Leaderboard | DevRoast",
	description: "The most roasted code on the internet - ranked by shame",
};

export default function LeaderboardPage() {
	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page px-20 py-10">
			<div className="flex w-full max-w-5xl flex-col gap-10">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="font-mono text-[32px] font-bold text-accent-green">
							&gt;
						</span>
						<h1 className="font-mono text-[28px] font-bold text-text-primary">
							shame_leaderboard
						</h1>
					</div>

					<p className="font-mono text-sm text-text-secondary">
						{`// the most roasted code on the internet`}
					</p>
				</div>

				<LeaderboardContent />
			</div>
		</main>
	);
}

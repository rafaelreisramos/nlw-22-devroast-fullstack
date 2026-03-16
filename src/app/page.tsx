import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import {
	LeaderboardRow,
	LeaderboardRowCode,
	LeaderboardRowLanguage,
	LeaderboardRowRank,
	LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";
import { Toggle } from "@/components/ui/toggle";

export default function Home() {
	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page px-10 py-20">
			<div className="flex w-full max-w-5xl flex-col gap-8">
				{/* Hero Title */}
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

				{/* Code Input Area */}
				<CodeBlock
					code={`function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`}
					language="javascript"
				/>

				{/* Actions Bar */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2.5">
							<Toggle defaultChecked />
							<span className="font-mono text-sm text-accent-green">
								roast mode
							</span>
						</div>
						<span className="font-mono text-xs text-text-tertiary">
							{`// maximum sarcasm enabled`}
						</span>
					</div>
					<Button>$ roast_my_code</Button>
				</div>

				{/* Stats Footer */}
				<div className="flex items-center justify-center gap-6 py-4">
					<span className="font-mono text-xs text-text-tertiary">
						2,847 codes roasted
					</span>
					<span className="text-text-tertiary">·</span>
					<span className="font-mono text-xs text-text-tertiary">
						avg score: 4.2/10
					</span>
				</div>

				{/* Spacer */}
				<div className="h-16" />

				{/* Leaderboard Preview */}
				<div className="flex flex-col gap-6">
					{/* Title Row */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="font-mono text-sm font-bold text-accent-green">
								{`//`}
							</span>
							<span className="font-mono text-sm font-bold text-text-primary">
								shame_leaderboard
							</span>
						</div>
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
						{/* Table Header */}
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
						{/* Table Rows */}
						<LeaderboardRow>
							<LeaderboardRowRank>1</LeaderboardRowRank>
							<LeaderboardRowScore>1.2</LeaderboardRowScore>
							<LeaderboardRowCode>
								<div className="flex flex-col gap-0.75">
									<span className="font-mono text-sm text-text-primary">
										{`eval(prompt("enter code"))`}
									</span>
									<span className="font-mono text-sm text-text-primary">
										document.write(response)
									</span>
									<span className="font-mono text-sm text-text-tertiary">
										{`// trust the user lol`}
									</span>
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

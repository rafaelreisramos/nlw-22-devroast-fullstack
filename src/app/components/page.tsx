import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import {
	LeaderboardRow,
	LeaderboardRowCode,
	LeaderboardRowLanguage,
	LeaderboardRowRank,
	LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";
import { ButtonsDemo } from "./buttons-demo";
import { ToggleDemo } from "./toggle-demo";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const badgeVariantsList = [
	{ variant: "critical", label: "critical" },
	{ variant: "warning", label: "warning" },
	{ variant: "good", label: "good" },
	{ variant: "verdict", label: "needs_serious_help" },
];

export default function ComponentsPage() {
	return (
		<main className="min-h-screen bg-bg-page text-text-primary p-8">
			<h1 className="mb-8 font-mono text-3xl font-bold text-accent-green">
				Components
			</h1>

			<div className="space-y-16 max-w-4xl">
				<section>
					<SectionTitle className="mb-4 text-xl">buttons</SectionTitle>
					<ButtonsDemo />
				</section>

				<section>
					<SectionTitle className="mb-4 text-xl">toggle</SectionTitle>
					<ToggleDemo />
				</section>

				<section>
					<SectionTitle className="mb-4 text-xl">badge_status</SectionTitle>

					<div className="flex flex-wrap gap-6">
						{badgeVariantsList.map((item) => (
							<Badge key={item.variant} variant={item.variant as never}>
								{item.label}
							</Badge>
						))}
					</div>
				</section>

				<section>
					<SectionTitle className="mb-4 text-xl">cards</SectionTitle>

					<Card className="max-w-lg">
						<Badge variant="critical">critical</Badge>
						<CardTitle>using var instead of const/let</CardTitle>
						<CardDescription>
							the var keyword is function-scoped rather than block-scoped, which
							can lead to unexpected behavior and bugs. modern javascript uses
							const for immutable bindings and let for mutable ones.
						</CardDescription>
					</Card>
				</section>

				<section>
					<SectionTitle className="mb-4 text-xl">code_block</SectionTitle>

					<div className="max-w-xl">
						<CodeBlock code={sampleCode} filename="calculate.js" />
					</div>
				</section>

				<section>
					<SectionTitle className="mb-4 text-xl">diff_line</SectionTitle>

					<div className="max-w-xl border border-border-primary bg-bg-input">
						<DiffLine type="removed" prefix="-">
							var total = 0;
						</DiffLine>
						<DiffLine type="added" prefix="+">
							const total = 0;
						</DiffLine>
						<DiffLine type="context" prefix=" ">
							for (let i = 0; i &lt; items.length; i++) {"{"}
						</DiffLine>
					</div>
				</section>

				<section>
					<SectionTitle className="mb-4 text-xl">table_row</SectionTitle>

					<div className="max-w-2xl border border-border-primary bg-bg-input">
						<LeaderboardRow>
							<LeaderboardRowRank>1</LeaderboardRowRank>
							<LeaderboardRowScore>2.1</LeaderboardRowScore>
							<LeaderboardRowCode>
								<span className="font-mono text-sm text-text-primary">
									function calculateTotal(items) {"{"} var total = 0; ...
								</span>
							</LeaderboardRowCode>
							<LeaderboardRowLanguage>javascript</LeaderboardRowLanguage>
						</LeaderboardRow>
						<LeaderboardRow>
							<LeaderboardRowRank>2</LeaderboardRowRank>
							<LeaderboardRowScore>3.5</LeaderboardRowScore>
							<LeaderboardRowCode>
								<span className="font-mono text-sm text-text-primary">
									const add = (a, b) =&gt; a + b;
								</span>
							</LeaderboardRowCode>
							<LeaderboardRowLanguage>javascript</LeaderboardRowLanguage>
						</LeaderboardRow>
						<LeaderboardRow>
							<LeaderboardRowRank>3</LeaderboardRowRank>
							<LeaderboardRowScore>5.2</LeaderboardRowScore>
							<LeaderboardRowCode>
								<span className="font-mono text-sm text-text-primary">
									function foo() {"{"} return 'bar'; {"}"}
								</span>
							</LeaderboardRowCode>
							<LeaderboardRowLanguage>javascript</LeaderboardRowLanguage>
						</LeaderboardRow>
					</div>
				</section>

				<section>
					<SectionTitle className="mb-4 text-xl">score_ring</SectionTitle>

					<div className="flex gap-8">
						<ScoreRing score={3.5} />
						<ScoreRing score={7.2} />
						<ScoreRing score={9.8} />
					</div>
				</section>
			</div>
		</main>
	);
}

import { CodeBlock } from "@/components/ui/code-block";

const SHAME_LEADERBOARD_DATA = [
	{
		rank: 1,
		score: 1.2,
		language: "javascript",
		lines: 3,
		code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
	},
	{
		rank: 2,
		score: 1.8,
		language: "typescript",
		lines: 3,
		code: `if (x == true) { return true; }
else if (x == false) { return false; }
else { return !false; }`,
	},
	{
		rank: 3,
		score: 2.1,
		language: "sql",
		lines: 2,
		code: `SELECT * FROM users WHERE 1=1
-- TODO: add authentication`,
	},
	{
		rank: 4,
		score: 2.4,
		language: "python",
		lines: 2,
		code: `import os
os.system(input())`,
	},
	{
		rank: 5,
		score: 2.8,
		language: "javascript",
		lines: 3,
		code: `try { } 
catch(e) { /* silently fail */ }
finally { /* who cares */ }`,
	},
];

export const metadata = {
	title: "Shame Leaderboard | DevRoast",
	description: "The most roasted code on the internet - ranked by shame",
};

export default function ShameLeaderboardPage() {
	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page px-20 py-10">
			<div className="flex w-full max-w-5xl flex-col gap-10">
				{/* Hero Section */}
				<div className="flex flex-col gap-4">
					{/* Title Row */}
					<div className="flex items-center gap-3">
						<span className="font-mono text-[32px] font-bold text-accent-green">
							&gt;
						</span>
						<h1 className="font-mono text-[28px] font-bold text-text-primary">
							shame_leaderboard
						</h1>
					</div>

					{/* Subtitle */}
					<p className="font-mono text-sm text-text-secondary">
						{`// the most roasted code on the internet`}
					</p>

					{/* Stats Row */}
					<div className="flex items-center gap-2">
						<span className="font-mono text-xs text-text-tertiary">
							2,847 submissions
						</span>
						<span className="text-text-tertiary">·</span>
						<span className="font-mono text-xs text-text-tertiary">
							avg score: 4.2/10
						</span>
					</div>
				</div>

				{/* Leaderboard Entries */}
				<div className="flex flex-col gap-5">
					{SHAME_LEADERBOARD_DATA.map((entry) => (
						<div
							key={entry.rank}
							className="overflow-hidden rounded-sm border border-border-primary bg-bg-input"
						>
							{/* Meta Row */}
							<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
								{/* Rank & Score */}
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1.5">
										<span className="font-mono text-sm text-text-tertiary">
											#
										</span>
										<span className="font-mono text-sm font-bold text-accent-amber">
											{entry.rank}
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<span className="font-mono text-xs text-text-tertiary">
											score:
										</span>
										<span className="font-mono text-sm font-bold text-accent-red">
											{entry.score}
										</span>
									</div>
								</div>

								{/* Language & Lines */}
								<div className="flex items-center gap-3">
									<span className="font-mono text-xs text-text-secondary">
										{entry.language}
									</span>
									<span className="font-mono text-xs text-text-tertiary">
										{entry.lines} lines
									</span>
								</div>
							</div>

							{/* Code Block */}
							<CodeBlock code={entry.code} language={entry.language} />
						</div>
					))}
				</div>
			</div>
		</main>
	);
}

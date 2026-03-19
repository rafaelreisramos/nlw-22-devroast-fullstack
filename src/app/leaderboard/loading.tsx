function LoadingEntry() {
	return (
		<div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
			{/* Meta Row Skeleton */}
			<div className="flex h-12 items-center justify-between px-5">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1.5">
						<div className="h-4 w-4 animate-pulse rounded bg-bg-surface" />
						<div className="h-4 w-6 animate-pulse rounded bg-bg-surface" />
					</div>
					<div className="flex items-center gap-1.5">
						<div className="h-3 w-10 animate-pulse rounded bg-bg-surface" />
						<div className="h-4 w-8 animate-pulse rounded bg-bg-surface" />
					</div>
				</div>
				<div className="flex items-center gap-3">
					<div className="h-3 w-16 animate-pulse rounded bg-bg-surface" />
					<div className="h-3 w-12 animate-pulse rounded bg-bg-surface" />
				</div>
			</div>

			{/* Code Block Skeleton */}
			<div className="flex">
				<div className="flex w-10 flex-col gap-1.5 border-r border-border-primary bg-bg-surface px-2.5 py-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="h-4 w-3 animate-pulse rounded bg-bg-page" />
					))}
				</div>
				<div className="flex flex-1 flex-col gap-1.5 p-3">
					<div className="h-4 w-full animate-pulse rounded bg-bg-surface" />
					<div className="h-4 w-4/5 animate-pulse rounded bg-bg-surface" />
					<div className="h-4 w-3/4 animate-pulse rounded bg-bg-surface" />
					<div className="h-4 w-11/12 animate-pulse rounded bg-bg-surface" />
					<div className="h-4 w-2/3 animate-pulse rounded bg-bg-surface" />
				</div>
			</div>

			{/* Button Skeleton */}
			<div className="flex items-center justify-center gap-1.5 py-2 border-t border-border-primary">
				<div className="h-3 w-16 animate-pulse rounded bg-bg-surface" />
				<div className="h-3 w-3 animate-pulse rounded bg-bg-surface" />
			</div>
		</div>
	);
}

export default function Loading() {
	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page px-20 py-10">
			<div className="flex w-full max-w-5xl flex-col gap-10">
				{/* Hero Section */}
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

				{/* Leaderboard Content Skeleton (matches LeaderboardContent component) */}
				{/* Stats Row Skeleton */}
				<div className="flex items-center gap-2">
					<div className="h-3 w-20 animate-pulse rounded bg-bg-surface" />
					<span className="text-text-tertiary">·</span>
					<div className="h-3 w-32 animate-pulse rounded bg-bg-surface" />
				</div>

				{/* Entries Skeletons */}
				<div className="flex flex-col gap-5">
					{Array.from({ length: 5 }).map((_, i) => (
						<LoadingEntry key={i} />
					))}
				</div>
			</div>
		</main>
	);
}

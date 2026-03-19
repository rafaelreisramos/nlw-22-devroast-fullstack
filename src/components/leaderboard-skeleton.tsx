export function LeaderboardSkeleton() {
	return (
		<div className="flex flex-col gap-5">
			{Array.from({ length: 5 }).map((_, i) => (
				<div
					key={i}
					className="h-24 animate-pulse rounded-sm border border-border-primary bg-bg-input"
				/>
			))}
		</div>
	);
}

import { Skeleton } from "@/components/ui/skeleton";

function ShameLeaderboardSkeleton() {
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
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="flex items-center gap-6 border-b border-border-primary px-5 py-3 last:border-b-0"
					>
						<div className="w-12">
							<Skeleton className="h-4 w-4" />
						</div>
						<div className="w-16">
							<Skeleton className="h-4 w-10" />
						</div>
						<div className="flex-1">
							<div className="flex flex-col gap-2">
								<Skeleton className="h-4 w-full max-w-xs" />
								<Skeleton className="h-4 w-4/5 max-w-xs" />
							</div>
						</div>
						<div className="w-24">
							<Skeleton className="h-4 w-16" />
						</div>
					</div>
				))}
			</div>

			<div className="flex justify-center pt-4">
				<Skeleton className="h-4 w-48" />
			</div>
		</>
	);
}

export { ShameLeaderboardSkeleton };

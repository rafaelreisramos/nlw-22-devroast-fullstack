import { twMerge } from "tailwind-merge";

export interface SkeletonProps {
	className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
	return <div className={twMerge("bg-bg-elevated animate-pulse", className)} />;
}

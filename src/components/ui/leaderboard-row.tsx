import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface LeaderboardRowProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

function LeaderboardRow({
	children,
	className,
	...props
}: LeaderboardRowProps) {
	return (
		<div
			className={twMerge(
				"flex items-center gap-6 border-b border-border-primary px-5 py-4",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

LeaderboardRow.displayName = "LeaderboardRow";

export interface LeaderboardRowRankProps
	extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

function LeaderboardRowRank({
	children,
	className,
	...props
}: LeaderboardRowRankProps) {
	return (
		<div className={twMerge("w-12", className)} {...props}>
			<span className="font-mono text-sm text-text-tertiary">{children}</span>
		</div>
	);
}

LeaderboardRowRank.displayName = "LeaderboardRowRank";

export interface LeaderboardRowScoreProps
	extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

function LeaderboardRowScore({
	children,
	className,
	...props
}: LeaderboardRowScoreProps) {
	return (
		<div className={twMerge("w-16", className)} {...props}>
			<span className="font-mono text-sm font-bold text-accent-red">
				{children}
			</span>
		</div>
	);
}

LeaderboardRowScore.displayName = "LeaderboardRowScore";

export interface LeaderboardRowCodeProps
	extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

function LeaderboardRowCode({
	children,
	className,
	...props
}: LeaderboardRowCodeProps) {
	return (
		<div className={twMerge("flex-1 overflow-hidden", className)} {...props}>
			{children}
		</div>
	);
}

LeaderboardRowCode.displayName = "LeaderboardRowCode";

export interface LeaderboardRowLanguageProps
	extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

function LeaderboardRowLanguage({
	children,
	className,
	...props
}: LeaderboardRowLanguageProps) {
	return (
		<div className={twMerge("w-24", className)} {...props}>
			<span className="font-mono text-sm text-text-secondary">{children}</span>
		</div>
	);
}

LeaderboardRowLanguage.displayName = "LeaderboardRowLanguage";

export {
	LeaderboardRow,
	LeaderboardRowCode,
	LeaderboardRowLanguage,
	LeaderboardRowRank,
	LeaderboardRowScore,
};

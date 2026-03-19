"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

type LeaderboardEntryProps = {
	item: {
		id: string;
		code: string;
		language: string;
		score: number;
		line_count: number;
		html: string;
	};
	rank: number;
};

export function LeaderboardEntry({ item, rank }: LeaderboardEntryProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
			{/* Meta Row */}
			<div className="flex h-12 items-center justify-between px-5">
				{/* Rank & Score */}
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1.5">
						<span className="font-mono text-sm text-text-tertiary">#</span>
						<span className="font-mono text-sm font-bold text-accent-amber">
							{rank}
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="font-mono text-xs text-text-tertiary">score:</span>
						<span className="font-mono text-sm font-bold text-accent-red">
							{item.score.toFixed(1)}
						</span>
					</div>
				</div>

				{/* Language & Lines */}
				<div className="flex items-center gap-3">
					<span className="font-mono text-xs text-text-secondary">
						{item.language}
					</span>
					<span className="font-mono text-xs text-text-tertiary">
						{item.line_count} lines
					</span>
				</div>
			</div>

			{/* Code Block with Collapsible */}
			<div
				className={twMerge(
					"relative overflow-hidden transition-all duration-300 ease-in-out",
					isExpanded ? "max-h-none" : "max-h-28",
				)}
			>
				<div className="flex">
					{/* Line Numbers */}
					<div className="flex w-10 flex-col gap-1.5 border-r border-border-primary bg-bg-surface px-2.5 py-3 text-right font-mono text-xs text-text-tertiary">
						{item.code.split("\n").map((_, i) => (
							<span key={i}>{i + 1}</span>
						))}
					</div>

					{/* Code Content */}
					<div
						className="flex-1 overflow-x-auto p-3 font-mono text-sm"
						dangerouslySetInnerHTML={{ __html: item.html }}
					/>
				</div>

				{!isExpanded && (
					<div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg-input to-transparent pointer-events-none" />
				)}
			</div>

			{/* Expand/Collapse Button */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex items-center justify-center gap-1.5 py-2 font-mono text-xs text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer w-full border-t border-border-primary"
			>
				<span>{isExpanded ? "Show less" : "Show more"}</span>
				<svg
					className={`size-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
		</div>
	);
}

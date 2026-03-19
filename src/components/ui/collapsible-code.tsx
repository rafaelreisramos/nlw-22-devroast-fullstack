"use client";

import { useState } from "react";

interface CollapsibleCodeProps {
	html: string;
}

export function CollapsibleCode({ html }: CollapsibleCodeProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="flex flex-col w-full">
			<div
				className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
					isExpanded ? "max-h-none" : "max-h-20"
				}`}
			>
				<div
					className="w-full font-mono text-sm [&_pre]:p-0 [&_pre]:bg-transparent [&_pre]:overflow-visible [&_pre]:whitespace-pre"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
				{!isExpanded && (
					<div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-page to-transparent pointer-events-none" />
				)}
			</div>
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex items-center justify-center gap-1.5 py-1.5 font-mono text-xs text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer w-full"
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

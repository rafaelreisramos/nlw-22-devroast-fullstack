import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface ScoreRingProps extends HTMLAttributes<HTMLDivElement> {
	score: number;
	maxScore?: number;
	size?: number;
}

function ScoreRing({
	score,
	maxScore = 10,
	size = 180,
	className,
	...props
}: ScoreRingProps) {
	const percentage = score / maxScore;
	const radius = 70;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference * (1 - percentage);
	const centerX = size / 2;
	const centerY = size / 2;
	const gradientId = `score-ring-gradient-${score}-${maxScore}`;

	const getScoreColor = () => {
		if (percentage <= 0.35) return "text-accent-red";
		if (percentage <= 0.65) return "text-accent-amber";
		return "text-accent-green";
	};

	return (
		<div
			className={twMerge("relative shrink-0", className)}
			style={{ width: `${size}px`, height: `${size}px` }}
			{...props}
		>
			<svg
				className="absolute inset-0 -rotate-90"
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				aria-label={`Score: ${score} out of ${maxScore}`}
			>
				<defs>
					<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#10b981" />
						<stop offset="35%" stopColor="#10b981" />
						<stop offset="35%" stopColor="#f59e0b" />
						<stop offset="100%" stopColor="#ef4444" />
					</linearGradient>
				</defs>
				<circle
					cx={centerX}
					cy={centerY}
					r={radius}
					fill="none"
					stroke="var(--color-border-primary)"
					strokeWidth={4}
				/>
				<circle
					cx={centerX}
					cy={centerY}
					r={radius}
					fill="none"
					stroke={`url(#${gradientId})`}
					strokeWidth={4}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					style={{
						transition: "stroke-dashoffset 0.5s ease-in-out",
					}}
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span
					className={`font-mono text-5xl font-bold leading-none ${getScoreColor()}`}
				>
					{score.toFixed(1)}
				</span>
				<span className="font-mono text-base leading-none text-text-tertiary">
					/{maxScore}
				</span>
			</div>
		</div>
	);
}

ScoreRing.displayName = "ScoreRing";

export { ScoreRing };

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

	const gradientId = `score-ring-gradient-${score}-${maxScore}`;

	return (
		<div
			className={twMerge(
				"relative inline-flex items-center justify-center",
				className,
			)}
			style={{ width: size, height: size }}
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
						<stop offset="35%" stopColor="#f59e0b" />
						<stop offset="36%" stopColor="transparent" />
					</linearGradient>
				</defs>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="var(--color-border-primary)"
					strokeWidth={4}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
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
			<div className="flex items-baseline gap-0.5">
				<span className="font-mono text-5xl font-bold text-text-primary leading-none">
					{score.toFixed(1)}
				</span>
				<span className="font-mono text-base text-text-tertiary leading-none">
					/{maxScore}
				</span>
			</div>
		</div>
	);
}

ScoreRing.displayName = "ScoreRing";

export { ScoreRing };

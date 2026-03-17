import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
}

function SectionTitle({ children, className, ...props }: SectionTitleProps) {
	return (
		<h2 className={twMerge("flex items-center gap-2", className)} {...props}>
			<span className="font-mono text-sm font-bold text-accent-green">
				{"//"}
			</span>
			<span className="font-mono text-sm font-bold text-text-primary">
				{children}
			</span>
		</h2>
	);
}

SectionTitle.displayName = "SectionTitle";

export { SectionTitle };

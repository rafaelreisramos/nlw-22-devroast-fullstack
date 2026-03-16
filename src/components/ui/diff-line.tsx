import type { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const diffLineVariants = tv({
	base: "flex gap-2 px-4 py-2 font-mono text-sm",
	variants: {
		type: {
			removed: "bg-accent-red/10 text-text-secondary",
			added: "bg-accent-green/10 text-text-primary",
			context: "text-text-secondary",
		},
	},
});

const prefixVariants = tv({
	variants: {
		type: {
			removed: "text-accent-red",
			added: "text-accent-green",
			context: "text-text-tertiary",
		},
	},
});

type DiffLineType = "removed" | "added" | "context";

export interface DiffLineProps extends HTMLAttributes<HTMLDivElement> {
	type?: DiffLineType;
	prefix?: string;
}

function DiffLine({
	className,
	type = "context",
	prefix = " ",
	children,
	...props
}: DiffLineProps) {
	return (
		<div className={diffLineVariants({ type, className })} {...props}>
			<span className={prefixVariants({ type })}>{prefix}</span>
			<span className="flex-1">{children}</span>
		</div>
	);
}

DiffLine.displayName = "DiffLine";

export { DiffLine, diffLineVariants };

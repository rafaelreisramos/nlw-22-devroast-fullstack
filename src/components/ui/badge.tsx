import type { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";

const badgeVariants = tv({
	base: "inline-flex items-center gap-2 font-mono text-xs font-medium",
	variants: {
		variant: {
			critical: "text-accent-red",
			warning: "text-accent-amber",
			good: "text-accent-green",
			verdict: "text-accent-red",
			info: "text-text-primary",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

const dotVariants = tv({
	base: "h-2 w-2 rounded-full",
	variants: {
		variant: {
			critical: "bg-accent-red",
			warning: "bg-accent-amber",
			good: "bg-accent-green",
			verdict: "bg-accent-red",
			info: "bg-text-primary",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

type BadgeVariant = "critical" | "warning" | "good" | "verdict" | "info";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
	variant?: BadgeVariant;
	children?: ReactNode;
}

function Badge({ className, variant, children, ...props }: BadgeProps) {
	return (
		<div className={badgeVariants({ variant, className })} {...props}>
			<div className={dotVariants({ variant })} />
			{children}
		</div>
	);
}

Badge.displayName = "Badge";

export { Badge, badgeVariants };

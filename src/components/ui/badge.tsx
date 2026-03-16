import type { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const badgeVariants = tv({
	base: "inline-flex items-center gap-2 font-mono text-xs font-normal",
	variants: {
		variant: {
			critical: "text-accent-red",
			warning: "text-accent-amber",
			good: "text-accent-green",
			verdict: "text-accent-red",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

type BadgeVariant = "critical" | "warning" | "good" | "verdict";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
	variant?: BadgeVariant;
}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={badgeVariants({ variant, className })} {...props} />;
}

Badge.displayName = "Badge";

export { Badge, badgeVariants };

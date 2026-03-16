import type { ButtonHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center gap-2 font-mono text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			default: "bg-accent-green text-bg-page hover:bg-accent-green/90",
			destructive: "bg-accent-red text-text-primary hover:bg-accent-red/90",
			outline:
				"border border-border-primary bg-transparent hover:bg-bg-elevated hover:text-text-primary",
			secondary: "bg-bg-elevated text-text-primary hover:bg-bg-surface",
			ghost: "hover:bg-bg-elevated hover:text-text-primary",
			link: "text-text-primary underline-offset-4 hover:underline",
		},
		size: {
			default: "px-6 py-2.5",
			sm: "px-3 py-1.5 text-xs",
			lg: "px-8 py-3 text-base",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

type ButtonVariant =
	| "default"
	| "destructive"
	| "outline"
	| "secondary"
	| "ghost"
	| "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

function Button({ className, variant, size, ...props }: ButtonProps) {
	return (
		<button
			className={buttonVariants({ variant, size, className })}
			{...props}
		/>
	);
}

Button.displayName = "Button";

export { Button, buttonVariants };

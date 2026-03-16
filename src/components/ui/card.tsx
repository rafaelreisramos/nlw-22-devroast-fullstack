import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

function Card({ children, className, ...props }: CardProps) {
	return (
		<div
			className={twMerge(
				"rounded-none border border-border-primary bg-bg-input p-5",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

Card.displayName = "Card";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
}

function CardTitle({ children, className, ...props }: CardTitleProps) {
	return (
		<h3
			className={twMerge("font-mono text-sm text-text-primary mt-2", className)}
			{...props}
		>
			{children}
		</h3>
	);
}

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
	extends HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode;
}

function CardDescription({
	children,
	className,
	...props
}: CardDescriptionProps) {
	return (
		<p
			className={twMerge(
				"font-mono text-xs text-text-secondary leading-relaxed mt-1",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
}

CardDescription.displayName = "CardDescription";

export { Card, CardDescription, CardTitle };

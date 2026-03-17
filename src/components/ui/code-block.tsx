import type { HTMLAttributes } from "react";
import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

export interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
}

function CodeBlockHeader({
	filename,
	className,
	...props
}: HTMLAttributes<HTMLDivElement> & { filename?: string }) {
	return (
		<div
			className={twMerge(
				"flex h-10 items-center gap-3 border-b border-border-primary px-4",
				className,
			)}
			{...props}
		>
			<div className="h-2.5 w-2.5 rounded-full bg-accent-red" />
			<div className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
			<div className="h-2.5 w-2.5 rounded-full bg-accent-green" />
			<div className="flex-1" />
			{filename && (
				<span className="font-mono text-xs text-text-tertiary">{filename}</span>
			)}
		</div>
	);
}

CodeBlockHeader.displayName = "CodeBlockHeader";

function CodeBlockContent({
	code,
	language = "javascript",
	html,
	className,
	...props
}: HTMLAttributes<HTMLDivElement> & {
	code: string;
	language?: string;
	html?: string;
}) {
	return (
		<div className={twMerge("flex", className)} {...props}>
			<div className="flex w-10 flex-col gap-1.5 border-r border-border-primary bg-bg-surface px-2.5 py-3 text-right font-mono text-xs text-text-tertiary">
				{code.split("\n").map((_, i) => (
					<span key={i}>{i + 1}</span>
				))}
			</div>
			<div
				className="flex-1 overflow-x-auto p-3 font-mono text-sm"
				dangerouslySetInnerHTML={{ __html: html ?? "" }}
			/>
		</div>
	);
}

CodeBlockContent.displayName = "CodeBlockContent";

export async function CodeBlock({
	code,
	language = "javascript",
	filename,
}: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang: language,
		theme: "vesper",
	});

	return (
		<div className="rounded-none border border-border-primary bg-bg-input overflow-hidden">
			<CodeBlockHeader filename={filename} />
			<CodeBlockContent code={code} html={html} />
		</div>
	);
}

CodeBlock.displayName = "CodeBlock";

export { CodeBlockContent, CodeBlockHeader };

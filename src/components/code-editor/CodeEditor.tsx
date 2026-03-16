"use client";

import { useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

import {
	detectLanguage,
	normalizeLanguage,
	SUPPORTED_LANGUAGES,
	type SupportedLanguage,
} from "./useLanguageDetector";

export interface CodeEditorProps {
	code?: string;
	language?: string;
	onLanguageChange?: (lang: SupportedLanguage) => void;
	onCodeChange?: (code: string) => void;
	showLanguageSelector?: boolean;
	className?: string;
	filename?: string;
	placeholder?: string;
}

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
	javascript: "JavaScript",
	typescript: "TypeScript",
	python: "Python",
	java: "Java",
	go: "Go",
	rust: "Rust",
	ruby: "Ruby",
	php: "PHP",
	sql: "SQL",
	html: "HTML",
	css: "CSS",
	json: "JSON",
};

export function CodeEditor({
	code: initialCode = "",
	language: initialLanguage,
	onLanguageChange,
	onCodeChange,
	showLanguageSelector = false,
	className,
	filename,
	placeholder = "Paste your code here...",
}: CodeEditorProps) {
	const [code, setCode] = useState<string>(initialCode);
	const [html, setHtml] = useState<string>("");
	const [currentLanguage, setCurrentLanguage] =
		useState<SupportedLanguage>("javascript");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (!initialLanguage && code) {
			const detected = detectLanguage(code);
			if (detected) {
				setCurrentLanguage(detected);
			}
		} else if (initialLanguage) {
			const normalized = normalizeLanguage(initialLanguage);
			if (normalized) {
				setCurrentLanguage(normalized);
			}
		}
	}, [initialLanguage, code]);

	useEffect(() => {
		codeToHtml(code, {
			lang: currentLanguage,
			theme: "vesper",
		}).then(setHtml);
	}, [code, currentLanguage]);

	const handleCodeChange = (newCode: string) => {
		setCode(newCode);
		if (onCodeChange) {
			onCodeChange(newCode);
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
		const pastedText = e.clipboardData.getData("text");
		if (pastedText.trim()) {
			setCode(pastedText);
			const detectedLang = detectLanguage(pastedText);
			if (detectedLang) {
				setCurrentLanguage(detectedLang);
				if (onLanguageChange) {
					onLanguageChange(detectedLang);
				}
			}
			if (onCodeChange) {
				onCodeChange(pastedText);
			}
			e.preventDefault();
		}
	};

	const handleLanguageChange = (newLang: string) => {
		const normalized = normalizeLanguage(newLang);
		if (normalized) {
			setCurrentLanguage(normalized);
			if (onLanguageChange) {
				onLanguageChange(normalized);
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Tab") {
			e.preventDefault();
			const textarea = textareaRef.current;
			if (textarea) {
				const start = textarea.selectionStart;
				const end = textarea.selectionEnd;
				const newCode = `${code.substring(0, start)}  ${code.substring(end)}`;
				setCode(newCode);
				setTimeout(() => {
					textarea.selectionStart = textarea.selectionEnd = start + 2;
				}, 0);
			}
		}
	};

	return (
		<div
			className={twMerge(
				"rounded-none border border-border-primary bg-bg-input overflow-hidden",
				className,
			)}
		>
			<div className="flex h-10 items-center gap-3 border-b border-border-primary px-4">
				<div className="h-2.5 w-2.5 rounded-full bg-accent-red" />
				<div className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
				<div className="h-2.5 w-2.5 rounded-full bg-accent-green" />
				<div className="flex-1" />
				{showLanguageSelector && (
					<select
						value={currentLanguage}
						onChange={(e) => handleLanguageChange(e.target.value)}
						className="bg-bg-surface border border-border-primary rounded px-2 py-1 text-xs font-mono text-text-secondary focus:outline-none focus:ring-1 focus:ring-border-primary"
					>
						{SUPPORTED_LANGUAGES.map((lang) => (
							<option key={lang} value={lang}>
								{LANGUAGE_LABELS[lang]}
							</option>
						))}
					</select>
				)}
				{filename && (
					<span className="font-mono text-xs text-text-tertiary">
						{filename}
					</span>
				)}
			</div>
			<div
				className="relative h-80 overflow-y-auto overflow-x-hidden scrollbar-thin"
				style={{ scrollbarColor: "#3a3a3a transparent" }}
			>
				<div className="flex">
					<div className="flex w-10 flex-none flex-col gap-1.5 border-r border-border-primary bg-bg-surface px-2.5 py-3 text-right font-mono text-xs text-text-tertiary">
						{code.split("\n").map((_, i) => (
							<span key={i}>{i + 1}</span>
						))}
					</div>
					<div className="relative flex-1">
						<div
							className="pointer-events-none p-3 font-mono text-sm"
							dangerouslySetInnerHTML={{ __html: html }}
						/>
						<textarea
							ref={textareaRef}
							value={code}
							onChange={(e) => handleCodeChange(e.target.value)}
							onPaste={handlePaste}
							onKeyDown={handleKeyDown}
							placeholder={placeholder}
							spellCheck={false}
							className="absolute inset-0 size-full resize-none bg-transparent p-3 font-mono text-sm text-transparent caret-text-primary placeholder:text-text-tertiary focus:outline-none"
							style={{ tabSize: 2 }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

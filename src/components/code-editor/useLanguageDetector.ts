import hljs from "highlight.js";

const SUPPORTED_LANGUAGES = [
	"javascript",
	"typescript",
	"python",
	"java",
	"go",
	"rust",
	"ruby",
	"php",
	"sql",
	"html",
	"css",
	"json",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_ALIASES: Record<string, string> = {
	js: "javascript",
	ts: "typescript",
	py: "python",
	rb: "ruby",
	sh: "bash",
	shell: "bash",
	yml: "yaml",
};

export function detectLanguage(code: string): SupportedLanguage | null {
	if (!code || code.trim().length === 0) {
		return null;
	}

	const result = hljs.highlightAuto(code, [...SUPPORTED_LANGUAGES]);

	if (result.language && isSupported(result.language)) {
		return result.language as SupportedLanguage;
	}

	return null;
}

export function isSupported(lang: string): lang is SupportedLanguage {
	return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export function normalizeLanguage(lang: string): SupportedLanguage | null {
	const normalized = lang.toLowerCase().trim();

	if (isSupported(normalized)) {
		return normalized;
	}

	const alias = LANGUAGE_ALIASES[normalized];
	if (alias && isSupported(alias)) {
		return alias;
	}

	return null;
}

export { SUPPORTED_LANGUAGES };

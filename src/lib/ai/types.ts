import { z } from "zod";

export const severityEnum = z.enum(["error", "warning", "info"]);
export type Severity = z.infer<typeof severityEnum>;

export const verdictEnum = z.enum([
	"needs_urgent_help",
	"serious_problems",
	"needs_improvement",
	"acceptable",
]);
export type Verdict = z.infer<typeof verdictEnum>;

export const issueSchema = z.object({
	title: z.string(),
	description: z.string(),
	severity: severityEnum,
	lineNumber: z.number().nullable(),
});
export type Issue = z.infer<typeof issueSchema>;

export const suggestionSchema = z.object({
	originalCode: z.string(),
	suggestedCode: z.string(),
	explanation: z.string(),
});
export type Suggestion = z.infer<typeof suggestionSchema>;

export const roastResultSchema = z.object({
	score: z.number().min(0).max(10),
	verdict: verdictEnum,
	roastQuote: z.string(),
	issues: z.array(issueSchema),
	suggestions: z.array(suggestionSchema),
});
export type RoastResult = z.infer<typeof roastResultSchema>;

export const supportedLanguageSchema = z.enum([
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
]);
export type SupportedLanguage = z.infer<typeof supportedLanguageSchema>;

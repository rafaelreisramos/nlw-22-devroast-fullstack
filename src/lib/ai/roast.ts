"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { roastResultSchema, type SupportedLanguage } from "./types";

function buildPrompt(
	code: string,
	language: SupportedLanguage,
	roastMode: boolean,
): string {
	const modeInstruction = roastMode
		? "Use sarcastic, humorous language. Be brutally honest but entertaining."
		: "Be professional and constructive. Focus on actionable improvements.";

	return `You are a code reviewer analyzing the following ${language} code.
Mode: ${roastMode ? "ROAST" : "SERIOUS"}
${modeInstruction}

Analyze the code and return ONLY a valid JSON object with this exact structure:
{
  "score": number (0-10, lower = worse code),
  "verdict": "needs_urgent_help" | "serious_problems" | "needs_improvement" | "acceptable",
  "roastQuote": string (a ${roastMode ? "sarcastic" : "professional"} quote about the code quality),
  "issues": [
    {
      "title": string (brief issue title),
      "description": string (detailed explanation),
      "severity": "error" | "warning" | "info",
      "lineNumber": number | null
    }
  ],
  "suggestions": [
    {
      "originalCode": string (exact code to replace),
      "suggestedCode": string (improved version),
      "explanation": string (why this improves the code)
    }
  ]
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\``;
}

export async function analyzeCode(
	code: string,
	language: SupportedLanguage,
	roastMode: boolean,
) {
	const model = google("gemini-2.5-flash");
	const prompt = buildPrompt(code, language, roastMode);

	const { text } = await generateText({
		model,
		prompt,
	});

	const jsonMatch = text.match(/\{[\s\S]*\}/);
	if (!jsonMatch) {
		throw new Error("Failed to parse AI response");
	}

	const parsed = JSON.parse(jsonMatch[0]);
	return roastResultSchema.parse(parsed);
}

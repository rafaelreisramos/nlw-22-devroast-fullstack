# Code Roast Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable users to submit code for AI analysis with roast/serious modes and view results.

**Architecture:** Single prompt to Gemini via AI SDK, save structured result to PostgreSQL via Drizzle, display on result page.

**Tech Stack:** @ai-sdk/gemini, Vercel AI SDK, tRPC, Drizzle ORM, PostgreSQL

---

## File Structure

```
src/
├── trpc/
│   └── routers/
│       └── _app.ts          # Add roast router
├── components/
│   └── code-section.tsx     # Update with mutation + redirect
├── hooks/
│   └── useRoastSubmit.ts    # Create mutation hook
├── app/
│   └── roast/[id]/
│       └── page.tsx         # Update with real data
└── lib/
    └── ai/
        ├── roast.ts         # Create prompt builder + AI call
        └── types.ts         # Create types for roast result
```

---

## Tasks

### Task 1: Install AI SDK

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install @ai-sdk/gemini**

Run: `npm install @ai-sdk/gemini ai`
Expected: Package installed successfully

---

### Task 2: Create AI Types and Prompt Builder

**Files:**
- Create: `src/lib/ai/types.ts`
- Create: `src/lib/ai/roast.ts`

- [ ] **Step 1: Create types.ts**

```typescript
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
```

- [ ] **Step 2: Create roast.ts**

```typescript
"use server";

import { generateText } from "ai";
import { gemini } from "@ai-sdk/gemini";
import { roastResultSchema, type SupportedLanguage } from "./types";

function buildPrompt(
  code: string,
  language: SupportedLanguage,
  roastMode: boolean
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
  roastMode: boolean
) {
  const model = gemini("gemini-2.0-flash");
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
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/ai/types.ts src/lib/ai/roast.ts package.json package-lock.json
git commit -m "feat(ai): add roast types and prompt builder"
```

---

### Task 3: Create tRPC Roast Router

**Files:**
- Modify: `src/trpc/routers/_app.ts`

- [ ] **Step 1: Add roast router**

Modify `src/trpc/routers/_app.ts` to add:

```typescript
import { z } from "zod";
import { db } from "@/db";
import { issues, submissions, suggestions } from "@/db/schema";
import { analyzeCode, supportedLanguageSchema } from "@/lib/ai/roast";
import { eq } from "drizzle-orm";

// Add to appRouter:
roast: createTRPCRouter({
  submit: baseProcedure
    .input(
      z.object({
        code: z.string().min(1).max(2000),
        language: supportedLanguageSchema,
        roastMode: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const { code, language, roastMode } = input;

      const result = await analyzeCode(code, language, roastMode);
      const lineCount = code.split("\n").length;

      const [submission] = await db
        .insert(submissions)
        .values({
          code,
          language,
          score: result.score,
          verdict: result.verdict,
          roastQuote: result.roastQuote,
          lineCount,
        })
        .returning();

      if (result.issues.length > 0) {
        await db.insert(issues).values(
          result.issues.map((issue) => ({
            submissionId: submission.id,
            title: issue.title,
            description: issue.description,
            severity: issue.severity,
            lineNumber: issue.lineNumber,
          }))
        );
      }

      if (result.suggestions.length > 0) {
        await db.insert(suggestions).values(
          result.suggestions.map((s) => ({
            submissionId: submission.id,
            originalCode: s.originalCode,
            suggestedCode: s.suggestedCode,
            explanation: s.explanation,
          }))
        );
      }

      return { id: submission.id };
    }),

  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const submission = await db.query.submissions.findFirst({
        where: eq(submissions.id, input.id),
      });

      if (!submission) {
        throw new Error("Submission not found");
      }

      const submissionIssues = await db.query.issues.findMany({
        where: eq(issues.submissionId, input.id),
      });

      const submissionSuggestions = await db.query.suggestions.findMany({
        where: eq(suggestions.submissionId, input.id),
      });

      return {
        ...submission,
        issues: submissionIssues,
        suggestions: submissionSuggestions,
      };
    }),
}),
```

- [ ] **Step 2: Commit**

```bash
git add src/trpc/routers/_app.ts
git commit -m "feat(trpc): add roast.submit and roast.getById procedures"
```

---

### Task 4: Create useRoastSubmit Hook

**Files:**
- Create: `src/hooks/useRoastSubmit.ts`

- [ ] **Step 1: Create hook**

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { SupportedLanguage } from "@/lib/ai/types";

export function useRoastSubmit() {
  const router = useRouter();
  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.roast.submit.mutationOptions({
      onSuccess: (data) => {
        router.push(`/roast/${data.id}`);
      },
    })
  );

  return {
    submit: (code: string, language: SupportedLanguage, roastMode: boolean) =>
      mutation.mutateAsync({ code, language, roastMode }),
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useRoastSubmit.ts
git commit -m "feat(hooks): add useRoastSubmit hook"
```

---

### Task 5: Update CodeSection

**Files:**
- Modify: `src/components/code-section.tsx`

- [ ] **Step 1: Update component**

```tsx
"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor/CodeEditor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useRoastSubmit } from "@/hooks/useRoastSubmit";
import type { SupportedLanguage } from "@/lib/ai/types";

export function CodeSection() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [roastMode, setRoastMode] = useState(true);
  const { submit, isPending } = useRoastSubmit();

  const isCodeValid = code.length > 0 && code.length <= 2000;

  const handleSubmit = () => {
    if (isCodeValid) {
      submit(code, language, roastMode);
    }
  };

  return (
    <>
      <CodeEditor
        code={code}
        language={language}
        onCodeChange={setCode}
        onLanguageChange={setLanguage}
        showLanguageSelector
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Toggle checked={roastMode} onCheckedChange={setRoastMode} />
            <span className="font-mono text-sm text-accent-green">
              roast mode
            </span>
          </div>
          <span className="font-mono text-xs text-text-tertiary">
            {roastMode ? "// maximum sarcasm enabled" : "// professional analysis"}
          </span>
        </div>
        <Button disabled={!isCodeValid || isPending} onClick={handleSubmit}>
          {isPending ? "$ roasting..." : "$ roast_my_code"}
        </Button>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/code-section.tsx
git commit -m "feat(homepage): wire up roast submit with redirect"
```

---

### Task 6: Update Roast Result Page

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Update page to use real data**

```tsx
import { notFound } from "next/navigation";
import { db } from "@/db";
import { issues, submissions, suggestions } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";
import { eq } from "drizzle-orm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await db.query.submissions.findFirst({
    where: eq(submissions.id, id),
  });

  if (!submission) {
    return { title: "Roast Not Found | DevRoast" };
  }

  return {
    title: `Roast Result (${submission.score}/10) | DevRoast`,
    description: submission.roastQuote,
  };
}

function formatVerdict(verdict: string): string {
  return verdict.replace(/_/g, "_");
}

export default async function RoastResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const submission = await db.query.submissions.findFirst({
    where: eq(submissions.id, id),
  });

  if (!submission) {
    notFound();
  }

  const submissionIssues = await db.query.issues.findMany({
    where: eq(issues.submissionId, id),
  });

  const submissionSuggestions = await db.query.suggestions.findMany({
    where: eq(suggestions.submissionId, id),
  });

  const diffLines = submissionSuggestions.flatMap((s) => [
    { type: "removed" as const, prefix: "-", content: s.originalCode },
    { type: "added" as const, prefix: "+", content: s.suggestedCode },
  ]);

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page px-20 py-10">
      <div className="flex w-full max-w-5xl flex-col gap-10">
        {/* Score Hero */}
        <div className="flex items-center justify-center gap-12">
          <ScoreRing score={submission.score} />

          <div className="flex flex-col gap-4">
            <Badge variant="verdict">
              verdict: {formatVerdict(submission.verdict)}
            </Badge>

            <p className="font-mono text-xl leading-relaxed text-text-primary">
              {submission.roastQuote}
            </p>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-text-tertiary">
                lang: {submission.language}
              </span>
              <span className="text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">
                {submission.lineCount} lines
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border-primary" />

        {/* Submitted Code Section */}
        <div className="flex flex-col gap-4">
          <SectionTitle>your_submission</SectionTitle>

          <div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
            <CodeBlock
              code={submission.code}
              language={submission.language}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border-primary" />

        {/* Analysis Section */}
        <div className="flex flex-col gap-6">
          <SectionTitle>detailed_analysis</SectionTitle>

          <div className="grid grid-cols-2 gap-5">
            {submissionIssues.map((issue) => (
              <Card key={issue.id}>
                <Badge variant={issue.severity}>{issue.severity}</Badge>
                <CardTitle>{issue.title}</CardTitle>
                <CardDescription>{issue.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border-primary" />

        {/* Suggested Fix Section */}
        {submissionSuggestions.length > 0 && (
          <div className="flex flex-col gap-6">
            <SectionTitle>suggested_fix</SectionTitle>

            <div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
              <div className="flex h-10 items-center gap-2 border-b border-border-primary px-4">
                <span className="font-mono text-xs text-text-secondary">
                  your_code.ts → improved_code.ts
                </span>
              </div>

              <div className="flex flex-col py-1">
                {diffLines.map((line, index) => (
                  <DiffLine
                    key={index}
                    type={line.type}
                    prefix={line.prefix}
                  >
                    {line.content}
                  </DiffLine>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/\[id\]/page.tsx
git commit -m "feat(roast-page): connect to database with real data"
```

---

### Task 7: Add Environment Variable

**Files:**
- Create: `.env.local.example` (if not exists)
- Modify: `.env.local` (for local development)

- [ ] **Step 1: Add GEMINI_API_KEY to .env.local.example**

Add to `.env.local.example`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

- [ ] **Step 2: Commit**

```bash
git add .env.local.example
git commit -m "docs: add GEMINI_API_KEY to env example"
```

---

### Task 8: Test the Feature

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Test submission flow**

1. Navigate to homepage
2. Paste code in editor
3. Toggle roast mode on/off
4. Click "Roast My Code"
5. Verify redirect to result page
6. Verify score, verdict, issues, suggestions display correctly

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Run format**

Run: `npm run format`
Expected: Files formatted correctly

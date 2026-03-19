# Code Roast Feature Design

## Overview

Enable users to submit code snippets for AI-powered analysis with two modes: sarcastic "roast" or professional "serious" feedback.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│    tRPC     │────▶│  AI SDK +   │
│  (React)    │     │   Router    │     │   Gemini    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Database   │
                    │  (Drizzle)  │
                    └─────────────┘
```

**Flow:**
1. User pastes code + selects roast mode
2. Frontend calls `roast.submit` mutation
3. Backend builds prompt based on mode
4. Calls Gemini via AI SDK → receives structured JSON
5. Saves submission + issues + suggestions to database
6. Returns `id` for redirect to result page

## tRPC API

### `roast.submit`

**Input:**
```typescript
{
  code: string;        // max 2000 chars
  language: SupportedLanguage;
  roastMode: boolean;  // true = sarcastic, false = serious
}
```

**Output:**
```typescript
{
  id: string;  // submission ID for redirect
}
```

**Errors:**
- `CODE_TOO_LONG` - code exceeds 2000 characters
- `EMPTY_CODE` - code is empty
- `INVALID_LANGUAGE` - unsupported language
- `AI_ERROR` - Gemini API failure

### `roast.getById`

**Input:**
```typescript
{ id: string }
```

**Output:**
```typescript
{
  id: string;
  code: string;
  language: SupportedLanguage;
  score: number;         // 0-10
  verdict: VerdictType; // needs_urgent_help | serious_problems | needs_improvement | acceptable
  roastQuote: string;    // humorous/sarcastic quote
  lineCount: number;
  createdAt: Date;
  issues: Issue[];
  suggestions: Suggestion[];
}
```

## Gemini Prompt

### System Prompt
```
You are a code reviewer analyzing the following {language} code.
Mode: {roastMode ? "ROAST" : "SERIOUS"}

Analyze the code and return a JSON object with:
{
  "score": number (0-10, lower = worse),
  "verdict": "needs_urgent_help" | "serious_problems" | "needs_improvement" | "acceptable",
  "roastQuote": string (humorous quote about the code, required even in serious mode),
  "issues": [
    {
      "title": string,
      "description": string,
      "severity": "error" | "warning" | "info",
      "lineNumber": number | null
    }
  ],
  "suggestions": [
    {
      "originalCode": string,
      "suggestedCode": string,
      "explanation": string
    }
  ]
}
```

### User Prompt
Analyze this {language} code:
```{language}
{code}
```

## Components

### CodeSection (update)
- Keep: CodeEditor, Toggle, Button
- Add: `useRoastSubmit` hook for mutation
- On submit: disable button + loading → redirect to `/roast/[id]`

### useRoastSubmit hook
```typescript
// return
{
  submit: (code: string, language: SupportedLanguage, roastMode: boolean) => Promise<string>;
  isPending: boolean;
  error: Error | null;
}
```

### /roast/[id]/page
- Server Component (already async, can use `generateStaticParams`)
- All components reuse existing UI primitives:
  - `ScoreRing` - exists, Server Component
  - `Badge` with variant="verdict" - exists, Server Component
  - `CodeBlock` / `CodeBlockContent` - exists, Server Component (uses `use cache`)
  - `DiffLine` - exists, Server Component
  - Issues rendered inline with `Card` + `Badge` - Server Component
- No new components needed

## Tech Stack

- **@ai-sdk/gemini** - Vercel AI SDK provider for Gemini
- **generateText()** - single call with structured prompt
- JSON parsing with Zod validation

## Out of Scope

- Share roast functionality (future feature)
- Streaming responses
- Multiple code files per submission

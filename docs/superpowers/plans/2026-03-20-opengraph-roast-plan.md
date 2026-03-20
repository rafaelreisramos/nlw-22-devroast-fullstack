# OpenGraph Image for Roast Results Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dynamic OpenGraph metadata and OG image generation for roast result pages using Takumi.

**Architecture:** 
- Route handler at `/roast/[id]/opengraph-image` fetches data via tRPC and generates PNG using Takumi
- Metadata in `generateMetadata` includes twitter/opengraph tags pointing to the image route
- 1-year immutable cache headers for optimal performance

**Tech Stack:** Next.js, Takumi, tRPC, Geist/Geist Mono fonts

---

## Task 1: Update generateMetadata in page.tsx

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Update generateMetadata**

Locate the existing `generateMetadata` function and update it to include twitter and opengraph metadata:

```tsx
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
    title: `${submission.score}/10 - ${submission.language} | DevRoast`,
    description: submission.roastQuote,
    twitter: {
      card: "summary_large_image",
      images: [`/roast/${submission.id}/opengraph-image`],
    },
    openGraph: {
      title: `${submission.score}/10 - ${submission.language} | DevRoast`,
      description: submission.roastQuote,
      images: [{ url: `/roast/${submission.id}/opengraph-image` }],
    },
  };
}
```

- [ ] **Step 2: Run lint check**

Run: `npm run lint`
Expected: No errors related to the changes

- [ ] **Step 3: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat(roast): add twitter/opengraph metadata to roast results page"
```

---

## Task 2: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Takumi package**

Run: `npm install @takumi-rs/image-response`
Expected: Package added to package.json

Note: The `@takumi-rs/image-response` package bundles Geist and Geist Mono fonts by default. Reference: https://takumi.kane.tw/docs/migration/image-response

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add @takumi-rs/image-response for OG image generation"
```

---

## Task 3: Create OG Image template

**Files:**
- Create: `src/app/roast/[id]/opengraph-image/template.tsx`

- [ ] **Step 1: Create template directory**

Run: `mkdir -p src/app/roast/[id]/opengraph-image`

- [ ] **Step 2: Create template component**

```tsx
type OpenGraphData = {
  score: number;
  language: string;
  verdict: string;
  roastQuote: string;
  lineCount: number;
};

export function OpenGraphImageTemplate(data: OpenGraphData) {
  const { score, language, verdict, roastQuote, lineCount } = data;

  const verdictColor = verdict.includes("urgent")
    ? "#ef4444"
    : verdict.includes("serious")
      ? "#ef4444"
      : verdict.includes("improvement")
        ? "#f59e0b"
        : "#10b981";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        padding: "64px",
        gap: "28px",
        fontFamily: "Geist, system-ui, sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#10b981", fontSize: "24px", fontWeight: 700 }}>
          {">"}
        </span>
        <span style={{ color: "#e5e5e5", fontSize: "20px", fontWeight: 500 }}>
          devroast
        </span>
      </div>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
        <span
          style={{
            color: "#f59e0b",
            fontSize: "160px",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            color: "#737373",
            fontSize: "56px",
            fontWeight: 400,
            lineHeight: 1,
            marginBottom: "20px",
          }}
        >
          /10
        </span>
      </div>

      {/* Verdict */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: verdictColor,
          }}
        />
        <span style={{ color: verdictColor, fontSize: "20px" }}>
          {verdict.replace(/_/g, " ")}
        </span>
      </div>

      {/* Language info */}
      <span
        style={{
          color: "#737373",
          fontSize: "16px",
          fontFamily: "Geist Mono, monospace",
        }}
      >
        lang: {language} · {lineCount} lines
      </span>

      {/* Quote */}
      <div
        style={{
          maxWidth: "100%",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "#e5e5e5",
            fontSize: "22px",
            lineHeight: 1.5,
          }}
        >
          "{roastQuote}"
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run lint check**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/roast/[id]/opengraph-image/template.tsx
git commit -m "feat(og): add OpenGraph image template for roast results"
```

---

## Task 4: Create Takumi wrapper

**Files:**
- Create: `src/lib/takumi.ts`

- [ ] **Step 1: Create Takumi wrapper**

```typescript
import { ImageResponse } from "@takumi-rs/image-response";
import { OpenGraphImageTemplate } from "@/app/roast/[id]/opengraph-image/template";

type OpenGraphData = {
  score: number;
  language: string;
  verdict: string;
  roastQuote: string;
  lineCount: number;
};

export async function generateOpenGraphImage(data: OpenGraphData) {
  const response = new ImageResponse(OpenGraphImageTemplate(data), {
    width: 1200,
    height: 630,
  });

  return response;
}
```

Note: The `ImageResponse` class from `@takumi-rs/image-response` extends the standard Web `Response` class and handles SVG→PNG conversion internally. It returns a `Response` object directly.

- [ ] **Step 2: Run lint check**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/takumi.ts
git commit -m "feat(lib): add Takumi wrapper for image generation"
```

---

## Task 5: Create OG Image route

**Files:**
- Create: `src/app/roast/[id]/opengraph-image/route.ts`

- [ ] **Step 1: Create route handler with tRPC**

```typescript
import { NextRequest } from "next/server";
import { generateOpenGraphImage } from "@/lib/takumi";
import { createCaller } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const caller = createCaller({});
  
  let submission;
  try {
    submission = await caller.roast.getById({ id });
  } catch {
    return new Response("Submission not found", { status: 404 });
  }

  const response = await generateOpenGraphImage({
    score: submission.score,
    language: submission.language,
    verdict: submission.verdict,
    roastQuote: submission.roastQuote,
    lineCount: submission.lineCount,
  });

  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return response;
}
```

Note: The tRPC `createCaller` function is available from `@/trpc/init`. It creates a server-side caller without HTTP overhead.

- [ ] **Step 2: Run lint check**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Test the route manually**

Run dev server and visit: `http://localhost:3000/roast/[uuid]/opengraph-image`

Expected: PNG image returned with 200 status and cache headers

- [ ] **Step 4: Commit**

```bash
git add src/app/roast/[id]/opengraph-image/route.ts
git commit -m "feat(og): add OpenGraph image route handler for roast results"
```

---

## Task 6: Verify integration

- [ ] **Step 1: Test full flow**

1. Create a roast submission via the app
2. Visit the roast result page
3. Check page source or use social media debuggers:
   - Twitter: https://cards-dev.twitter.com/validator
   - Facebook: https://developers.facebook.com/tools/debug/
4. Verify metadata is present and image URL is correct

- [ ] **Step 2: Verify cache headers**

Run: `curl -I http://localhost:3000/roast/[uuid]/opengraph-image`

Expected: `Cache-Control: public, max-age=31536000, immutable`

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: add OpenGraph image support for roast sharing"
```

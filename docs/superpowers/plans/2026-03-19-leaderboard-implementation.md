# Leaderboard Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar página `/leaderboard` com backend tRPC e frontend Server Component, exibindo 20 entries do shame leaderboard com collapsible inline.

**Architecture:** Server Component com prefetch via tRPC + Client Components para UI interativa (collapsible). Reaproveitar componentes existentes (`LeaderboardRow`, `CollapsibleCode`).

**Tech Stack:** Next.js, tRPC, TanStack Query, Shiki, Drizzle ORM, Tailwind CSS

---

## File Structure

```
src/
├── trpc/routers/_app.ts              # Add 2 new procedures
├── trpc/server.ts                    # Fix prefetch generic type
├── app/leaderboard/page.tsx          # Convert to Server Component
└── components/
    ├── leaderboard-content.tsx        # Create (Server Component)
    ├── leaderboard-entry.tsx         # Create (Client Component)
    ├── leaderboard-skeleton.tsx      # Create
    └── ui/collapsible-code.tsx       # Modify (add expandedContent)
```

---

## Tasks

### Task 1: Add tRPC Procedures

**Files:**
- Modify: `src/trpc/routers/_app.ts`
- Modify: `src/trpc/server.ts` (fix generic prefetch)

- [ ] **Step 1: Add new procedures to shameLeaderboard router**

```typescript
// Add inside shameLeaderboard router:
getLeaderboardPage: baseProcedure.query(async () => {
  return getShameLeaderboard(20);
}),
getLeaderboardStats: baseProcedure.query(async () => {
  return getLeaderboardStats();
}),
```

- [ ] **Step 2: Fix prefetch function to be generic**

In `src/trpc/server.ts`:

```typescript
import type { FetchQueryOptions } from "@tanstack/react-query";

export function prefetch<TQueryFnData, TError, TData, TQueryKey extends readonly unknown[]>(
  queryOptions: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(queryOptions);
}
```

- [ ] **Step 3: Run lint check**

```bash
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/trpc/routers/_app.ts src/trpc/server.ts
git commit -m "feat(trpc): add getLeaderboardPage and getLeaderboardStats procedures"
```

---

### Task 2: Create LeaderboardEntry Component

**Files:**
- Create: `src/components/leaderboard-entry.tsx`
- Modify: `src/components/ui/collapsible-code.tsx`

- [ ] **Step 1: Modify CollapsibleCode to accept expandedContent**

Update interface and render logic:

```typescript
interface CollapsibleCodeProps {
  html: string;
  expandedContent?: string;  // ADD THIS
}

// Inside component, add below toggle button:
{isExpanded && expandedContent && (
  <div className="border-t border-border-primary px-4 py-2">
    <span className="font-mono text-xs text-text-tertiary">
      {expandedContent}
    </span>
  </div>
)}
```

- [ ] **Step 2: Create LeaderboardEntry component**

```tsx
"use client";

import { CollapsibleCode } from "@/components/ui/collapsible-code";
import {
  LeaderboardRow,
  LeaderboardRowRank,
  LeaderboardRowScore,
  LeaderboardRowCode,
  LeaderboardRowLanguage,
} from "@/components/ui/leaderboard-row";

type LeaderboardEntryProps = {
  item: {
    id: string;
    code: string;
    language: string;
    score: number;
    line_count: number;
    html: string;
  };
  rank: number;
};

export function LeaderboardEntry({ item, rank }: LeaderboardEntryProps) {
  return (
    <LeaderboardRow>
      <LeaderboardRowRank>{rank}</LeaderboardRowRank>
      <LeaderboardRowScore>{item.score.toFixed(1)}</LeaderboardRowScore>
      <LeaderboardRowCode>
        <CollapsibleCode
          html={item.html}
          expandedContent={`${item.line_count} lines`}
        />
      </LeaderboardRowCode>
      <LeaderboardRowLanguage>{item.language}</LeaderboardRowLanguage>
    </LeaderboardRow>
  );
}
```

- [ ] **Step 3: Run lint check**

```bash
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/leaderboard-entry.tsx src/components/ui/collapsible-code.tsx
git commit -m "feat(leaderboard): create LeaderboardEntry with collapsible code"
```

---

### Task 3: Create LeaderboardContent (Server Component)

**Files:**
- Create: `src/components/leaderboard-content.tsx`

- [ ] **Step 1: Create LeaderboardContent component**

```tsx
import { codeToHtml } from "shiki";
import { getShameLeaderboard, getLeaderboardStats } from "@/db/queries";
import { LeaderboardEntry } from "@/components/leaderboard-entry";

type LeaderboardItemWithHtml = Awaited<ReturnType<typeof getShameLeaderboard>>[number] & {
  html: string;
};

async function LeaderboardContent() {
  const [items, stats] = await Promise.all([
    getShameLeaderboard(20),
    getLeaderboardStats(),
  ]);

  const itemsWithHtml: LeaderboardItemWithHtml[] = await Promise.all(
    items.map(async (item) => ({
      ...item,
      html: await codeToHtml(item.code, {
        lang: item.language,
        theme: "vesper",
      }),
    }))
  );

  return (
    <>
      {/* Stats Row */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-text-tertiary">
          {Number(stats?.total ?? 0).toLocaleString()} submissions
        </span>
        <span className="text-text-tertiary">·</span>
        <span className="font-mono text-xs text-text-tertiary">
          avg score: {Number(stats?.avg_score ?? 0).toFixed(1)}/10
        </span>
      </div>

      {/* Leaderboard Entries */}
      <div className="flex flex-col gap-5">
        {itemsWithHtml.map((item, index) => (
          <LeaderboardEntry key={item.id} item={item} rank={index + 1} />
        ))}
      </div>
    </>
  );
}

export { LeaderboardContent };
```

- [ ] **Step 2: Run lint check**

```bash
npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add src/components/leaderboard-content.tsx
git commit -m "feat(leaderboard): create LeaderboardContent Server Component"
```

---

### Task 4: Create LeaderboardSkeleton

**Files:**
- Create: `src/components/leaderboard-skeleton.tsx`

- [ ] **Step 1: Create skeleton component**

```tsx
export function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-sm border border-border-primary bg-bg-input"
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Run lint check**

```bash
npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add src/components/leaderboard-skeleton.tsx
git commit -m "feat(leaderboard): create LeaderboardSkeleton component"
```

---

### Task 5: Convert Leaderboard Page to Server Component

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

- [ ] **Step 1: Rewrite page as Server Component**

```tsx
import { Suspense } from "react";
import { LeaderboardContent } from "@/components/leaderboard-content";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";
import { HydrateClient } from "@/trpc/hydrate-client";
import { prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shame Leaderboard | DevRoast",
  description: "The most roasted code on the internet - ranked by shame",
};

export default function LeaderboardPage() {
  prefetch(trpc.shameLeaderboard.getLeaderboardPage.queryOptions());

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center bg-bg-page px-20 py-10">
      <div className="flex w-full max-w-5xl flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[32px] font-bold text-accent-green">
              &gt;
            </span>
            <h1 className="font-mono text-[28px] font-bold text-text-primary">
              shame_leaderboard
            </h1>
          </div>

          <p className="font-mono text-sm text-text-secondary">
            {`// the most roasted code on the internet`}
          </p>
        </div>

        <HydrateClient>
          <Suspense fallback={<LeaderboardSkeleton />}>
            <LeaderboardContent />
          </Suspense>
        </HydrateClient>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Run lint check**

```bash
npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat(leaderboard): convert page to Server Component with tRPC"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Run full lint**

```bash
npm run lint && npm run build
```

- [ ] **Step 2: Test in browser**

Navigate to `/leaderboard` and verify:
- [ ] Page loads without errors
- [ ] 20 entries display
- [ ] Collapsible works (expand/collapse)
- [ ] line_count shows when expanded

---

## Summary

| Task | Files | Actions |
|------|-------|---------|
| 1 | `_app.ts`, `server.ts` | Add 2 procedures + fix prefetch |
| 2 | `leaderboard-entry.tsx`, `collapsible-code.tsx` | Create entry, modify collapsible |
| 3 | `leaderboard-content.tsx` | Create Server Component |
| 4 | `leaderboard-skeleton.tsx` | Create skeleton |
| 5 | `leaderboard/page.tsx` | Convert to Server Component |

**Total: 5 tasks, ~25 minutes estimated**

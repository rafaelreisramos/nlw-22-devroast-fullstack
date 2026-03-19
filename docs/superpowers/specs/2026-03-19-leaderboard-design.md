# Leaderboard Page - Backend + Frontend Integration

**Date:** 2026-03-19
**Topic:** Leaderboard page full-stack implementation
**Status:** Implemented

---

## 1. Overview

Implemented the page `/leaderboard` with:
- Backend: tRPC procedures for fetching 20 shame leaderboard items and stats
- Frontend: Server Component with prefetch + components reused from home page
- Each entry has inline collapsible showing `line_count` when expanded

---

## 2. Backend Changes

### 2.1 New tRPC Procedures (`src/trpc/routers/_app.ts`)

```typescript
shameLeaderboard: createTRPCRouter({
  getItems: baseProcedure.query(async () => {
    return getShameLeaderboard(3);  // existing - home page
  }),
  getTotalCount: baseProcedure.query(async () => {
    return getTotalRoastsCount();  // existing - home page
  }),
  // NEW:
  getLeaderboardPage: baseProcedure.query(async () => {
    return getShameLeaderboard(20);  // 20 items for full page
  }),
  getLeaderboardStats: baseProcedure.query(async () => {
    return getLeaderboardStats();
  }),
}),
```

### 2.2 Database Functions (already exist)
- `getShameLeaderboard(limit)` — returns items ordered by score ASC, created_at DESC
- `getLeaderboardStats()` — returns total count and avg score

---

## 3. Frontend Changes

### 3.1 Page Component (`src/app/leaderboard/page.tsx`)

Server Component with:
- `export const dynamic = "force-dynamic"` — prevents static generation
- `prefetch(trpc.shameLeaderboard.getLeaderboardPage.queryOptions())`
- `HydrateClient` wrapping `LeaderboardContent`

### 3.2 LeaderboardContent (`src/components/leaderboard-content.tsx`)

Server Component that:
1. Fetches 20 items via `getShameLeaderboard(20)` (direct database access in Server Component)
2. Fetches stats via `getLeaderboardStats()`
3. Uses `Promise.all` for parallel fetching
4. Processes code with `shiki` (codeToHtml with "vesper" theme)
5. Renders stats header and `LeaderboardEntry` list

### 3.3 LeaderboardEntry (Client Component)

```typescript
"use client";

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

### 3.4 CollapsibleCode Enhancement

Added `expandedContent?: string` prop to display additional info when expanded.

### 3.5 Skeleton Component

`src/components/leaderboard-skeleton.tsx` with 5 animated skeleton rows.

---

## 4. Files Created/Modified

| File | Action |
|------|--------|
| `src/trpc/routers/_app.ts` | Add 2 new procedures |
| `src/trpc/server.ts` | Make prefetch function generic |
| `src/app/leaderboard/page.tsx` | Convert to Server Component |
| `src/components/leaderboard-content.tsx` | Create (Server Component) |
| `src/components/leaderboard-entry.tsx` | Create (Client Component) |
| `src/components/leaderboard-skeleton.tsx` | Create |
| `src/components/ui/collapsible-code.tsx` | Add expandedContent prop |

---

## 5. Data Flow

```
leaderboard/page.tsx (Server)
  └─ prefetch(tRPC queries)
  └─ <HydrateClient><LeaderboardContent /></HydrateClient>

leaderboard-content.tsx (Server)
  └─ Promise.all([getShameLeaderboard(20), getLeaderboardStats()])
  └─ codeToHtml() per item
  └─ Render LeaderboardEntry list

leaderboard-entry.tsx (Client)
  └─ LeaderboardRow structure
  └─ CollapsibleCode with toggle

collapsible-code.tsx (Client)
  └─ useState(isExpanded)
  └─ Show line_count when expanded
```

---

## 6. Testing Checklist

- [x] tRPC procedures added and working
- [x] Stats (total, avg) display correctly
- [x] Each entry has working expand/collapse
- [x] line_count shows when expanded
- [x] Loading skeleton renders
- [x] Lint passes
- [x] Build completes (with DATABASE_URL)

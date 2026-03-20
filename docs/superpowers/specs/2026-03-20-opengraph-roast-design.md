# OpenGraph Image for Roast Results

## Status

- Status: Approved
- Date: 2026-03-20

## Context

When users share their roast results on social media (Twitter, Discord, WhatsApp, etc.), we want to display a rich preview card with:
- The roast score prominently displayed
- The roast quote
- Language and line count
- DevRoast branding

## Decision

### Architecture Overview

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Twitter/  │────▶│  GET /roast/[id] │────▶│  takumi     │
│   Discord   │     │  /opengraph-image│     │  generate() │
│   Bot       │     └────────┬─────────┘     └─────────────┘
└─────────────┘              │                       │
                             ▼                       ▼
                    ┌───────────────┐         ┌─────────────┐
                    │ generateMeta  │         │  PNG Image  │
                    │ data from DB  │         │  (1200x630) │
                    └───────────────┘         └─────────────┘
```

### File Structure

```
app/roast/[id]/
├── page.tsx              # Updated generateMetadata
└── opengraph-image/
    ├── route.ts          # GET handler, fetches data via tRPC
    └── template.tsx      # React template for Takumi

lib/takumi.ts             # Wrapper for Takumi SDK
```

### Metadata Updates

The `generateMetadata` function in `page.tsx` will be updated to include:

```tsx
return {
  title: `${submission.score}/10 - ${submission.language} | DevRoast`,
  description: submission.roastQuote,
  twitter: {
    card: 'summary_large_image',
    images: [`/roast/${submission.id}/opengraph-image`],
  },
  openGraph: {
    title: `${submission.score}/10 - ${submission.language} | DevRoast`,
    description: submission.roastQuote,
    images: [{ url: `/roast/${submission.id}/opengraph-image` }],
  },
}
```

### OpenGraph Image Route

The route handler will:
1. Extract `id` from params
2. Fetch submission data via tRPC (server-side)
3. Generate PNG using Takumi
4. Return with 1-year cache headers

```tsx
export async function GET(request: Request, { params }) {
  const { id } = await params
  const submission = await trpc.roast.getById.query({ id })
  
  const image = await generateOpenGraphImage({
    score: submission.score,
    language: submission.language,
    verdict: submission.verdict,
    roastQuote: submission.roastQuote,
    lineCount: submission.lineCount,
  })
  
  return new Response(image, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
```

### Image Template

The Takumi template will render the design from Pencil (frame: `Screen 4 - OG Image`):
- Dimensions: 1200x630 (standard OG image)
- Font: Geist / Geist Mono (bundled with Next.js)
- Layout:
  - Logo: `> devroast` at top
  - Score: Large number (e.g., "3.5/10")
  - Verdict: With red indicator dot
  - Language info: e.g., "lang: javascript · 7 lines"
  - Quote: Roast quote in quotes

### Data Flow

| Step | Component | Action |
|------|-----------|--------|
| 1 | Bot | Visits `/roast/[id]/opengraph-image` |
| 2 | route.ts | Fetches data via tRPC |
| 3 | template.tsx | Renders layout with data |
| 4 | Takumi | Generates PNG |
| 5 | Response | PNG with 1-year cache headers |

### Design Reference

The image design is in `devroast.pen`:
- Frame: `4J5QT` - "Screen 4 - OG Image"
- Uses Pencil design variables
- Fonts updated to Geist / Geist Mono
- Colors follow the dark theme (bg-page, accent-red, etc.)

## Consequences

### Positive
- Rich social media previews improve click-through rates
- Automatic sharing experience with branded cards
- Long cache (1 year) minimizes generation costs
- Data fetched via tRPC follows existing patterns

### Negative
- Additional API route to maintain
- Takumi dependency for image generation

## Notes

- Font sources: Geist and Geist Mono from Next.js (no external loading needed)
- Image URL: `/roast/[id]/opengraph-image`
- Cache strategy: Browser cache for 1 year (immutable)

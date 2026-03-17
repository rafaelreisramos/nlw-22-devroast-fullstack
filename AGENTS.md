# DevRoast - Project Guidelines

## Tools

- **Docs**: Use `context7` tools for documentation
- **Design**: Use `pencil mcp` tools for Pencil design

## Tailwind CSS

- Prefer canonical Tailwind classes over arbitrary values (e.g., `w-12` instead of `w-[50px]`)
- If no exact equivalent exists, use the closest canonical option
- Theme variables in `@theme` directive in `globals.css`

## Database (Drizzle)

- Use `snake_case` for column names (Drizzle handles conversion)
- Write queries manually with SQL (no Drizzle relations/query builder)
- Indexes only on `score` and `created_at` for leaderboard performance

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Biome check
npm run format       # Biome format
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to DB
npm run db:migrate   # Run migrations
npm run db:studio   # Open Drizzle Studio
npm run db:seed     # Seed database
```

## Git Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
```

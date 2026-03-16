# DevRoast - Project Guidelines

## Tools

- **Docs**: Use `context7` tools for documentation
- **Design**: Use `pencil mcp` tools for Pencil design

## Tailwind CSS

- Prefer canonical Tailwind classes over arbitrary values (e.g., `w-12` instead of `w-[50px]`)
- If no exact equivalent exists, use the closest canonical option

## Git Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:
- `feat: add user authentication`
- `fix: resolve login redirect issue`
- `docs: update README with new features`

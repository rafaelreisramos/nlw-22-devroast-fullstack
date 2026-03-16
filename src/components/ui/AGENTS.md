# UI Components Guidelines

## Structure

### With Variants (use tv)

Use when component has variants (colors, sizes):

```tsx
import { tv } from "tailwind-variants";

const variants = tv({
  base: "base classes",
  variants: { variant: { default: "...", secondary: "..." } },
  defaultVariants: { variant: "default" },
});

function Component({ className, variant, ...props }) {
  return <div className={variants({ variant, className })} {...props} />;
}
```

### Without Variants (use twMerge)

Use when component has single style:

```tsx
import { twMerge } from "tailwind-merge";

function Component({ className, children, ...props }) {
  return (
    <div className={twMerge("base classes", className)} {...props}>
      {children}
    </div>
  );
}
```

## Key Rules

- **Named exports only** - No default exports
- **Use tv()** for components with variants (Button, Badge)
- **Use twMerge** for components without variants (Card, LeaderboardRow)
- **No forwardRef** unless needed for refs
- **displayName** on all components

## Canonical Classes

Prefer canonical Tailwind classes:

| Arbitrary | Canonical |
|----------|-----------|
| `w-[50px]` | `w-12` |
| `w-[70px]` | `w-16` |
| `h-5.5` | `h-6` |

## File Naming

- kebab-case: `button.tsx`, `card.tsx`
- Export component and variants

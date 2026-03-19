# UI Components Guidelines

## Primitivas

**Usar Base UI para primitivas com comportamentos** (Toggle, Select, etc.)

- https://base-ui.com/react/components
- Pattern de composição para subcomponentes

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

### Without Variants

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

- **Named exports only**
- **Use tv()** for variants (Button, Badge)
- **Use twMerge** for single style
- **Use Base UI** for interactive primitives
- **No forwardRef** unless needed

## Canonical Classes

| Arbitrary | Canonical |
|-----------|-----------|
| `w-[50px]` | `w-12` |
| `w-[70px]` | `w-16` |
| `h-5.5` | `h-6` |
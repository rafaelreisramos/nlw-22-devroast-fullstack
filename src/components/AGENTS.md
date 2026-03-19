# Padrões para Client Components

## Primitivas

**Usar Base UI para primitivas** (Toggle, Select, etc.)

- https://base-ui.com/react/components
- Pattern de composição

## Acesso ao Banco de Dados

**Nunca acessar o banco diretamente. Usar tRPC via TanStack Query.**

## Fetch de Dados

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function Component() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.route.procedure.queryOptions());
  
  return <div>{data?.value}</div>;
}
```

## Estrutura

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function Component() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.route.procedure.queryOptions());
  
  if (isLoading) return <Skeleton />;
  
  return <div>{data?.value}</div>;
}
```

## Não usar

- ❌ Acesso direto ao db
- ❌ useState + useEffect para dados do servidor
- ❌ fetch/axios direto

## Referências

- https://trpc.io/docs/client/tanstack-react-query/server-components
- https://base-ui.com/react/components
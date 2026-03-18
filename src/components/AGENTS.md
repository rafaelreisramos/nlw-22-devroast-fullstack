# Padrões para Client Components

## Acesso ao Banco de Dados

**Nunca acessar o banco diretamente. Usar tRPC via TanStack Query.**

## Padrão de Fetch de Dados

```tsx
// 1. Importar useQuery do TanStack e useTRPC
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

// 2. Usar useQuery com queryOptions do tRPC
export function ClientComponent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.route.procedure.queryOptions());
  
  return <div>{data?.result}</div>;
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

- ❌ Acesso direto ao db (src/db)
- ❌ useState + useEffect para dados do servidor
- ❌ fetch/axios direto

## Referências

- https://trpc.io/docs/client/tanstack-react-query/server-components
- https://trpc.io/docs/client/tanstack-react-query/setup
# tRPC - Rotas e Hidratação

## Estrutura

```
src/trpc/
├── client.tsx          # Provider do cliente (useTRPC)
├── hydrate-client.tsx  # Componente para hydration
├── init.ts            # Configuração base (createTRPCRouter, baseProcedure)
├── query-client.ts    # Configuração do TanStack Query
├── routers/
│   └── _app.ts        # Rotas da API
└── server.ts          # Helpers server-side (prefetch, trpc)
```

## Padrão de Rota

```typescript
// src/trpc/routers/_app.ts
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  namespace: createTRPCRouter({
    procedure: baseProcedure.query(async () => {
      return { result: "data" };
    }),
  }),
});
```

## Fetch de Dados (Server Component)

```tsx
// 1. Prefetch no servidor
import { prefetch, trpc } from "@/trpc/server";

prefetch(trpc.namespace.procedure.queryOptions());

// 2. Encapsular com HydrateClient
import { HydrateClient } from "@/trpc/hydrate-client";

<HydrateClient>
  <ClientComponent />
</HydrateClient>
```

## Consumir Dados (Client Component)

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function Component() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.namespace.procedure.queryOptions());
  
  return <div>{data?.result}</div>;
}
```

## Resumo do Fluxo

```
Server Component                    Client Component
┌─────────────────────┐           ┌─────────────────────┐
│ prefetch()          │           │ useQuery()          │
│ ├─ busca dados      │           │ ├─ lê do cache      │
│ └─ dehydrata        │───────▶   │ └─ renderiza        │
└─────────────────────┘  hydration └─────────────────────┘
```

## Referências

- https://trpc.io/docs/client/tanstack-react-query/server-components
- https://trpc.io/docs/client/tanstack-react-query/setup
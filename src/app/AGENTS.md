# Padrões para Server Components

## Acesso ao Banco de Dados

**Todo acesso ao banco deve ser feito via tRPC, nunca diretamente.**

## Padrão de Fetch de Dados

```tsx
// 1. Importar prefetch e trpc do servidor
import { prefetch, trpc } from "@/trpc/server";

// 2. Prefetch dos dados no servidor (dentro do componente)
prefetch(trpc.roast.getStats.queryOptions());

// 3. Encapsular componente cliente com HydrateClient
import { HydrateClient } from "@/trpc/hydrate-client";

<HydrateClient>
  <ClientComponent />
</HydrateClient>
```

## Estrutura

```tsx
import { HydrateClient } from "@/trpc/hydrate-client";
import { prefetch, trpc } from "@/trpc/server";
import { ClientComponent } from "@/components/client-component";

export default function Page() {
  prefetch(trpc.route.procedure.queryOptions());
  
  return (
    <main>
      <HydrateClient>
        <ClientComponent />
      </HydrateClient>
    </main>
  );
}
```

## Referências

- https://trpc.io/docs/client/tanstack-react-query/server-components
- https://trpc.io/docs/client/tanstack-react-query/setup
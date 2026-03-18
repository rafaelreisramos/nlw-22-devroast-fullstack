# tRPC Integration

## Descrição
Camada de API type-safe para Next.js App Router com SSR/Server Components usando tRPC + TanStack React Query.

## Requisitos
- RF01: Setup completo do tRPC com App Router
- RF02: Suporte a Server Components (prefetch/hydrate)
- RF03: Suporte a Client Components (hooks)
- RF04: Validação com Zod

## Setup

### Dependências
```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod server-only
npm install @number-flow/react
```

### Arquivos
- `src/trpc/init.ts` - Context + base router
- `src/trpc/routers/_app.ts` - AppRouter definition
- `src/trpc/query-client.ts` - QueryClient factory
- `src/trpc/client.tsx` - Provider para Client Components
- `src/trpc/server.ts` - Proxy para Server Components
- `src/app/api/trpc/[trpc]/route.ts` - API Handler

## Tasks / Critérios de Aceitação

- [x] Instalar dependências tRPC + number-flow
- [x] Criar src/trpc/init.ts
- [x] Criar src/trpc/routers/_app.ts com metrics.getHomeStats
- [x] Criar src/trpc/query-client.ts
- [x] Criar src/trpc/client.tsx
- [x] Criar src/trpc/server.ts
- [x] Criar app/api/trpc/[trpc]/route.ts
- [x] Adicionar TRPCReactProvider no app/layout.tsx
- [x] Criar components/metrics-skeleton.tsx
- [x] Criar components/home-metrics.tsx com number-flow
- [x] Criar components/metrics-server.tsx
- [x] Atualizar page.tsx com metrics via server component + suspense

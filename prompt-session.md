# Prompt Session - Leaderboard Page Implementation

Data: 2026-03-19

---

## Brainstorming Prompts

### 1. Feature Request
```
eu quero desenvolver agora o funcionamento da página de leaderboard @src/app/leaderboard/page.tsx seguindo a ideia do collapsible que implementamos na shame leaderboard da @src/app/page.tsx. Você deve implementar o back-end com tRPC e a integração com o front-end. Vamos exibir 20 resultados nesta página sem paginação.
```

### 2. Leaderboard Scope
```
somente shame leaderboard
```

### 3. Expand Behavior
```
Neste momento só expandir inline
```

### 4. Expand Content
```
numero de linhas. As outras informações continuam aparecendo no header do code-block então não tem necessidade.
```

### 5. Fetch Pattern
```
Opção A. Para múltiplas chamadas em uma mesma página opte por Promise.all.
```

### 6. Design Approach
```
sim
```

---

## Implementation Decisions

### 7. Caching Strategy
```
Eu quero que esse leaderboard atualizasse só uma vez por hora, revalidate, para não ficar batendo no banco toda hora. Isso vale para a homepage e para a leaderboard page.
```

### 8. Use Cache Directive
```
Eu quero que você leia sobre cache componentes na documentação do next, habilite os cache components na config, use a diretiva "use cache" nos componentes para aplicar a revalidação e não a constante revalidate nas Páginas.
```

### 9. Cache Components Selection
```
existe mais algum componente que possa usar a diretiva "use cache" para aumentar a performance das nossas páginas?
```

### 10. Cache Implementation
```
Siga com a implementação completa.
```

### 11. Revalidate Constant
```
Não quero que use a constante revalidate, use outra forma e/ou sintaxe.
```

### 12. Math.random Fix
```
Corrigir erro: Math.random() em Server Component
```

### 13. Skeleton Stats
```
não está sendo representado no loading.tsx
```

### 14. Loading Position
```
parece que o loading não está sendo aplicado. Continua aplicando o LeaderboardSkeleton
```

### 15. Loading Stats Representation
```
para representar fielmente a página falta um skeleton no loading.tsx para representar as informações de submissions e avg_score
```

---

## Files Created/Modified

### Backend (tRPC)
- `src/trpc/routers/_app.ts` - Added getLeaderboardPage, getLeaderboardStats procedures
- `src/trpc/server.ts` - Fixed prefetch generic type

### Frontend (Components)
- `src/components/leaderboard-content.tsx` - Server Component with 'use cache'
- `src/components/leaderboard-entry.tsx` - Client Component with collapsible
- `src/components/leaderboard-skeleton.tsx` - Loading skeleton
- `src/components/shame-leaderboard-content.tsx` - Added 'use cache'
- `src/components/ui/code-block.tsx` - Added React cache() for codeToHtml
- `src/components/ui/collapsible-code.tsx` - Added expandedContent prop

### Pages
- `src/app/leaderboard/page.tsx` - Converted to Server Component
- `src/app/leaderboard/loading.tsx` - Created loading skeleton
- `src/app/page.tsx` - Removed revalidate, uses ShameLeaderboardContent

### Config
- `next.config.ts` - Added cacheComponents: true
- `src/db/queries.ts` - Fixed LIMIT parameter

### Docs
- `docs/superpowers/specs/2026-03-19-leaderboard-design.md`
- `docs/superpowers/plans/2026-03-19-leaderboard-implementation.md`

---

## Key Decisions

1. **Scope**: Only shame leaderboard (ordered by score ASC)
2. **Expand**: Inline expansion showing line_count
3. **Fetch**: Server Component with Promise.all
4. **Caching**: 'use cache' directive with cacheLife({ stale: 3600 })
5. **Components**: Reuse existing components (CollapsibleCode, CodeBlock)
6. **Loading**: Next.js loading.tsx with skeleton matching page structure

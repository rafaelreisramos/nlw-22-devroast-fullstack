Vamos começar criando um projeto "Next.js" em branco nesta pasta, usando o diretório "src" para o nosso código. Vamos usar "Biome" para linting/formating. Vamos usar "Tailwind CSS" na sua última versão para estilização. Crie um app totalmente em branco, sem conteúdo na página, deixe tudo em branco.

Crie uma pasta "src/components/ui" para implementarmos os componentes que são genéricos para várias páginas, como o botão. Use o componente que estou selecionando para criar a base do componente "button". Use "tailwind", "tailwind-merge" e "tailwind-variants" quando necessário para criar várias variantes do mesmo componente. Não esqueça de extender as propriedades nativas do botão no "Typescript". Use named exports e não default exports.

1. Não use "twMerge" quando usar o variants porque você pode passar className diretamente como uma propriedade da variant, junto com o size e o tailwind-varaints faz o merge sozinho.
2. Documente estes padrões de criação em um aquivo AGENTS.md dentro da pasta "src/components/ui" para que possamos seguir estes padrões em outros componentes. 
3. Crie uma página de exemplo de componentes que vai listar todos os nossos componentes de ui com todas as variantes para vermos visualmente como ficaram. Crie esta página em "src/app/components/page.tsx".

Agora vamos implementar os demais componentes da ui da nossa aplicação conforme a página selecionada no Pencil. 
Vamos focar em implementar os componentes genéricos que são facilmente repetitíveis em várias páginas, ou seja, não implemente componentes que não sãompequenos e não reaproveitáveis. 
Utilize os primitivos da biblioteca base-ui para criar os componentes que possuem algum comportamento como, por exemplo, o toggle.
Para o CodeBlock utilize a biblioteca shiki com o tema vesper e permita que o CodeBlock seja renderizado apenas no lado do servidor, ou seja, um server component.
Me faça perguntas para entender melhor caso seja necessário.

Analise as páginas selecionadas no Pencil e crie uma tema para o tailwindcss. Aplique o tema nos componentes e páginas já criados.

Vamos usar a fonte jetbrains mono para fontes monospace. Já para as fontes sans vamos usar as padrões do sistema ao invés da Geist.
Eu quero que você modifique as variáveis do tema para usar variáveis do tailwind e não variáveis css, ou seja, usar diretamente bg-accent-green e ter todas as nossas variavies dentro da dirretiva '@theme' no global.css.
Aplique o tema nas páginas e nos componentes da nossa ui.

No componente score-ring você uniu classes usando interpolação de string. Sempre use twmerge neste caso. Verifique e altere em todos os componentes caso exista o mesmo problema.

Alguns componentes estão usando classes como, por exemplo, w-[60px]. Substitua este tipo de sintaxe nos componentes por classes canonicas (no caso específico do exemplo, w-15). Veririque outros casos nos demais componentes e corrija.

O componente navbar na realidade não é necessário. Ele faz parte das páginas e pode ser aplicao a um layout basico das paginas do next posteriormente.

Agora vamos construir a homepage da nossa aplicação que está selecionada no Pencil (use o MCP do pencil).
O header (navbar) deve ser comum para todas as páginas, ou seja, ficar no layout do Next.js.
Use os componentes que criamos em ui/components para construir a página.
Utilize uma largura máxima no conteúdo da página centralizada. A navbar pode ocupar a largura toda.
Por enquanto todos os dados devem ser estáticos, ou seja, nehuma conexão com API.
Me faça perguntas para entender melhor caso seja necessário.

Agora vamos fazer uma refatoração nos componentes de ui para utilizar o pattern de composição ao invés de várias props, ou seja, dividindo componentes que possuem pedações como title, description, ... em subcomponentes com CardTitle, CardDescription, ... ao invés de propriedades. Analise os componentes e faça a refatoração. Atualize a página de compoentes e a homepage 

Para componentes que não possuem variantes, isto é, possuem somente a variant base, elimine o uso de tailwind-variants e passe as classes diretamente no componente. Analise todos os compoenentes de ui e pages para verificar onde sera necessario fazer alterações.

Os componentes foram criados por padrão usando forwardRef. Elimine o uso do forwardRef se não existir um uso específico desta feature.

1. Atualize o AGENTS.md na raiz do projeto com o detalhamento do projeto e padrões globais do nosso app. Mantenha esse arquivo conciso e resumido apenas com o mais importante.
2. Atualize o components/ui/AGENTS.md com os padrões de projeto dos componentes. Mantenha esse arquivo conciso.
3. Crie e/ou atualize o README.md do projeto falando sobre suas funcionalidades. Não utilize uma linguagem muito técnica já que irá servir como o README do nosso github para que quiser conhecer nosso app.
4. Faça o commit usando conventional commit pattern.

---

Agora vamos construir a funcionalidade de editor com syntax highlighting. Esse editor precisa funcionar de uma forma que, quando o usuário colar um trecho de código, as cores (syntax highlighting) sejam applicadas de acordo com a linguagem que deve ser descoberta automaticamente. Podemos também ter uma opção do usuário selecionar a linguagem do código através de uma seleção manual da linguagem no editor da homepage. Deve ser criado um componente, mas que não faz parte da ui, somente deve ser colocado na pasta src/components chamado code-editor.

Quero que você faça uma uma pesquisa das melhores opções para construção deste editor. Eu gosto muito do editor do ray-so (https://github.com/raycast/ray-so). Você pode vasculhar o código para ver como o editor é feito mas pode sugerir outras opções caso faça sentido.

Não quero que você implemente NADA, apenas crie um arquivo em markdown dentro da pasta specs, na raiz do projeto, com a conclusão dos estudos e a especificação para a implementação desta feature.

Crie to-dos dentro deste arquivo e mefaça perguntas, caso necessário, para compreender esta tarefa melhor.

---

Utilize o MCP do Pencil para vasculhar nosso layout aberto no app desktop do Pencil e o que temos até agora documentado no @README para escrever uma especificação dentro da pasta @spec, em markdown, para implementação do Drizzle.

Essa especificação deve incluir quais tabelas precisamos ter, enums e to-dos para a implementação do Drizzle ORM neste projeto com Docker Compose para subir o Postgres.

Me faça perguntas caso necessário.

---

Agora com base na spec @specs/drizzle-spec.md faça o plano detalhado de implementação do banco de dados neste projeto.

Alguns pontos:

1. Use a config de casing do Drizzle na config e no schema para evitar de escrever duas vezes o nom das colunas.

2. Não quero relations nativas do drizzle; escreva as queries sem do db.query do drizzle, ou seja, mais sql e joins.

3. Não crie índices desnecessários, apenas o que for muito importante , por exemplo, índices em chaves estrangeiras ou primárias são desnecessários.

---

Crie um arquivo de seed e um comando de seed utilizando o drizzle para popular o banco com algumas submissões/roasts.

Não use o drizzle-seed, escreve os inserts manualmente. Utilize a biblioteca faker-js para geração de dados fictícios.

Insira uns 100 roasts. Crie um script no package.json para executar o seed usando o suporte nativo do node ou tsx.

---

Vamos implementar a página shame leaderboard selecionada no app desktop do Pencil.

Por enquanto esta página irá conter apenas dados estáticos.

Use SSR para que esta página tenha indexação.

Utilize os componentes da @components/ui, especialmente o CodeBlock na elaboração desta página.

Caso seja necessário refatorar o componente CodeBlock, para separar o cabeçalho da caixa de código, utilize o pattern de composição.

---

Vamos limitar a quantidade de código inserida no nosso editor. 

Defina um limite de 2000 caracteres para um snippet de cógido e mostre este limite no canto inferior direito do editor. 

Caso o código passe deste limite desabilite o botão de enviar o código.

---

Implemente a página de Roast Results selecionada no app desktop do Pencil (use o macp do Pencil).

Essa página deve receber uma parâmetro dinâmico na url, um id da submissao do tipo uuid, mas, por enquanto, os dados devem permanecer estáticos.

---

Em varias partes do layout nós temos um título de seção que repete a formatação e o layout, como, por exemplo, //shame_leaderboard, //detailed_analysis, //your_submission, //suggested_fix além das próprias seções da página de componentes como //buttons, //toggle, ... 

Crie um componente chamado session-title e aplique ele nas páginas conforme o layout do app desktop do pencil (use o mcp do pencil)

---

Estamos usando a ideia de criar specs na pasta @specs/ antes de implementar uma nova feature. Crie um arquivo AGENTS.md nesta pasta documentando um formato adequado de criarmos estas novas specs para quando formos criar novas especificações.

Mantenha este arquivo muito conciso somente com o que é necessário.

---

Agora, seguindo esse padrão, quero que voce crie uma nova spec para implementação do tRPC que vamos utilizar como camada de API/back-end do nosso projeto. Como é um projeto Next.js é importante que você integre o tRPC com o SSR/Server Components do Next.js seguindo estas documentações:

1. https://trpc.io/docs/client/tanstack-react-query/server-components
2. https://trpc.io/docs/client/tanstack-react-query/setup

---

Execute a implementação do tRPC com base na spec @spec/trpc-spec.md.

Vamos incluir por agora apenas uma função simples integrada entre front-end e tRPC que é a listagem das métricas na homepage sobre a quantidade de roasted codes e avg score. Todo o restante não deve ser implementado por agora no tRPC ou no front-end.

Quando integrar o tRPC no front-end, use sempre que possível Server Components com Suspense API e skeleton components para loading state destas informações. 

Para essas métricas especificamente, quero que use o https://number-flow.barvian.me/ para os números sairem de 0 (zero) para o número real após o carregamento. Neste caso, se for necessário usar client ccomponents, utilize sem medo.

---

Eu quero que você mude o loading state para não usar suspense/skeleton no componente de métricas especificamente. Use apenas 0 como valor inicial de depois altere para o valor carregado da API para que o number-flow faça a animaão de incremento de valor.

---

Eu quero algo tipo 
```js
  prefetch(trpc.roast.getStats.queryOptions());

      <Suspense>
        <HydrateClient>
          <HomeMetrics />
        </HydrateClient>
      </Suspense>
```
na home

e 

```js
  const trpc = useTRPC();
  const { data } = useQuery(trpc.roast.getStats.queryOptions());

  return (
    <div className="flex items-center gap-6 justify-center pt-8">
      <span className="font-mono text-xs text-text-tertiary">
        <NumberFlow
          value={data?.totalRoasts ?? 0}
          format={{ useGrouping: true }}
          className="font-mono tabular-nums"
        />{" "}
        codes roasted
      </span>
      <span className="font-mono text-xs text-text-tertiary">·</span>
      <span className="font-mono text-xs text-text-tertiary">
        avg score:{" "}
        <NumberFlow
          value={data?.avgScore ?? 0}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          className="font-mono tabular-nums"
        />

```
---

Agora vamos implemetar o shame leaderboard da homepage do nosso projeto. Esse leaderboard vai trazer apenas 3 resultados, os 3 piores trechos de código e também deve trazer a métrica roasts total no rodapé. Aqui é importante usar Server Components e a Suspense API para exibir um loading state com um Skeleton enquanto os dadso estão sendo carregados.

---

Os códigos da leaderboard não estão sendo apresentandos com a syntax highlighting correpondente da coluna lang da tabela. Verifique tamém se a coluna lang está coerente com os snippets de código da coluna code e se o score está vindo também corretamente.

---

Um problema que temos na homepage é que estamos exibindo apenas 3 linhas do código. na shame leaderboard. Eu gostaria que pudéssemos exibir ó código por completo, talvez tendo um max height na linha da tabela e o usuário podendo clicar para exibir o restante (collapsible. Mantenha o code-block com o synthax highlight). 

Se for usar collpsible use o base-ui sempre que possível para os primitivos.

---

Cada linha da shame leaderboard deve sempre mostrar 3 linhas de código. Caso o código seja maior o código pode ser expandido.

---

Instale o mcp do playwright (https://playwright.dev/)

---

A shame leaderboard continua mostrando somente o trigger do expand code sem mostrar as 3 linhas de código. Use o mcp do playwright para verificar o funcionamento e layout e corrigir se necessário.

---

Ao clicar em show more as novas linhas mostradas não vem com a syntax highlight aplicada.

---

Especificamente para rust que são as dus primeiras linhas da shame leaderboard parece que não está aplicando o synthax highlight. Para python que é a terceira linha da shame leaderboar funcionou.

---

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

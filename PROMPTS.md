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
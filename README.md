# DevRoast 🚀

> paste your code. get roasted.

![GitHub](https://img.shields.io/github/license/rafaelreisramos/nlw-22-devroast-fullstack)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

A plataforma onde você cola seu código e recebe avaliações — **honestas e sem compromisso**.

---

## 📖 Sobre o Projeto

DevRoast é uma aplicação divertida e útil para desenvolvedores que querem:

- ⚡ **Avaliar seu código** de forma automática e instantânea
- 🏆 **Ver como seu código fica rankeado** no ranking dos piores códigos da internet
- 📚 **Aprender com os erros** dos outros e melhorar suas habilidades
- 🔥 **Ativar o Roast Mode** para receber feedback com máximo sarcasmo ativado

---

## ✨ Funcionalidades

### 🍝 Cole e Avalie
Cole seu código em JavaScript, TypeScript, Python, Go, Rust e outras linguagens. Receba uma pontuação de 0 a 10 em segundos.

### 📊 Sistema de Pontuação
| Score | Nível | Descrição |
|-------|-------|-----------|
| 0-3 | 🚨 | Código muito ruim (precisa de ajuda urgente!) |
| 4-6 | ⚠️ | Código com problemas sérios |
| 7-8 | 🔧 | Precisa de melhorias |
| 9-10 | ✅ | Código aceitável |

### 🏅 Leaderboard
Veja o ranking dos **piores códigos** enviados pela comunidade. Descubra se o seu código está entre os envergonhados!

### 🔍 Análise Detalhada
Receba feedback sobre cada problema encontrado no seu código, com:
- 📌 Título do problema
- 📝 Descrição detalhada
- 💡 Sugestão de correção com código exemplo

### 🎭 Roast Mode
Ative o modo roast para feedback com **máximo sarcasmo** — porque melhorar também pode ser divertido.

---

## 🛠️ Pré-requisitos

Antes de começar, você vai precisar ter instalado:

- 🐳 **Docker** e **Docker Compose**
- 📦 **Node.js** 20+
- 🔑 **API Key do Gemini** (Google AI Studio)

---

## 🚀 Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/rafaelreisramos/nlw-22-devroast-fullstack.git
cd nlw-22-devroast-fullstack
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.local.example .env.local
```

Edite o `.env.local` e adicione sua API key do Gemini:

```env
GEMINI_API_KEY=sua-chave-aqui
```

> 🔑 **Onde conseguir a API key?**
> Acesse [Google AI Studio](https://aistudio.google.com/apikey) e gere uma nova API key gratuita.

### 3. Inicie o banco de dados

```bash
docker compose up -d
```

Isso vai subir um container PostgreSQL na porta 5432.

### 4. Instale as dependências e execute

```bash
npm install
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000) 🎉

---

## 🏗️ Arquitetura Técnica

### Stack

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  Next.js 15 + React 19 + TypeScript + Tailwind CSS v4        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API Layer                             │
│              tRPC + TanStack Query + Zod                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI Integration                            │
│                   Google Gemini 2.0                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database                               │
│            PostgreSQL + Drizzle ORM + Shiki                 │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── roast/             # Results page
│   └── leaderboard/       # Leaderboard page
├── components/            # React components
│   ├── code-editor/      # Code editor component
│   └── ui/               # UI primitives
├── db/                    # Database layer
│   ├── schema.ts         # Drizzle schema
│   └── seed.ts           # Database seed
├── lib/                   # Utilities
│   └── ai/               # AI integration
└── trpc/                  # tRPC configuration
```

### Fluxo de Dados

```
Usuário cola código
       │
       ▼
  Validação (Zod)
       │
       ▼
  Análise AI (Gemini)
       │
       ├── Score (0-10)
       ├── Verdict
       ├── Issues[]
       └── Suggestions[]
       │
       ▼
  Salvar no PostgreSQL
       │
       ▼
  Retornar resultado
```

### API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/trpc/submissions.create` | Cria uma nova submissão |
| GET | `/api/trpc/submissions.getTopWorst` | Lista os piores códigos |
| GET | `/api/trpc/submissions.getStats` | Estatísticas gerais |

---

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Verifica código com Biome
npm run format       # Formata código com Biome
npm run db:generate  # Gera migrations Drizzle
npm run db:push      # Push schema para banco
npm run db:migrate   # Executa migrations
npm run db:seed      # Popula banco com dados de teste
npm run db:studio    # Abre Drizzle Studio
```

---

## 🔧 Desenvolvimento com AI

Este projeto foi desenvolvido durante a **NLW 22** da [Rocketseat](https://www.rocketseat.com.br/) utilizando:

### 🤖 Opencode AI

O projeto foi construído com [Opencode](https://opencode.ai) usando o modelo **MiniMax M2.5 Free**, uma ferramenta de AI que auxilia no desenvolvimento de software com acesso a terminal, sistema de arquivos e ferramentas especializadas.

### 🔌 MCPs (Model Context Protocol)

 foram utilizadas integrações via MCP para:

| MCP | Função |
|-----|--------|
| **Pencil** | 🎨 Design de interfaces e prototipagem |
| **Playwright** | 🧪 Testes end-to-end e verificação visual |
| **Context7** | 📚 Documentação de libraries e frameworks |

### ⚡ Superpowers Skills

 foram utilizadas as [Superpowers Skills](https://github.com/obra/superpowers) do Opencode para:

- 🧠 **Brainstorming** — exploração de ideias antes da implementação
- 🐛 **Systematic Debugging** — metodologia estruturada para resolver bugs
- 🔍 **Verification Before Completion** — verificação rigorosa antes de concluir tarefas

### 🐧 Script MCP Pencil para Linux (AppImage)

O Pencil funciona como [AppImage](https://appimage.org/) no Linux. O AppImage é montado em um diretório temporário dinâmico, o que dificulta a detecção pelo MCP.

Consulte a documentação completa em [`scripts/PENCIL-MCP-SETUP.md`](scripts/PENCIL-MCP-SETUP.md) para instruções de instalação e configuração.

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Seja um fix de bug, nova feature ou melhoria na documentação.

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT © Rafael Ramos

---

Feito com 💜 durante o NLW 22

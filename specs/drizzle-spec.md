# Especificação: Drizzle ORM + PostgreSQL

## 1. Contexto e Objetivo

Implementar a camada de banco de dados usando **Drizzle ORM** com **PostgreSQL** (via Docker Compose) para persistência dos dados do DevRoast.

### Decisões de Design

- **Autenticação**: Não há sistema de usuários. Códigos são submetidos anonimamente.
- **Análise**: IA externa (API) fornece pontuação, issues e sugestões.
- **Score**: Score único de 0-10 (não há细分 de scores).

---

## 2. Stack Técnica

- **Banco**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Container**: Docker Compose
- **Migrations**: Drizzle Kit

---

## 3. Schema do Banco

### 3.1 Tabelas

#### `submissions`

Armazena os códigos submetidos para avaliação.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK - Identificador único |
| `code` | `text` | Código fonte submetido |
| `language` | `language_enum` | Linguagem do código |
| `score` | `smallint` | Pontuação (0-10) |
| `verdict` | `verdict_enum` | Veredicto textual |
| `roast_quote` | `text` | Frase de "roast" gerada pela IA |
| `line_count` | `integer` | Número de linhas do código |
| `created_at` | `timestamp` | Data de criação |

#### `issues`

Problemas/erros identificados no código pela IA.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK - Identificador único |
| `submission_id` | `uuid` | FK - Referência ao submission |
| `title` | `text` | Título do problema |
| `description` | `text` | Descrição detalhada |
| `severity` | `severity_enum` | Severidade do problema |
| `line_number` | `integer` | Linha onde ocorre (nullable) |
| `created_at` | `timestamp` | Data de criação |

#### `suggestions`

Sugestões de melhoria (diff) geradas pela IA.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK - Identificador único |
| `submission_id` | `uuid` | FK - Referência ao submission |
| `original_code` | `text` | Trecho original com problema |
| `suggested_code` | `text` | Trecho corrigido |
| `explanation` | `text` | Explicação da sugestão |
| `created_at` | `timestamp` | Data de criação |

### 3.2 Enums

#### `language_enum`

Linguagens de programação suportadas.

```typescript
export const languageEnum = pgEnum('language', [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'rust',
  'ruby',
  'php',
  'sql',
  'html',
  'css',
  'json',
])
```

#### `verdict_enum`

Veredicto baseado na pontuação.

| Score | Verdict | Descrição |
|-------|---------|-----------|
| 0-3 | `needs_urgent_help` | Precisa de ajuda urgente |
| 4-6 | `serious_problems` | Problemas sérios |
| 7-8 | `needs_improvement` | Precisa de melhorias |
| 9-10 | `acceptable` | Aceitável |

```typescript
export const verdictEnum = pgEnum('verdict', [
  'needs_urgent_help',
  'serious_problems',
  'needs_improvement',
  'acceptable',
])
```

#### `severity_enum`

Severidade dos issues encontrados.

```typescript
export const severityEnum = pgEnum('severity', [
  'error',
  'warning',
  'info',
])
```

---

## 4. Docker Compose

### 4.1 Services

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### 4.2 Variáveis de Ambiente

```env
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

---

## 5. Estrutura de Arquivos

```
src/
├── db/
│   ├── index.ts          # Conexão e cliente Drizzle
│   ├── schema.ts         # Definição das tabelas e enums
│   ├── migrations/       # Migrations do Drizzle Kit
│   └── seed.ts           # Dados iniciais (opcional)
├── env.ts                # Variáveis de ambiente
```

---

## 6. To-Dos para Implementação

### Fase 1: Configuração do Ambiente

- [ ] **Criar arquivo `docker-compose.yml`** com PostgreSQL
- [ ] **Criar arquivo `.env`** com DATABASE_URL
- [ ] **Instalar dependências**: `npm install drizzle-orm pg dotenv`
- [ ] **Instalar devDependencies**: `npm install -D drizzle-kit`

### Fase 2: Schema Drizzle

- [ ] **Criar `src/db/schema.ts`**:
  - [ ] Definir enums (language, verdict, severity)
  - [ ] Criar tabela `submissions`
  - [ ] Criar tabela `issues`
  - [ ] Criar tabela `suggestions`
  - [ ] Definir relações (FK)

- [ ] **Criar `src/db/index.ts`**:
  - [ ] Configurar cliente Drizzle
  - [ ] Exportar tipos e queries utilitárias

### Fase 3: Migrations

- [ ] **Criar configuração `drizzle.config.ts`**
- [ ] **Gerar migration inicial**: `npx drizzle-kit generate`
- [ ] **Executar migrations**: `npx drizzle-kit migrate`

### Fase 4: Operações CRUD

- [ ] **Criar arquivo de queries `src/db/queries.ts`**:
  - [ ] `createSubmission()` - Inserir novo código
  - [ ] `getSubmissionById()` - Buscar por ID
  - [ ] `getRecentSubmissions()` - Listar submissions recentes
  - [ ] `getTopRoasted()` - Leaderboard (piores scores)
  - [ ] `createIssue()` - Inserir issue
  - [ ] `createSuggestion()` - Inserir sugestão
  - [ ] `getSubmissionWithDetails()` - Buscar com issues e sugestões

### Fase 5: Integração com API

- [ ] **Criar API route para submissão**:
  - [ ] Receber código + linguagem
  - [ ] Enviar para IA externa
  - [ ] Salvar no banco
  - [ ] Retornar resultado

- [ ] **Criar API route para leaderboard**:
  - [ ] Listar top piores códigos
  - [ ] Paginação

### Fase 6: Verificação

- [ ] **Testar conexão com banco**
- [ ] **Testar todas as operações CRUD**
- [ ] **Executar lint e typecheck**

---

## 7. API Reference (Operations)

### Submission

```typescript
// Criar submissão
interface CreateSubmissionInput {
  code: string;
  language: Language;
  score: number;
  verdict: Verdict;
  roastQuote: string;
  lineCount: number;
  issues: CreateIssueInput[];
  suggestions: CreateSuggestionInput[];
}

// Buscar com detalhes
interface SubmissionWithDetails {
  id: string;
  code: string;
  language: Language;
  score: number;
  verdict: Verdict;
  roastQuote: string;
  lineCount: number;
  createdAt: Date;
  issues: Issue[];
  suggestions: Suggestion[];
}

// Leaderboard
interface LeaderboardEntry {
  id: string;
  score: number;
  verdict: Verdict;
  language: Language;
  lineCount: number;
  roastQuote: string;
  createdAt: Date;
}
```

---

## 8. Notas

- **Relações**: Um `submission` tem vários `issues` e `suggestions` (one-to-many).
- **Índices**: Considerar índice em `score` para leaderboard e `created_at` para ordenação.
- **Limites**: Sem límite de submissões (anonimato).
- ** IA**: A integração com IA será feita em camada separada (service).

---

## 9. Referências

- [Drizzle ORM - Documentação](https://orm.drizzle.team/)
- [Drizzle Kit - Migrations](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [dotenv - NPM](https://www.npmjs.com/package/dotenv)

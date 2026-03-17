# Plano de Implementação: Drizzle ORM + PostgreSQL

## Visão Geral

- **Objetivo**: Implementar camada de banco de dados com Drizzle ORM + PostgreSQL
- **Casing**: snake_case (id, created_at, line_count)
- **Queries**: SQL manual sem relations nativas do Drizzle
- **Índices**: Mínimo necessário apenas para leaderboard

---

## 1. Configuração do Ambiente

### 1.1 docker-compose.yml

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

### 1.2 .env

```env
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

### 1.3 Dependencies

```bash
npm install drizzle-orm pg dotenv
npm install -D drizzle-kit @types/pg
```

---

## 2. Configuração Drizzle

### 2.1 drizzle.config.ts

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schema: {
    casing: 'snake_case',
  },
})
```

---

## 3. Schema (src/db/schema.ts)

### Enums

```typescript
import { pgSchema, pgEnum } from 'drizzle-orm/pg-core'
import { uuid, text, smallint, integer, timestamp } from 'drizzle-orm/core'
import { randomUUID } from 'crypto'

export const schema = pgSchema('public', {})

export const languageEnum = schema.createEnum('language', [
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

export const verdictEnum = schema.createEnum('verdict', [
  'needs_urgent_help',
  'serious_problems',
  'needs_improvement',
  'acceptable',
])

export const severityEnum = schema.createEnum('severity', [
  'error',
  'warning',
  'info',
])
```

### Tabelas

```typescript
export const submissions = schema.createTable('submissions', {
  id: uuid().primaryKey().default(randomUUID()),
  code: text().notNull(),
  language: languageEnum().notNull(),
  score: smallint().notNull(),
  verdict: verdictEnum().notNull(),
  roast_quote: text().notNull(),
  line_count: integer().notNull(),
  created_at: timestamp().defaultNow().notNull(),
})

export const issues = schema.createTable('issues', {
  id: uuid().primaryKey().default(randomUUID()),
  submission_id: uuid().references(() => submissions.id).notNull(),
  title: text().notNull(),
  description: text().notNull(),
  severity: severityEnum().notNull(),
  line_number: integer(),
  created_at: timestamp().defaultNow().notNull(),
})

export const suggestions = schema.createTable('suggestions', {
  id: uuid().primaryKey().default(randomUUID()),
  submission_id: uuid().references(() => submissions.id).notNull(),
  original_code: text().notNull(),
  suggested_code: text().notNull(),
  explanation: text().notNull(),
  created_at: timestamp().defaultNow().notNull(),
})
```

---

## 4. Conexão (src/db/index.ts)

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import { sql } from 'drizzle-orm'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })
export type DBSchema = typeof schema
```

---

## 5. Queries (src/db/queries.ts)

### Tipos

```typescript
export type Submission = {
  id: string
  code: string
  language: string
  score: number
  verdict: string
  roast_quote: string
  line_count: number
  created_at: Date
}

export type Issue = {
  id: string
  submission_id: string
  title: string
  description: string
  severity: string
  line_number: number | null
  created_at: Date
}

export type Suggestion = {
  id: string
  submission_id: string
  original_code: string
  suggested_code: string
  explanation: string
  created_at: Date
}
```

### Funções

```typescript
import { db } from './index'
import { sql } from 'drizzle-orm'

// Create submission
export async function createSubmission(data: {
  code: string
  language: string
  score: number
  verdict: string
  roast_quote: string
  line_count: number
}) {
  const result = await db.execute(sql`
    INSERT INTO submissions (code, language, score, verdict, roast_quote, line_count)
    VALUES (${data.code}, ${data.language}, ${data.score}, ${data.verdict}, ${data.roast_quote}, ${data.line_count})
    RETURNING id, code, language, score, verdict, roast_quote, line_count, created_at
  `)
  return result[0]
}

// Get submission by ID
export async function getSubmissionById(id: string) {
  const result = await db.execute(sql`
    SELECT id, code, language, score, verdict, roast_quote, line_count, created_at
    FROM submissions
    WHERE id = ${id}
  `)
  return result[0] || null
}

// Get recent submissions
export async function getRecentSubmissions(limit = 10, offset = 0) {
  return db.execute(sql`
    SELECT id, code, language, score, verdict, roast_quote, line_count, created_at
    FROM submissions
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `)
}

// Get top roasted (leaderboard - lowest scores first)
export async function getTopRoasted(limit = 10) {
  return db.execute(sql`
    SELECT id, code, language, score, verdict, roast_quote, line_count, created_at
    FROM submissions
    ORDER BY score ASC, created_at DESC
    LIMIT ${limit}
  `)
}

// Create issue
export async function createIssue(data: {
  submission_id: string
  title: string
  description: string
  severity: string
  line_number?: number
}) {
  return db.execute(sql`
    INSERT INTO issues (submission_id, title, description, severity, line_number)
    VALUES (${data.submission_id}, ${data.title}, ${data.description}, ${data.severity}, ${data.line_number ?? null})
    RETURNING id, submission_id, title, description, severity, line_number, created_at
  `)
}

// Create suggestion
export async function createSuggestion(data: {
  submission_id: string
  original_code: string
  suggested_code: string
  explanation: string
}) {
  return db.execute(sql`
    INSERT INTO suggestions (submission_id, original_code, suggested_code, explanation)
    VALUES (${data.submission_id}, ${data.original_code}, ${data.suggested_code}, ${data.explanation})
    RETURNING id, submission_id, original_code, suggested_code, explanation, created_at
  `)
}

// Get submission with details
export async function getSubmissionWithDetails(id: string) {
  const submission = await db.execute(sql`
    SELECT id, code, language, score, verdict, roast_quote, line_count, created_at
    FROM submissions
    WHERE id = ${id}
  `)

  if (!submission[0]) return null

  const issues = await db.execute(sql`
    SELECT id, submission_id, title, description, severity, line_number, created_at
    FROM issues
    WHERE submission_id = ${id}
    ORDER BY 
      CASE severity 
        WHEN 'error' THEN 1 
        WHEN 'warning' THEN 2 
        ELSE 3 
      END,
      line_number ASC
  `)

  const suggestions = await db.execute(sql`
    SELECT id, submission_id, original_code, suggested_code, explanation, created_at
    FROM suggestions
    WHERE submission_id = ${id}
  `)

  return {
    ...submission[0],
    issues: issues,
    suggestions: suggestions,
  }
}

// Get leaderboard stats
export async function getLeaderboardStats() {
  const total = await db.execute(sql`
    SELECT COUNT(*) as total, AVG(score)::numeric(10,2) as avg_score
    FROM submissions
  `)
  return total[0]
}
```

---

## 6. Índices

Apenas 2 índices para performance do leaderboard:

```sql
CREATE INDEX idx_submissions_score ON submissions(score);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
```

---

## 7. Ordem de Execução

| # | Passo | Comando |
|---|-------|---------|
| 1 | Criar docker-compose.yml | - |
| 2 | Criar .env | - |
| 3 | Instalar deps | `npm i drizzle-orm pg dotenv && npm i -D drizzle-kit @types/pg` |
| 4 | Criar drizzle.config.ts | - |
| 5 | Criar src/db/schema.ts | - |
| 6 | Criar src/db/index.ts | - |
| 7 | Gerar migration | `npx drizzle-kit generate` |
| 8 | Executar migration | `npx drizzle-kit migrate` |
| 9 | Criar src/db/queries.ts | - |
| 10 | Testar | - |
| 11 | Lint | `npm run lint` |

---

## 8. Estrutura Final

```
src/
├── db/
│   ├── index.ts          # Conexão Drizzle
│   ├── schema.ts         # Schema (enums + tabelas)
│   ├── queries.ts        # Queries SQL manuais
│   └── migrations/       # Migrations Drizzle Kit
├── env.ts                # Variáveis ambiente
docker-compose.yml
drizzle.config.ts
.env
```

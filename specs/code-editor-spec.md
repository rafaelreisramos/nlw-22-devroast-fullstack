# Especificação: Code Editor com Syntax Highlighting

## 1. Contexto e Objetivo

Criar um componente de editor de código com syntax highlighting para a homepage do projeto DevRoast. O componente deve:
- Aceitar código colado/recortado pelo usuário
- Aplicar cores (syntax highlighting) automaticamente quando o usuário colar um trecho de código
- Detectar a linguagem automaticamente
- Permitir seleção manual da linguagem

---

## 2. Análise do Ray So e Alternativas

### 2.1 Ray So
O [ray.so](https://github.com/raycast/ray-so) é um projeto Next.js que usa Shiki internamente para highlighting de alta qualidade.

### 2.2 Biblioteca Já Utilizada no Projeto

O projeto já usa **Shiki** em `src/components/ui/code-block.tsx`:
- Theme: `vesper` (dark)
- Server-side rendering via `codeToHtml`
- Suporte a 200+ linguagens
- Mesma qualidade de highlighting do VS Code

### 2.3 Recomendação

**Manter com Shiki** - Já está integrado no projeto, qualidade superior, e suporta auto-detecção.

---

## 3. Especificação do Componente

### 3.1 Nome e Localização
```
src/components/code-editor/
├── CodeEditor.tsx       (componente principal - Client Component)
├── useLanguageDetector.ts  (hook para detecção)
└── index.ts            (exports)
```

### 3.2 Interface Proposta

```typescript
interface CodeEditorProps {
  code?: string;                      // código inicial (opcional)
  language?: string;                   // linguagem forçada (undefined = auto-detect)
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onCodeChange?: (code: string) => void;    // callback quando código muda
  showLanguageSelector?: boolean;
  className?: string;
  filename?: string;
  placeholder?: string;
}
```

### 3.3 Funcionalidades

1. **Textarea transparente sobreposta**: Área de edição invisível sobre o código destacado
2. **Código sempre visível**: Syntax highlighting sempre ativo (Shiki theme vesper)
3. **Números de linha sempre visíveis**: Column esquerda com numeração
4. **Colar código**: Ao colar (Ctrl+V), detecta automaticamente a linguagem
5. **Detectar linguagem automaticamente** quando `language` for undefined
6. **Permitir seleção manual** de linguagem via prop `showLanguageSelector`
7. **Altura fixa**: 320px (h-80)
8. **Barra de rolagem**: Única, externa, cor #3a3a3a (discreta)

### 3.4 Estrutura Visual

- **Container principal** (h-80):overflow-y-auto com scrollbar externa
- **Área de números** (w-10): Fundo bg-surface, numeração always visible
- **Área de código**: Textarea transparente sobre div com syntax highlighting
- **Header**: Window dots (red, amber, green) + seletor de linguagem opcional

### 3.5 Fluxo de Uso

1. **Estado inicial**: Textarea vazio com placeholder
2. **Usuário digita/cola código**:
   - Detecta linguagem automaticamente
   - Exibe código com cores (textarea sobre highlighting)
3. **Barra de rolagem**: Aparece apenas quando necessário (mais de ~20 linhas)
4. **Seleção manual**: Dropdown para mudar linguagem (se `showLanguageSelector=true`)

### 3.6 Base de Estilos

Usar `src/components/ui/code-block.tsx` como referência:
- Window dots (red, amber, green)
- Line numbers (sempre visíveis)
- Theme: `vesper`
- Border: `border-border-primary`
- Background: `bg-bg-input`
- Font: `font-mono text-sm`

### 3.7 Scrollbar

- Largura: 6px
- Cor thumb: `#3a3a3a` (discreta, mais clara que bg)
- Cor track: transparent
- Única (externa ao container)

> **Nota**: Shiki não tem auto-detecção nativa. A detecção é feita via highlight.js, e a renderização via Shiki.

### 3.8 Linguagens Suportadas (12 linguagens)

1. JavaScript
2. TypeScript
3. Python
4. Java
5. Go
6. Rust
7. Ruby
8. PHP
9. SQL
10. HTML
11. CSS
12. JSON

> Detecção via highlight.js, renderização via Shiki

---

## 4. To-Dos para Implementação

- [x] **Instalar dependência adicional**: `npm install highlight.js` (para auto-detecção)
- [x] **Criar hook de detecção**: `useLanguageDetector.ts` usando highlight.js
- [x] **Criar componente base**: `CodeEditor.tsx` com Shiki (Client Component)
- [x] **Implementar textarea sobreposta**: Textarea transparente sobre código destacado
- [x] **Implementar detecção automática**: Ao colar, detecta linguagem
- [x] **Números de linha sempre visíveis**: Column esquerda
- [x] **Altura fixa**: h-80 (320px)
- [x] **Barra de rolagem customizada**: Única, externa, cor #3a3a3a
- [x] **Adicionar seletor de linguagem**: Dropdown para seleção manual
- [x] **Estilizar com base no code-block.tsx**: Window dots, theme vesper
- [x] **Integrar com homepage**: Substituir CodeBlock por CodeEditor
- [x] **Testar com as 12 linguagens**: JS, TS, Python, Java, Go, Rust, Ruby, PHP, SQL, HTML, CSS, JSON

---

## 5. Fluxo na Homepage

```
Usuário cola código (Ctrl+V)
       ↓
Captura evento de paste
       ↓
Detecta linguagem automaticamente (highlight.js)
       ↓
Transiciona para modo display
       ↓
Renderiza com Shiki (theme: vesper)
       ↓
Exibe com cores + line numbers + window dots
       ↓
Usuário pode clicar para editar novamente
```

---

## 6. Referências

- [Shiki - Documentação](https://shiki.style)
- [Shiki - NPM](https://www.npmjs.com/package/shiki)
- [Highlight.js - NPM](https://www.npmjs.com/package/highlight.js)
- [Code Block existente](./src/components/ui/code-block.tsx)
- [Ray So - GitHub](https://github.com/raycast/ray-so)

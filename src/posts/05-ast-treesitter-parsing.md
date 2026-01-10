---
layout: layouts/post.njk
tags: [post]
title: "AST, Tree-sitter e l'Arte di Comprendere il Codice"
subtitle: "Come Tree-sitter abilita l'analisi semantica del codice"
date: 2025-01-05
quote: "La semplicità è la suprema sofisticazione"
quoteAuthor: "Leonardo da Vinci"
---

## Il Codice come Struttura, Non come Testo

Quando Leonardo da Vinci parlava di semplicità come suprema sofisticazione, si riferiva all'arte di trovare l'essenza delle cose, di vedere oltre la superficie, di comprendere la struttura profonda che sottende alla forma apparente.

Questa è esattamente la sfida che affrontiamo quando cerchiamo di **comprendere il codice**.

Per l'occhio inesperto, il codice è una sequenza di caratteri. Testo. Stringhe. Regex. Ma per chi sviluppa strumenti di analisi del codice, questa visione è tragicamente limitata.

Considerate questa funzione TypeScript:

```typescript
function calculateDiscount(price: number, customer: Customer): number {
  if (customer.isPremium) {
    return price * 0.8;
  }
  return price;
}
```

**Come testo**, è una sequenza di 132 caratteri.

**Come Abstract Syntax Tree (AST)**, è:
```
FunctionDeclaration
├── Identifier: "calculateDiscount"
├── Parameters
│   ├── Parameter
│   │   ├── Identifier: "price"
│   │   └── TypeAnnotation: "number"
│   └── Parameter
│       ├── Identifier: "customer"
│       └── TypeAnnotation: "Customer"
├── ReturnType: "number"
└── Block
    └── IfStatement
        ├── Condition
        │   └── MemberExpression
        │       ├── Object: "customer"
        │       └── Property: "isPremium"
        ├── ThenBranch
        │   └── ReturnStatement
        │       └── BinaryExpression (*)
        │           ├── Left: "price"
        │           └── Right: 0.8
        └── ElseBranch
            └── ReturnStatement
                └── Identifier: "price"
```

**La differenza è abissale.**

Con il testo, puoi cercare la stringa "calculateDiscount". Con l'AST, puoi:
- Estrarre **tutti i parametri** con i loro tipi
- Identificare **tutte le condizioni** nella funzione
- Calcolare **complexity metrics** (branches, paths)
- Rilevare **code smells** (troppi parametri, nesting profondo)
- Generare **documentazione** automatica con parametri e return type
- **Refactorare** in sicurezza (renaming, extraction)

**AST non è solo parsing. È comprensione semantica.**

E CodeIntel System è costruito su questa comprensione.

## Il Problema: Parse Multi-Linguaggio

CodeIntel supporta **7 linguaggi**: JavaScript, TypeScript, Python, Java, Go, Rust, C#.

Ogni linguaggio ha:
- **Sintassi diversa**: `def` vs `func` vs `function`
- **Semantica diversa**: duck typing vs static typing
- **Costrutti diversi**: comprehensions Python, generics Java, traits Rust

Come si fa parsing **unificato**?

### Soluzione Naïve: Regex (NO!)

```typescript
// ❌ WRONG - Regex parsing
function extractFunctions(code: string): Function[] {
  const regex = /function\s+(\w+)\s*\(([^)]*)\)/g;
  const matches = code.matchAll(regex);

  return Array.from(matches).map(m => ({
    name: m[1],
    params: m[2].split(',').map(p => p.trim()),
  }));
}
```

**Problemi**:
1. **Fragile**: Fallisce su funzioni arrow, async, generator
2. **Language-specific**: Funziona solo per JavaScript
3. **No nesting**: Non gestisce funzioni nested
4. **No types**: Non estrae type annotations
5. **No context**: Non sa se è dentro una classe, module, etc.

**Regex è tool sbagliato per parsing codice.**

### Soluzione Corretta: Abstract Syntax Tree

Un parser AST:
1. **Tokenizza** il codice (lexing)
2. **Costruisce albero sintattico** (parsing)
3. **Valida semantica** (type checking, opzionale)

**Parser tradizionali**:
- **Babel** (JavaScript/TypeScript)
- **Python AST** (Python)
- **JavaParser** (Java)
- **go/parser** (Go)

**Problema**: Ogni linguaggio richiede parser diverso, con API diverse.

**Soluzione CodeIntel**: **Tree-sitter** - universal parser.

## Tree-sitter: Il Parser Universale

[Tree-sitter](https://tree-sitter.github.io/) è un parser generator creato da GitHub, usato in Atom, Neovim, GitHub stesso.

**Caratteristiche**:
- **Multi-language**: 40+ linguaggi supportati
- **Incremental**: Re-parse solo parti modificate (performante per editor)
- **Error-tolerant**: Parse anche codice con errori sintattici
- **Query language**: Interroga AST con pattern matching
- **C library**: Bindings per JS, Python, Rust, Go

**Implementazione in CodeIntel**:

```typescript
import Parser from 'tree-sitter';
import TypeScript from 'tree-sitter-typescript';
import Python from 'tree-sitter-python';
import Java from 'tree-sitter-java';
// ... altri linguaggi

export class ASTParser {
  private parsers: Map<Language, Parser>;

  constructor() {
    this.parsers = new Map();
    this.initializeParsers();
  }

  private initializeParsers(): void {
    // TypeScript
    const tsParser = new Parser();
    tsParser.setLanguage(TypeScript.typescript);
    this.parsers.set('typescript', tsParser);

    // Python
    const pyParser = new Parser();
    pyParser.setLanguage(Python);
    this.parsers.set('python', pyParser);

    // ... altri linguaggi
  }

  async parse(code: string, language: Language): Promise<AST> {
    const parser = this.parsers.get(language);
    if (!parser) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const tree = parser.parse(code);
    return this.transformTree(tree, language);
  }
}
```

**Parsing esempio**:

```typescript
const code = `
function greet(name: string): void {
  console.log(\`Hello, \${name}!\`);
}
`;

const ast = await astParser.parse(code, 'typescript');

console.log(ast.rootNode.type); // "program"
console.log(ast.rootNode.children[0].type); // "function_declaration"
```

## Language Detection: Multi-Strategy

Prima di parsare, devo **identificare il linguaggio**.

**CodeIntel implementa detection multi-strategy**:

### Strategy 1: File Extension

```typescript
const EXTENSION_MAP: Record<string, Language> = {
  '.ts': 'typescript',
  '.tsx': 'typescriptreact',
  '.js': 'javascript',
  '.jsx': 'javascriptreact',
  '.py': 'python',
  '.java': 'java',
  '.go': 'go',
  '.rs': 'rust',
  '.cs': 'csharp',
};

function detectByExtension(filePath: string): Language | null {
  const ext = path.extname(filePath);
  return EXTENSION_MAP[ext] || null;
}
```

**Precisione**: ~95% per file con estensioni standard.

**Fallisce su**: File senza estensione, estensioni ambigue (`.h` = C o C++?)

### Strategy 2: Content Analysis

Fallback quando extension-based fallisce:

```typescript
const CONTENT_PATTERNS: Record<Language, RegExp[]> = {
  typescript: [
    /^import\s+.+\s+from\s+['"].*['"]/m,
    /:\s*\w+(\[\]|\<.*\>)?(\s*=|\s*\{)/m, // Type annotations
    /interface\s+\w+/m,
  ],
  python: [
    /^import\s+\w+/m,
    /^from\s+\w+\s+import/m,
    /^def\s+\w+\s*\(/m,
  ],
  java: [
    /^package\s+[\w.]+;/m,
    /^public\s+class\s+\w+/m,
    /^import\s+[\w.]+;/m,
  ],
  // ...
};

function detectByContent(code: string): Language | null {
  for (const [lang, patterns] of Object.entries(CONTENT_PATTERNS)) {
    const matchCount = patterns.filter(p => p.test(code)).length;
    if (matchCount >= 2) { // Require at least 2 patterns
      return lang as Language;
    }
  }
  return null;
}
```

**Precisione**: ~85% per codice ben formato.

**Fallisce su**: Codice minimal, linguaggi molto simili (JS vs TS senza type annotations)

### Strategy 3: Shebang (Unix Scripts)

```typescript
function detectByShebang(code: string): Language | null {
  const shebangMatch = code.match(/^#!\s*\/.*\/(python|node|bash)/);
  if (shebangMatch) {
    const interpreter = shebangMatch[1];
    return INTERPRETER_MAP[interpreter] || null;
  }
  return null;
}
```

**Uso**: Script eseguibili su Unix.

### Combined Detection

```typescript
export class LanguageDetector {
  detect(filePath: string, code?: string): Language {
    // Strategy 1: Shebang (highest priority)
    if (code) {
      const shebang = this.detectByShebang(code);
      if (shebang) return shebang;
    }

    // Strategy 2: Extension
    const extension = this.detectByExtension(filePath);
    if (extension) return extension;

    // Strategy 3: Content analysis (fallback)
    if (code) {
      const content = this.detectByContent(code);
      if (content) return content;
    }

    // Default: treat as plain text
    throw new Error(`Unable to detect language for ${filePath}`);
  }
}
```

**Risultato**: 43/43 language detection tests passing, copertura completa.

## AST Traversal: Navigare l'Albero

Una volta parsato, devo **navigare l'AST** per estrarre informazioni.

### Query Language di Tree-sitter

Tree-sitter fornisce un **query language** potente:

```scheme
; Query: Extract all function declarations
(function_declaration
  name: (identifier) @function.name
  parameters: (formal_parameters) @function.params
  body: (statement_block) @function.body
)
```

**Uso in CodeIntel**:

```typescript
const query = `
  (function_declaration
    name: (identifier) @name
    parameters: (formal_parameters) @params
    return_type: (type_annotation)? @return
  )
`;

const matches = queryNode(ast.rootNode, query);

const functions = matches.map(m => ({
  name: m.captures.name.text,
  parameters: parseParameters(m.captures.params),
  returnType: m.captures.return?.text || 'void',
}));
```

### Visitor Pattern per Traversal Complesso

Per analisi complesse, uso **Visitor pattern**:

```typescript
interface ASTVisitor {
  visitFunctionDeclaration(node: FunctionNode): void;
  visitClassDeclaration(node: ClassNode): void;
  visitImportDeclaration(node: ImportNode): void;
  // ...
}

class SemanticChunker implements ASTVisitor {
  private chunks: Chunk[] = [];

  visitFunctionDeclaration(node: FunctionNode): void {
    // Extract function as chunk
    this.chunks.push({
      type: 'function',
      name: node.name.text,
      content: node.text,
      startLine: node.startPosition.row,
      endLine: node.endPosition.row,
    });

    // Recurse into nested functions
    for (const child of node.children) {
      if (child.type === 'function_declaration') {
        this.visitFunctionDeclaration(child);
      }
    }
  }

  visitClassDeclaration(node: ClassNode): void {
    // Extract class with methods
    const methods = node.children
      .filter(c => c.type === 'method_definition')
      .map(m => this.visitMethodDefinition(m));

    this.chunks.push({
      type: 'class',
      name: node.name.text,
      methods: methods.map(m => m.name),
      content: node.text,
    });
  }

  // ... altre visit methods
}
```

**Beneficio**: Separazione delle concerns, estensibilità.

## Semantic Chunking: Dividere Intelligentemente

Uno dei problemi chiave in RAG è: **come dividere il codice in chunks?**

**Approccio naïve**: Fixed-size chunks (ogni 100 righe).

**Problema**: Spezza funzioni a metà, perde contesto.

**Approccio CodeIntel**: **Semantic chunking** basato su AST.

### Chunking Strategy Gerarchica

```typescript
export class SemanticChunker {
  chunk(ast: AST, maxChunkSize: number): Chunk[] {
    const chunks: Chunk[] = [];

    // PRIORITY 1: Function-level chunks
    const functions = this.extractFunctions(ast);
    for (const func of functions) {
      if (func.text.length <= maxChunkSize) {
        chunks.push(this.createChunk(func, 'function'));
      } else {
        // Function too large, split by statements
        chunks.push(...this.chunkByStatements(func, maxChunkSize));
      }
    }

    // PRIORITY 2: Class-level chunks (if no functions)
    if (chunks.length === 0) {
      const classes = this.extractClasses(ast);
      chunks.push(...classes.map(c => this.createChunk(c, 'class')));
    }

    // PRIORITY 3: Import-level chunks
    const imports = this.extractImports(ast);
    if (imports.length > 0) {
      chunks.push(this.createChunk({ text: imports.join('\n') }, 'imports'));
    }

    // FALLBACK: File-level chunk
    if (chunks.length === 0) {
      chunks.push(this.createChunk(ast.rootNode, 'file'));
    }

    return chunks;
  }
}
```

**Risultato**:
- **Contesto preservato**: Funzioni complete, non spezzate
- **Granularità ottimale**: Chunks semanticamente significativi
- **Performance**: Embedding più preciso (funzione = 1 concetto)

**Test coverage**: 100% del chunker (35 test specifici).

## Esempio Concreto: Extracting Function Metadata

Caso d'uso reale da **DocumentationAgent**:

**Input (TypeScript)**:
```typescript
/**
 * Calculates user's age based on birthdate
 */
export async function calculateAge(
  birthdate: Date,
  referenceDate?: Date
): Promise<number> {
  const ref = referenceDate || new Date();
  const diff = ref.getTime() - birthdate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
}
```

**AST extraction**:

```typescript
const functionNode = findNode(ast, 'function_declaration');

const metadata = {
  name: extractIdentifier(functionNode, 'name'),
  // "calculateAge"

  isExported: hasModifier(functionNode, 'export'),
  // true

  isAsync: hasModifier(functionNode, 'async'),
  // true

  parameters: extractParameters(functionNode),
  // [
  //   { name: 'birthdate', type: 'Date', optional: false },
  //   { name: 'referenceDate', type: 'Date', optional: true }
  // ]

  returnType: extractReturnType(functionNode),
  // "Promise<number>"

  leadingComment: extractLeadingComment(functionNode),
  // "Calculates user's age based on birthdate"

  complexity: calculateCyclomaticComplexity(functionNode),
  // 2 (due to || operator)

  loc: functionNode.endPosition.row - functionNode.startPosition.row,
  // 6 lines
};
```

**Uso**: Generare documentazione JSDoc completa, automaticamente.

## Performance: Perché Tree-sitter È Veloce

**Benchmark da Sprint 2** (parsing 50 file TypeScript, ~5000 LOC):

| Parser | Time | Incrementale |
|--------|------|--------------|
| Babel | ~2.5s | No |
| TypeScript Compiler | ~3.2s | No |
| **Tree-sitter** | **~800ms** | **Sì** |

**3-4x più veloce** per parsing completo.

**Incremental parsing**: Se modifico 1 funzione in un file di 1000 righe, Tree-sitter re-parse **solo quella funzione**, non tutto il file.

**Questo è critico per**:
- Editor live analysis (Neovim, VS Code)
- Watch mode durante sviluppo
- Large codebase indexing (100K+ LOC)

## Error Tolerance: Parse Anche Codice Rotto

Vantaggio sottovalutato: Tree-sitter **tollera errori sintattici**.

**Esempio**:
```typescript
function broken(x) {
  console.log(x)
  // Missing closing brace
```

**Babel**: Throws `SyntaxError`, parsing fails.

**Tree-sitter**: Parse fino a dove possibile, crea `ERROR` node per parte invalida.

```
FunctionDeclaration
├── Identifier: "broken"
├── Parameters: [x]
└── Block
    ├── ExpressionStatement: console.log(x)
    └── ERROR  ← Marks error but continues
```

**Beneficio per CodeIntel**:
- Posso analizzare **work-in-progress code**
- Posso estrarre funzioni valide anche se file ha errori
- UX migliore (non crasha su typo temporaneo)

## Integrazione Multi-Language: I 7 Linguaggi

CodeIntel supporta:

| Linguaggio | Grammar | AST Query Pattern |
|-----------|---------|-------------------|
| **TypeScript** | `tree-sitter-typescript` | `function_declaration`, `arrow_function`, `method_definition` |
| **JavaScript** | `tree-sitter-javascript` | Same as TypeScript (subset) |
| **Python** | `tree-sitter-python` | `function_definition`, `class_definition` |
| **Java** | `tree-sitter-java` | `method_declaration`, `class_declaration` |
| **Go** | `tree-sitter-go` | `function_declaration`, `method_declaration` |
| **Rust** | `tree-sitter-rust` | `function_item`, `impl_item` |
| **C#** | `tree-sitter-c-sharp` | `method_declaration`, `class_declaration` |

**Unified interface**:

```typescript
interface ParsedFunction {
  name: string;
  parameters: Parameter[];
  returnType: string | null;
  body: string;
  loc: number;
}

// Language-specific extractors
const extractors: Record<Language, FunctionExtractor> = {
  typescript: extractTypeScriptFunctions,
  python: extractPythonFunctions,
  java: extractJavaFunctions,
  // ...
};

export class ASTParser {
  extractFunctions(ast: AST, language: Language): ParsedFunction[] {
    const extractor = extractors[language];
    return extractor(ast);
  }
}
```

**Risultato**: Stesso workflow per tutti i linguaggi, logica specifica isolata.

## Conclusione: Vedere Oltre la Superficie

Leonardo da Vinci cercava la semplicità oltre la complessità apparente. Gli AST fanno esattamente questo: riducono il codice - apparentemente complesso - alla sua **struttura essenziale**.

Quando uso Tree-sitter per parsare codice, non sto solo tokenizzando caratteri. Sto **comprendendo significato**. Sto estraendo:
- **Cosa** fa il codice (funzioni, classi)
- **Come** lo fa (controllo di flusso, chiamate)
- **Perché** è strutturato così (pattern architetturali)

Questa comprensione semantica è il **fondamento** di CodeIntel. Senza AST, non potrei:
- Fare semantic chunking intelligente
- Generare documentazione accurata
- Rilevare code smells architetturali
- Calcolare metriche di complessità

**AST non è solo parsing. È visione.**

E come Leonardo vedeva la struttura anatomica oltre la pelle, CodeIntel vede la struttura semantica oltre la sintassi.

Nel prossimo post, esploreremo CI/CD, pre-commit hooks, e come quality gates automatizzate proteggono la qualità del codice.

---

**Nel prossimo post**: CI/CD, Pre-Commit Hooks e Quality Gates - La Guardia della Qualità

---

**Serie "CodeIntel System: Dal Concetto al Codice"**
- Post 1: [La Visione del Progetto](/Journey/posts/01-la-visione-del-progetto/)
- Post 2: [SDLC e Metodologia Agile](/Journey/posts/02-sdlc-e-metodologia-agile/)
- Post 3: [Analisi, Progettazione e Architettura](/Journey/posts/03-analisi-progettazione-architettura/)
- Post 4: [L'IA come Co-Sviluppatore](/Journey/posts/04-ia-come-co-sviluppatore/)
- **Post 5**: AST, Tree-sitter e Parsing del Codice ← *Sei qui*
- Post 6: [CI/CD e Quality Gates](/Journey/posts/06-cicd-quality-gates/)
- Post 7: [Agent Framework e Orchestrazione](/Journey/posts/07-agent-framework-orchestration/)
- Post 8: [Documentazione come Filosofia](/Journey/posts/08-documentazione-come-filosofia/)

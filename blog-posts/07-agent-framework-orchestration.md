# Agent Framework: Architettura per la Delega Intelligente

---

> *"Se ho visto più lontano, ho potuto farlo stando in piedi sulle spalle di giganti"*
> — Bernardo di Chartres (attribuito anche a Isaac Newton)

---

## Costruire sulle Fondamenta dei Giganti

Quando Bernardo di Chartres, nel XII secolo, pronunciò queste parole, esprimeva un principio fondamentale del progresso umano: **non partiamo mai da zero**. Ogni innovazione si costruisce su conoscenza precedente. Ogni scoperta poggia su fondamenta create da chi è venuto prima.

Nel software, questo principio è amplificato. Non riscriviamo algoritmi di sorting. Non reimplementiamo HTTP. Non creiamo linguaggi da zero. **Riusiamo**, **componiam**, **orchestriamo**.

E l'**Agent Framework** di CodeIntel è esattamente questo: un pattern architetturale che permette di costruire agenti complessi **componendo** agenti più semplici, **orchestrando** capacità esistenti, **riusando** pattern consolidati.

Non ho inventato nulla di rivoluzionario. Ho semplicemente applicato principi solidi:
- **Separation of Concerns** (ogni agent ha responsabilità chiara)
- **Composition over Inheritance** (comporre agents, non ereditare god objects)
- **Dependency Injection** (iniettare servizi, non istanziare)
- **Interface Segregation** (interfacce piccole, specifiche)

**Sono sulle spalle di giganti: Uncle Bob Martin, Martin Fowler, Gang of Four.**

E il risultato è un framework che permette di costruire **6 agenti specializzati** con architettura consistente, testabilità completa, estensibilità garantita.

## Il Problema: God Object Agents

Prima di definire l'Agent Framework, ho avuto una fase di esplorazione. E ho fatto l'errore classico: il **God Object Agent**.

**Versione naive (Anti-Pattern)**:

```typescript
// ❌ ANTI-PATTERN: God Object Agent
class CodeIntelAgent {
  // 2000+ lines of code doing EVERYTHING

  async indexCodebase(path: string): Promise<void> {
    // Language detection (200 lines)
    const files = await fs.readdir(path);
    const language = this.detectLanguage(files[0]);
    // ...

    // AST parsing (300 lines)
    const parser = new Parser();
    const ast = parser.parse(content);
    // ...

    // Embedding generation (150 lines)
    const chunks = this.chunkCode(ast);
    const embeddings = await this.generateEmbeddings(chunks);
    // ...

    // Vector store operations (200 lines)
    await this.upsertToVectorStore(embeddings);
    // ...

    // Documentation generation (400 lines)
    const docs = await this.generateDocs(ast);
    // ...

    // Architecture analysis (500 lines)
    const architecture = await this.analyzeArchitecture(ast);
    // ...
  }

  private detectLanguage(file: string): Language {
    // 200 lines of detection logic
  }

  private chunkCode(ast: AST): Chunk[] {
    // 300 lines of chunking logic
  }

  // ... 10 more private methods, 1500+ lines total
}
```

**Problemi**:
1. **Monolite inestensibile**: Adding new capability requires modifying 2000-line class
2. **Impossibile testare**: No way to test language detection without entire agent
3. **Violazione SRP**: Single class with 10+ responsibilities
4. **Zero riuso**: Can't reuse language detection in other contexts
5. **Accoppiamento alto**: Everything depends on everything

**Lezione**: **Non scalava.**

## La Soluzione: Agent Framework con Orchestrazione

La soluzione è stata progettata in **Sprint 3, Task 6** (3 story points, 1,576 righe di documentazione).

### Principi Fondamentali

**1. Agents come Orchestratori, Non Implementatori**

```typescript
// ✅ CORRECT: Agent as Orchestrator
export class CodebaseIndexAgent extends BaseAgent {
  constructor(
    private languageDetector: ILanguageDetector,  // Core service
    private astParser: IASTParser,                // Core service
    private embedder: IEmbeddings,                // Core service
    private vectorStore: IVectorStore,            // Core service
    logger: ILogger
  ) {
    super(logger);
  }

  async index(files: File[]): Promise<IndexResult> {
    const traceId = this.generateTraceId();

    // ORCHESTRATION (not implementation)
    const results = await Promise.all(
      files.map(async (file) => {
        const lang = await this.languageDetector.detect(file.path);
        const ast = await this.astParser.parse(file.content, lang);
        const chunks = this.chunkSemantically(ast, file);
        return chunks;
      })
    );

    const allChunks = results.flat();
    const embeddings = await this.embedder.embedBatch(
      allChunks.map(c => c.content)
    );

    await this.vectorStore.upsertBatch(
      this.buildDocuments(allChunks, embeddings)
    );

    return { filesIndexed: files.length, chunksCreated: allChunks.length };
  }

  // Agent-specific logic (business workflow)
  private chunkSemantically(ast: AST, file: File): Chunk[] {
    // Chunking strategy is agent-specific
    // But parsing is delegated to Core service
  }
}
```

**Agent responsibility**: Workflow orchestration + business logic
**Core services responsibility**: Technical capabilities (parsing, embedding, storage)

**2. BaseAgent: Shared Infrastructure**

```typescript
export abstract class BaseAgent {
  constructor(protected logger: ILogger) {}

  protected generateTraceId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected logStart(traceId: string, operation: string, context: object): void {
    this.logger.info(`[${traceId}] ${operation} START`, context);
  }

  protected logEnd(traceId: string, operation: string, metrics: object): void {
    this.logger.info(`[${traceId}] ${operation} END`, metrics);
  }

  protected logError(traceId: string, operation: string, error: Error): void {
    this.logger.error(`[${traceId}] ${operation} ERROR`, {
      message: error.message,
      stack: error.stack,
    });
  }

  // Validation helpers
  protected validateNonEmpty<T>(value: T[], name: string): void {
    if (!value || value.length === 0) {
      throw new Error(`${name} cannot be empty`);
    }
  }

  protected validateExists<T>(value: T | null | undefined, name: string): T {
    if (value === null || value === undefined) {
      throw new Error(`${name} is required`);
    }
    return value;
  }
}
```

**Benefici**:
- **Consistency**: All agents log same way
- **Traceability**: TraceId follows request across services
- **DRY**: Validation helpers reused
- **Testability**: Can test BaseAgent independently

**3. Interface-Based Dependencies**

```typescript
// Core service interfaces
export interface ILanguageDetector {
  detect(filePath: string, content?: string): Promise<Language>;
}

export interface IASTParser {
  parse(content: string, language: Language): Promise<AST>;
}

export interface IEmbeddings {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

export interface IVectorStore {
  upsert(doc: VectorDocument): Promise<void>;
  upsertBatch(docs: VectorDocument[]): Promise<void>;
  query(embedding: number[], limit: number): Promise<SearchResult[]>;
}

// Agent depends on interfaces, not implementations
export class CodebaseIndexAgent {
  constructor(
    private languageDetector: ILanguageDetector,  // Interface
    private astParser: IASTParser,                // Interface
    // ...
  ) {}
}
```

**Benefici**:
- **Testability**: Mock implementations for unit tests
- **Flexibility**: Swap implementations without changing agents
- **Decoupling**: Agents don't know about ChromaDB, Ollama, etc.

## Hierarchical Agent Orchestration

Pattern avanzato per agenti complessi: **Parent agent orchestra child agents**.

**Use case**: **ArchitectureAnalysisAgent** (Sprint 7)

### Problem Statement

Architecture analysis richiede:
1. **Dependency analysis**: Chi dipende da chi? Circular dependencies?
2. **Pattern detection**: Layered? Hexagonal? Microservices?
3. **Metrics calculation**: Cyclomatic complexity, coupling, cohesion

Mettere tutto in un agent = God Object.

**Soluzione**: Parent agent + 3 child agents specializzati.

### Architecture

```
┌──────────────────────────────────┐
│  ArchitectureAnalysisAgent       │  ← Parent Agent (Orchestrator)
│  - Coordinates child agents      │
│  - Synthesizes results           │
│  - Generates final report        │
└────────────┬─────────────────────┘
             │
    ┌────────┴────────┬──────────────────┐
    │                 │                  │
┌───▼────────┐  ┌─────▼──────┐  ┌───────▼─────────┐
│ Dependency │  │  Pattern   │  │    Metrics      │  ← Child Agents
│ Analyzer   │  │  Detector  │  │   Calculator    │
└────────────┘  └────────────┘  └─────────────────┘
```

### Implementation

**Parent Agent**:

```typescript
export class ArchitectureAnalysisAgent extends BaseAgent {
  constructor(
    private dependencyAnalyzer: DependencyAnalyzer,  // Child agent 1
    private patternDetector: PatternDetector,        // Child agent 2
    private metricsCalculator: MetricsCalculator,    // Child agent 3
    logger: ILogger
  ) {
    super(logger);
  }

  async analyze(projectPath: string): Promise<ArchitectureReport> {
    const traceId = this.generateTraceId();
    this.logStart(traceId, 'ArchitectureAnalysis', { projectPath });

    // PHASE 1: Parallel execution of child agents
    const [dependencies, patterns, metrics] = await Promise.all([
      this.dependencyAnalyzer.analyze(projectPath),
      this.patternDetector.detect(projectPath),
      this.metricsCalculator.calculate(projectPath),
    ]);

    // PHASE 2: Parent synthesizes results
    const report: ArchitectureReport = {
      dependencies: {
        graph: dependencies.graph,
        cycles: dependencies.cycles,
        orphans: dependencies.orphans,
      },
      patterns: {
        architectural: patterns.architectural,  // Layered, Hexagonal, etc.
        design: patterns.design,                // Factory, Repository, etc.
      },
      metrics: {
        complexity: metrics.complexity,
        coupling: metrics.coupling,
        cohesion: metrics.cohesion,
      },
      health: this.calculateHealthScore(metrics),
      recommendations: this.generateRecommendations(patterns, metrics),
      diagrams: this.generateMermaidDiagrams(dependencies),
      traceId,
    };

    this.logEnd(traceId, 'ArchitectureAnalysis', {
      filesAnalyzed: dependencies.fileCount,
      patternsDetected: patterns.architectural.length + patterns.design.length,
    });

    return report;
  }

  // Parent-specific logic
  private calculateHealthScore(metrics: Metrics): HealthScore {
    // Synthesis logic
    const complexityScore = this.scoreComplexity(metrics.complexity);
    const couplingScore = this.scoreCoupling(metrics.coupling);
    const cohesionScore = this.scoreCohesion(metrics.cohesion);

    return {
      overall: (complexityScore + couplingScore + cohesionScore) / 3,
      breakdown: { complexity: complexityScore, coupling: couplingScore, cohesion: cohesionScore },
    };
  }

  private generateRecommendations(
    patterns: Patterns,
    metrics: Metrics
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Recommendation logic based on child agent results
    if (metrics.complexity.average > 10) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Complexity',
        message: 'Average cyclomatic complexity exceeds 10. Consider refactoring complex functions.',
        affectedFiles: metrics.complexity.highComplexityFiles,
      });
    }

    if (patterns.architectural.length === 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Architecture',
        message: 'No clear architectural pattern detected. Consider adopting Layered or Hexagonal architecture.',
      });
    }

    return recommendations;
  }
}
```

**Child Agent 1: DependencyAnalyzer**:

```typescript
export class DependencyAnalyzer {
  constructor(
    private astParser: IASTParser,
    private logger: ILogger
  ) {}

  async analyze(projectPath: string): Promise<DependencyReport> {
    const files = await this.getAllFiles(projectPath);

    // Build dependency graph
    const graph = new Map<string, string[]>();

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const ast = await this.astParser.parse(content, this.detectLanguage(file));

      // Extract imports
      const imports = this.extractImports(ast);
      graph.set(file, imports);
    }

    // Detect circular dependencies (DFS with recursion stack)
    const cycles = this.detectCycles(graph);

    // Find orphaned modules (no incoming edges)
    const orphans = this.findOrphans(graph);

    return {
      graph,
      cycles,
      orphans,
      fileCount: files.length,
    };
  }

  private detectCycles(graph: Map<string, string[]>): string[][] {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: string[][] = [];

    const dfs = (node: string, path: string[]): void => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, path);
        } else if (recStack.has(neighbor)) {
          // Cycle detected
          const cycleStart = path.indexOf(neighbor);
          cycles.push(path.slice(cycleStart));
        }
      }

      recStack.delete(node);
      path.pop();
    };

    for (const node of graph.keys()) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    return cycles;
  }
}
```

**Child Agent 2: PatternDetector**:

```typescript
export class PatternDetector {
  async detect(projectPath: string): Promise<PatternReport> {
    const files = await this.getAllFiles(projectPath);

    return {
      architectural: await this.detectArchitecturalPatterns(files),
      design: await this.detectDesignPatterns(files),
    };
  }

  private async detectArchitecturalPatterns(
    files: string[]
  ): Promise<ArchitecturalPattern[]> {
    const patterns: ArchitecturalPattern[] = [];

    // Layered Architecture: detect controller/service/repository layers
    const hasControllers = files.some(f => /controller/i.test(f));
    const hasServices = files.some(f => /service/i.test(f));
    const hasRepositories = files.some(f => /repository/i.test(f));

    if (hasControllers && hasServices && hasRepositories) {
      patterns.push({
        name: 'Layered Architecture',
        confidence: 0.85,
        evidence: ['Controllers', 'Services', 'Repositories'].join(', '),
      });
    }

    // Hexagonal Architecture: detect ports/adapters
    const hasPorts = files.some(f => /port|interface/i.test(f));
    const hasAdapters = files.some(f => /adapter|impl/i.test(f));

    if (hasPorts && hasAdapters) {
      patterns.push({
        name: 'Hexagonal Architecture',
        confidence: 0.75,
        evidence: 'Ports and Adapters detected',
      });
    }

    return patterns;
  }

  private async detectDesignPatterns(
    files: string[]
  ): Promise<DesignPattern[]> {
    const patterns: DesignPattern[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');

      // Factory Pattern: class with create/build methods
      if (/class\s+\w+Factory/.test(content) && /create|build/.test(content)) {
        patterns.push({
          name: 'Factory Pattern',
          file,
          confidence: 0.9,
        });
      }

      // Repository Pattern: class with CRUD methods
      if (/class\s+\w+Repository/.test(content) && /find|save|delete/.test(content)) {
        patterns.push({
          name: 'Repository Pattern',
          file,
          confidence: 0.9,
        });
      }

      // Singleton: static instance + private constructor
      if (/private\s+static\s+instance/.test(content) && /private\s+constructor/.test(content)) {
        patterns.push({
          name: 'Singleton Pattern',
          file,
          confidence: 0.95,
        });
      }
    }

    return patterns;
  }
}
```

**Child Agent 3: MetricsCalculator**:

```typescript
export class MetricsCalculator {
  async calculate(projectPath: string): Promise<MetricsReport> {
    const files = await this.getAllFiles(projectPath);

    const complexityMetrics = await this.calculateComplexity(files);
    const couplingMetrics = await this.calculateCoupling(files);
    const cohesionMetrics = await this.calculateCohesion(files);

    return {
      complexity: complexityMetrics,
      coupling: couplingMetrics,
      cohesion: cohesionMetrics,
    };
  }

  private async calculateComplexity(
    files: string[]
  ): Promise<ComplexityMetrics> {
    const complexities: number[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const ast = await this.astParser.parse(content, this.detectLanguage(file));

      const functions = this.extractFunctions(ast);
      for (const func of functions) {
        const complexity = this.cyclomaticComplexity(func);
        complexities.push(complexity);
      }
    }

    return {
      average: this.mean(complexities),
      max: Math.max(...complexities),
      min: Math.min(...complexities),
      highComplexityFiles: this.filterHighComplexity(files, complexities, 10),
    };
  }

  private cyclomaticComplexity(funcNode: FunctionNode): number {
    let complexity = 1; // Base complexity

    // Count decision points
    const decisions = ['if', 'for', 'while', 'case', '&&', '||', '?'];
    for (const decision of decisions) {
      const occurrences = (funcNode.text.match(new RegExp(decision, 'g')) || []).length;
      complexity += occurrences;
    }

    return complexity;
  }
}
```

### Benefits of Hierarchical Orchestration

**1. Separation of Concerns**:
- DependencyAnalyzer: Graph theory algorithms
- PatternDetector: Pattern matching heuristics
- MetricsCalculator: Statistical analysis

**2. Independent Testing**:
```typescript
// Test child agent in isolation
describe('DependencyAnalyzer', () => {
  it('should detect circular dependencies', () => {
    const graph = new Map([
      ['A', ['B']],
      ['B', ['C']],
      ['C', ['A']], // Cycle: A → B → C → A
    ]);

    const analyzer = new DependencyAnalyzer(mockParser, mockLogger);
    const cycles = analyzer['detectCycles'](graph);

    expect(cycles).toHaveLength(1);
    expect(cycles[0]).toEqual(['A', 'B', 'C']);
  });
});

// Test parent agent with mocked children
describe('ArchitectureAnalysisAgent', () => {
  it('should orchestrate child agents', async () => {
    const mockDependencyAnalyzer = {
      analyze: vi.fn().mockResolvedValue({ graph: new Map(), cycles: [] }),
    };
    const mockPatternDetector = {
      detect: vi.fn().mockResolvedValue({ architectural: [], design: [] }),
    };
    const mockMetricsCalculator = {
      calculate: vi.fn().mockResolvedValue({ complexity: { average: 5 } }),
    };

    const agent = new ArchitectureAnalysisAgent(
      mockDependencyAnalyzer,
      mockPatternDetector,
      mockMetricsCalculator,
      mockLogger
    );

    await agent.analyze('/path/to/project');

    expect(mockDependencyAnalyzer.analyze).toHaveBeenCalledWith('/path/to/project');
    expect(mockPatternDetector.detect).toHaveBeenCalledWith('/path/to/project');
    expect(mockMetricsCalculator.calculate).toHaveBeenCalledWith('/path/to/project');
  });
});
```

**3. Parallelism**:
Child agents run **concurrently** (Promise.all), reducing total analysis time.

**4. Reusability**:
DependencyAnalyzer can be reused in:
- RefactoringAgent (detect tight coupling)
- CodeGenerationAgent (understand dependencies for new code)
- TestGenerationAgent (mock dependencies)

## Agent Testing Strategy

**Challenge**: Agents orchestrate multiple services. How to test without full infrastructure?

**Solution**: Mock services + sample codebases (designed in Sprint 4, Task 2)

### Mock Services

```typescript
// src/agents/__mocks__/MockLanguageDetector.ts
export class MockLanguageDetector implements ILanguageDetector {
  async detect(filePath: string): Promise<Language> {
    const ext = path.extname(filePath);
    const map: Record<string, Language> = {
      '.ts': 'typescript',
      '.py': 'python',
      '.java': 'java',
    };
    return map[ext] || 'javascript';
  }
}

// src/agents/__mocks__/MockEmbeddings.ts
export class MockEmbeddings implements IEmbeddings {
  async embed(text: string): Promise<number[]> {
    // Deterministic embedding for testing
    return Array(768).fill(0).map((_, i) => text.charCodeAt(i % text.length) / 255);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map(t => this.embed(t)));
  }
}

// ... 7 total mock services
```

### Sample Codebases

```
src/agents/__fixtures__/
├── sample-typescript/
│   ├── src/
│   │   ├── services/
│   │   │   └── UserService.ts
│   │   ├── controllers/
│   │   │   └── UserController.ts
│   │   └── utils/
│   │       └── validation.ts
│   └── package.json
├── sample-python/
│   ├── app/
│   │   ├── models.py
│   │   └── views.py
│   └── requirements.txt
└── sample-java/
    └── src/main/java/
        └── com/example/
            └── Application.java
```

### Test Pattern

```typescript
describe('CodebaseIndexAgent', () => {
  let agent: CodebaseIndexAgent;
  let mockServices: MockServices;

  beforeEach(() => {
    mockServices = createMockServices();
    agent = new CodebaseIndexAgent(
      mockServices.languageDetector,
      mockServices.astParser,
      mockServices.embedder,
      mockServices.vectorStore,
      mockServices.logger
    );
  });

  it('should index TypeScript sample codebase', async () => {
    const samplePath = path.join(__dirname, '__fixtures__/sample-typescript');
    const files = await loadSampleFiles(samplePath);

    const result = await agent.index(files);

    expect(result.filesIndexed).toBe(3);
    expect(result.chunksCreated).toBeGreaterThan(5); // Functions + classes
    expect(mockServices.vectorStore.upsertBatch).toHaveBeenCalled();
  });
});
```

**Benefits**:
- **Fast**: No real Ollama/ChromaDB needed (~50ms per test)
- **Deterministic**: Same input → same output
- **Isolated**: Test agent logic without infrastructure

**Integration tests** (with real services) run in CI.

## Conclusion: Standing on Shoulders

L'Agent Framework di CodeIntel non è innovazione radicale. È **applicazione rigorosa di principi consolidati**:

- **SOLID principles** (Uncle Bob Martin)
- **Composition over Inheritance** (Gang of Four)
- **Dependency Injection** (Martin Fowler)
- **Hierarchical orchestration** (Microservices patterns)

Come Bernardo di Chartres, sto sulle spalle di giganti.

Ma il risultato è un'architettura che:
- Ha permesso di costruire **6 agenti** in **5 sprint**
- Mantiene **94% test coverage** grazie a testability
- Scala a **nuovi agenti** senza riscrivere infrastruttura
- Isola **business logic** da **technical details**

**Il framework non è il goal. È il mezzo.**

Il goal è costruire software che duri, che scala, che si possa manutenere.

E per quello, serve architettura solida.

Nel prossimo e ultimo post, esploreremo la documentazione come filosofia: come ho documentato 7,000+ righe di sprint retrospectives, testing reports, architecture decisions.

---

**Nel prossimo post**: Documentazione come Filosofia - Sprint, Retrospettive e Memoria Collettiva

---

**Serie "CodeIntel System: Dal Concetto al Codice"**
- Post 1: La Visione del Progetto
- Post 2: SDLC e Metodologia Agile
- Post 3: Analisi, Progettazione e Architettura
- Post 4: L'IA come Co-Sviluppatore
- Post 5: AST, Tree-sitter e Parsing del Codice
- Post 6: CI/CD e Quality Gates
- **Post 7**: Agent Framework e Orchestrazione ← *Sei qui*
- Post 8: Documentazione come Filosofia

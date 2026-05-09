---
layout: layouts/post.njk
tags: [post, serie-codeintel]
title: "Agent Framework: Architettura per la Delega Intelligente"
subtitle: "Architettura multi-agente per sistemi di code intelligence"
date: 2026-01-25
quote: "Se ho visto più lontano, ho potuto farlo stando in piedi sulle spalle di giganti"
quoteAuthor: "Bernardo di Chartres"
---

## Costruire sulle Fondamenta dei Giganti

Quando Bernardo di Chartres, nel XII secolo, pronunciò queste parole, esprimeva un principio fondamentale del progresso umano: non partiamo mai da zero. Ogni innovazione si costruisce su conoscenza precedente.

Nel software questo principio è amplificato. Non riscriviamo algoritmi di sorting. Non reimplementiamo HTTP. Non creiamo linguaggi da zero. Riusiamo, componiamo, orchestriamo.

L'**Agent Framework** di CodeIntel è esattamente questo: un pattern architetturale che permette di costruire agenti complessi *componendo* agenti più semplici, *orchestrando* capacità esistenti, *riusando* pattern consolidati.

Non c'è nulla di rivoluzionario. Ho applicato principi solidi: Separation of Concerns, Composition over Inheritance, Dependency Injection, Interface Segregation. Sono sulle spalle di giganti — Uncle Bob Martin, Martin Fowler, Gang of Four.

## Il Problema: God Object Agents

La prima fase di esplorazione è finita male. Il classico errore: il **God Object Agent**. Una classe da 2000+ righe che fa tutto — language detection, AST parsing, embedding generation, vector store operations, documentation generation, architecture analysis.

I problemi:

- **Monolitico**: aggiungere una capability significa modificare la classe gigante.
- **Impossibile testare**: nessun modo di testare il language detector senza l'intero agente.
- **Single Responsibility violata**: una classe, dieci responsabilità.
- **Zero riuso**: il language detector è incastrato dentro l'agente, non riusabile.
- **Accoppiamento alto**: tutto dipende da tutto.

Non scalava.

## La Soluzione: Agent come Orchestratore

Un agent non implementa, **orchestra**. Le capacità tecniche stanno nei servizi Core; l'agent compone il workflow.

```typescript
export class CodebaseIndexAgent extends BaseAgent {
  constructor(
    private languageDetector: ILanguageDetector,
    private astParser: IASTParser,
    private embedder: IEmbeddings,
    private vectorStore: IVectorStore,
    logger: ILogger
  ) { super(logger); }

  async index(files: File[]): Promise<IndexResult> {
    const chunks = await Promise.all(files.map(async (file) => {
      const lang = await this.languageDetector.detect(file.path);
      const ast = await this.astParser.parse(file.content, lang);
      return this.chunkSemantically(ast, file);
    }));

    const allChunks = chunks.flat();
    const embeddings = await this.embedder.embedBatch(allChunks.map(c => c.content));
    await this.vectorStore.upsertBatch(this.buildDocs(allChunks, embeddings));

    return { filesIndexed: files.length, chunksCreated: allChunks.length };
  }
}
```

L'agent contiene **business workflow** e logica specifica del dominio (in questo caso, lo `chunkSemantically`). Tutto il resto è delegato a interfacce iniettate. Cambiare ChromaDB in Qdrant non tocca questa classe.

## BaseAgent: Infrastruttura Condivisa

Tutti gli agenti estendono `BaseAgent`, che fornisce:

- **TraceId generation** per logging distribuito.
- **Logging consistente** (start, end, error con context).
- **Validation helpers** (`validateNonEmpty`, `validateExists`).

Il risultato: ogni agent loga nello stesso modo, ogni richiesta è tracciabile, le validazioni non sono duplicate.

## Hierarchical Agent Orchestration

Per agent complessi, un parent orchestra child agent specializzati.

L'`ArchitectureAnalysisAgent` ha tre child:

- **DependencyAnalyzer**: dependency graph, ciclo detection, modulo orfani.
- **PatternDetector**: pattern architetturali (Layered, Hexagonal) e di design (Factory, Repository, Singleton).
- **MetricsCalculator**: complessità ciclomatica, accoppiamento, coesione.

Il parent esegue i tre child in parallelo (`Promise.all`), poi sintetizza i risultati: calcola un health score, genera raccomandazioni in base ai pattern e alle metriche, costruisce diagrammi.

I benefici:

- **Separation of Concerns**: ogni child ha un dominio chiaro.
- **Testability**: ogni child è testabile in isolamento, con mock semplici.
- **Parallelism**: i child sono indipendenti, eseguibili concorrentemente.
- **Reusability**: il `DependencyAnalyzer` è riusato da `RefactoringAgent` e da `CodeGenerationAgent`.

## Testing Strategy

Gli agent orchestrano servizi. Come si testano senza infrastruttura completa?

Due strumenti:

**Mock services** che implementano le interfacce in modo deterministico. `MockEmbeddings` ritorna un vettore deterministico calcolato dal testo; `MockLanguageDetector` mappa estensioni a linguaggi. Test rapidi, ripetibili, isolati.

**Sample codebases** in `__fixtures__/` con piccoli progetti TypeScript, Python, Java. Il test indicizza il sample, verifica il numero di chunk creati, controlla che i metodi giusti siano stati chiamati.

Per i test di integrazione (con servizi reali) si va in CI con i container.

## Conclusione: Sulle Spalle dei Giganti

L'Agent Framework non è innovazione radicale. È applicazione rigorosa di principi consolidati: SOLID, Composition over Inheritance, Dependency Injection, hierarchical orchestration.

Come Bernardo di Chartres, sto sulle spalle di giganti. Ma il risultato è un'architettura che permette di costruire agenti specializzati senza riscrivere infrastruttura, mantenere testabilità completa, isolare business logic da technical detail.

Il framework non è il goal. È il mezzo. Il goal è costruire software che duri, scali, si possa manutenere. Per quello serve architettura solida.

Nel prossimo e ultimo post della serie: documentazione come filosofia.

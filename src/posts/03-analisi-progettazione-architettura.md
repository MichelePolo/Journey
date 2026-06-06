---
layout: layouts/post.njk
tags: [post, serie-codeintel]
title: "Dall'Idea al Codice: Analisi, Progettazione e Architettura Software"
subtitle: "Dalle fondamenta all'architettura: progettare per durare"
date: 2025-11-30
quote: "L'architettura è la sapiente, rigorosa e magnifica combinazione di volumi nella luce"
quoteAuthor: "Le Corbusier"
---

## Architettura come Arte e Scienza

Quando Le Corbusier definiva l'architettura come "sapiente, rigorosa e magnifica combinazione di volumi nella luce", parlava di edifici. Ma la sua definizione si applica perfettamente anche al software. Perché l'architettura software, come quella fisica, è un equilibrio delicato tra arte e scienza, tra rigore e bellezza, tra struttura e flessibilità.

Un'architettura ben progettata è invisibile quando funziona, ma drammaticamente evidente quando manca. È la differenza tra un sistema che evolve con grazia e uno che collassa sotto il peso della propria complessità. È la differenza tra codice che invita alla modifica e codice che terrorizza al solo pensiero di toccarlo.

L'architettura non emerge spontaneamente dal codice. È una **scelta consapevole**, un **atto di design**, una **dichiarazione di intenti**.

## Il Problema: L'Entropia Architetturale

Tutti i sistemi software soffrono di una forma di seconda legge della termodinamica: tendono naturalmente verso il caos.

Inizia sempre bene. Il primo modulo è pulito, ben strutturato, testato. Poi arriva il secondo, che ha bisogno di qualcosa dal primo. "Solo una piccola dipendenza", pensiamo. Poi il terzo dipende dal secondo e dal primo. Poi il quarto crea una dipendenza circolare perché "è più comodo così". Poi qualcuno, di fretta, bypassa l'interfaccia e accede direttamente al database. Poi un altro aggiunge logica business nel controller HTTP "tanto è solo una validazione veloce".

E improvvisamente, senza che nessuno se ne accorga, hai un *big ball of mud*: un sistema dove tutto dipende da tutto, dove ogni modifica rischia di rompere qualcosa in un'area apparentemente non correlata, dove testare è impossibile.

L'architettura esiste per prevenire questo decay.

## La Dependency Rule

La regola, presa da Clean Architecture e Hexagonal Architecture, è una sola:

> Le dipendenze fluiscono sempre verso l'interno. Mai verso l'esterno.

```
Agents     →  Business logic & orchestration
Core       →  Domain logic & interfaces
Infrastructure  →  Implementation details
```

Permesso: Agent → Core, Core → Infrastructure, CLI/API → Agent.
Vietato: Core → Agent, Infrastructure → Core, Infrastructure → Agent.

Sembra semplice, ma è rivoluzionario. Immagina di dover cambiare database vettoriale, da Chroma a Qdrant. Con la regola rispettata: cambia *un file* di infrastruttura. Senza: devi modificare ogni agente, ogni test, ogni endpoint. Settimane di lavoro vs un pomeriggio.

Questa è la magia della dipendenza controllata: i cambiamenti implementativi non propagano al business logic. L'architettura ti protegge dal caos.

## I Quattro Layer

**Infrastructure** fornisce capacità tecniche (database, LLM, filesystem). Non sa nulla di domain o di workflow. Implementa, basta.

**Core Services** espone interfacce e contiene logica di dominio: parsing, embeddings, vector search, LLM client. Può dipendere dall'infrastructure ma non dagli agenti.

**Agents** orchestra i servizi core e implementa i workflow. Non implementa parsing o embedding direttamente: li delega. Ogni agente è un orchestratore, non un god object.

**Interface** (API, CLI) espone le capacità all'esterno. Validation, auth, rate limiting. Non chiama mai Core direttamente: passa sempre per Agents. Niente business logic qui.

## Pattern Applicati

### Dependency Injection

Le dipendenze entrano dal costruttore, sempre come interfacce, mai come classi concrete. Questo permette di mockare facilmente in test, di sostituire implementazioni senza toccare gli agenti, di rendere le dipendenze esplicite.

```typescript
export class CodebaseIndexAgent {
  constructor(
    private languageDetector: ILanguageDetector,
    private astParser: IASTParser,
    private embedder: IEmbeddings,
    private vectorStore: IVectorStore,
  ) {}
}
```

### Hexagonal (Ports & Adapters)

L'application core definisce porti (interfacce). Gli adapter (Chroma, Qdrant, Ollama, OpenAI) li implementano. Sostituire un adapter è un cambio di una riga nella composition root.

### Hierarchical Agent Orchestration

Per agenti complessi, un parent agent coordina child agent specializzati. L'`ArchitectureAnalysisAgent` coordina `DependencyAnalyzer`, `PatternDetector`, `MetricsCalculator`. Ogni child è testabile in isolamento, eseguibile in parallelo, riusabile in altri contesti.

## Anti-Pattern Evitati

**God Object Agent**: un agent da 2000 righe che fa tutto. Soluzione: separazione in servizi Core + agent orchestrator sottile.

**Mixing Analysis and Generation**: l'LLM genera tutto, inclusi "fatti" che dovrebbero essere misurabili. Soluzione: separare l'analisi (fatti deterministici, testabili) dalla sintesi (LLM con i fatti come input). Le metriche di complessità sono algoritmi; le raccomandazioni sono LLM. Le prime si testano, le seconde si validano.

**Direct Infrastructure Access**: un agent che istanzia direttamente il client di Chroma o Ollama. Soluzione: sempre passare per interfacce iniettate.

## Conclusione: Architettura come Investimento

Progettare un'architettura solida richiede tempo. È tempo investito, non perso.

Posso cambiare vector database in *un* file. Posso testare agenti in isolamento. Posso aggiungere nuovi linguaggi estendendo *un* servizio. Posso parallelizzare child agent senza race condition. Posso fare onboarding di nuovi sviluppatori con un'architettura chiara.

L'architettura non è overhead. È quella sapiente, rigorosa e magnifica combinazione che rende il software un'opera, non solo un mucchio di codice funzionante.

Nel prossimo post esploreremo come l'IA è integrata in CodeIntel — sia come strumento di sviluppo, sia come capability del sistema stesso.

---
layout: layouts/post.njk
tags: [post]
title: "L'Evoluzione della Qualità RAG: Documenti vs Codice Sorgente"
subtitle: "Come l'ingestion del codice richiede strategie diverse dai documenti tradizionali"
date: 2025-01-31
quote: "L'esperienza è il nome che diamo ai nostri errori"
quoteAuthor: "Oscar Wilde"
---

## Due Mondi Diversi: Documenti e Codice

Questo progetto nasce dall'esigenza, la voglia, di fornire uno strumento in grado di comprendere il software. Che consenta di chiedere tramite IA: "cosa fanno le classi?", "generami un api rest", "implementa gli unit test", "cerca le vulnerabilità nel codice". Ciascuno di noi sviluppatori ha i suoi aneddoti da raccontare ma queste domande e questi imperativi, beh fanno parte del vissuto comune a tutti.
Allo stesso tempo Codeintel è stato per me uno use-case per studiare approfonditamente l'IA as capability, l'IA as product e l'IA as a co-worker.

Appena iniziato a programmare si facevano gli hello world, poi per capire se adottare un framework nuovo sviluppavi la todo list, il remember the milk, i monkey tasks. Quanti ne avrò scritti? 50, forse 100, software di gestione dei task in stile kanban, todoist, a volte veri e propri task manager.
Il problema vero è che si trova un sacco di materiale online e puoi leggere fin che vuoi, ma se non metti le mani bene dentro il pantano non svilupperai mai l'insight, la conoscenza vera di un prodotto. Non volevo andare a gridare su YouTube, il posto dove vanno a gridare persone che talvolta non hanno niente da dire, scrivo un blog tecnico, seguirà una release.

Quando ho iniziato a progettare la pipeline RAG di CodeIntel, pensavo che indicizzare codice sorgente fosse simile a indicizzare documenti. Entrambi sono testo. Entrambi hanno struttura. Entrambi contengono significato.

**Ecco l'insight, le mani nel fango: SBAGLIAVO!**

La differenza tra indicizzare un documento e indicizzare codice sorgente è come la differenza tra fotografare un paesaggio e radiografare un corpo umano. Entrambe producono immagini, ma catturano realtà completamente diverse.

Un documento PDF o un articolo Confluence ha una struttura **lineare**: titoli, paragrafi, liste. Il significato fluisce dall'alto verso il basso. Le parole usate sono **le stesse parole** che un utente userebbe per cercarlo.

Il codice sorgente è diverso. Ha una struttura **gerarchica e sintattica**: funzioni dentro classi, statement dentro blocchi, espressioni dentro statement. E soprattutto: le parole nel codice **non sono le parole che un utente usa per cercarlo**.

---

## Il Collo di Bottiglia Semantico

Un utente chiede: *"Come gestisci l'autenticazione?"*

La query è breve, concettuale, in linguaggio naturale. Il suo embedding cattura concetti come "gestire", "autenticazione", "sicurezza". L'intento è forte e chiaro.

Nel vector store, però, abbiamo codice Java:

```java
@Override
public static void authenticate(String username, String password) {
    if (username == null || password == null) {
        throw new IllegalArgumentException("Credentials required");
    }
    // ... implementation
}
```

L'embedding di questo codice cattura: `@Override`, `public`, `static`, `void`, `String`, parentesi, punto e virgola. **Rumore sintattico** che diluisce il significato semantico.

Il risultato? Se cerco sul vector store ottengo risultati con relevance score bloccato a 0.45. L'LLM non trova contesto utile e risponde "Non trovato nella codebase".

**Questo problema non esiste con i documenti.** Un articolo che parla di autenticazione *usa la parola "autenticazione" o simili*. La corrispondenza è naturale.

---

## Documenti: Ingestion Lineare

Per i documenti tradizionali, la pipeline è relativamente semplice:

```text
Documento PDF/Markdown
    ↓
Parsing (estrazione testo)
    ↓
Chunking (divisione in paragrafi/sezioni)
    ↓
Embedding (vettorizzazione diretta)
    ↓
Vector Store
```

Il chunking può essere un paragrafo, un header, usi gli a capo, token-based: ogni 500-800 token, crea un chunk. Funziona perché i documenti sono scritti per essere letti sequenzialmente. Il contesto rimane comprensibile.

L'embedding è diretto: il testo del chunk **è** il testo da vettorizzare. Non serve trasformazione. ( Si può fare di meglio e lo so, perché ho messo le mani nel fango anche li 😉 )

---

## Codice: Ingestion Semantica

Per il codice sorgente, la pipeline deve essere radicalmente diversa:

```text
Source Code
    ↓
Language Detection
    ↓
AST Parsing (Tree-sitter)
    ↓
Semantic Chunking (funzioni, classi, metodi, import)
    ↓
Dual Embedding (content + embeddingText)
    ↓
Vector Store
```

### Perché AST Parsing?

Il chunking token-based fallisce miseramente sul codice. Se tagli una funzione a metà, ottieni due chunk inutili: uno con la firma senza il corpo, uno con il corpo senza contesto.

Ora: quanti hanno provato a generare unit test su una code base in automatico?
Ecco il nostro eroe: **L'AST (Abstract Syntax Tree)** permette di identificare **unità semantiche**: funzioni complete, classi intere, blocchi di import. Ogni chunk rappresenta un concetto coerente.

Per il parsing multi-linguaggio uso [Tree-sitter](https://tree-sitter.github.io/tree-sitter/), un parser generator incredibilmente veloce e robusto, usato da GitHub, Neovim e molti altri. Supporta 40+ linguaggi con la stessa API unificata.

### Perché Dual Embedding?

Qui sta la vera innovazione. Manteniamo **due rappresentazioni** per ogni chunk:

1. **content**: Il codice raw, esattamente come scritto. l'AS-IS che serve per mostrare all'utente il risultato della ricerca.

2. **embeddingText**: Una rappresentazione semantica pulita, ottimizzata per la vettorizzazione.

Per la funzione Java di prima, l'embeddingText diventa:

```text
File: src/auth/AuthService.java
Type: function
Name: authenticate
Signature: void authenticate(String username, String password)
Async: false
Exported: true
Docstring: Validates user credentials
```

**Niente parentesi graffe.** Niente punto e virgola. Niente `@Override`. Solo informazione semantica pura.

Questo embeddingText è molto più vicino alla query dell'utente ("Come gestisci l'autenticazione?") nello spazio vettoriale.

---

## L'Approccio Agile: Pragmatico Prima, Best Poi

Poteva bastare così poco: identificato il problema ho preparato un'analisi di mitigation e improve, avevo due strade.

### Il Piano Ambizioso

- **Summary Indexing**: Utilizzo un LLM che genera un summary business-level per ogni chunk
- **HyDE**: Applico l'Hypothetical Document Embeddings per migliorare le query
- **Context Expanders**: Recupero automatico di tipi e metodi correlati
- **Embedding Model Upgrade**: Passo a modelli di embedding code-optimized

Impatto atteso: +30-50% relevance quality.
Costo: Alto (LLM durante indexing), complessità elevata.

### Il Piano Pragmatico

- **containerName in metadata**: Prerequisito per context expansion
- **Context Expanders**: Recupero automatico del contesto correlato
- **Dual Embedding Lite**: Separazione content/embeddingText con euristiche

Impatto atteso: +20-35% relevance quality.
Costo: Zero LLM, bassa complessità, basso rischio.

**Ho scelto l'approccio pragmatico.**

L'approccio pragmatico non è perfetto ma rappresenta l'80% dei benefici con il 20% dell'effort. È Agile nella sua essenza: **iterare velocemente, validare, migliorare**. In questo momento mi interessa validare l'architettura esagonale che sto implementando e il progetto scala, eccome se lo fa.

---

## Context Expanders: Il Contesto che Mancava

Una delle feature implementate nel piano pragmatico è il **Context Expander**.

Quando recuperi un chunk che contiene `User findUserById(String id)`, spesso manca contesto critico:

- Cos'è `User`? Quali campi ha?
- Quali altri metodi esistono nella stessa classe?
- Da dove viene importato `UserNotFoundException`?

Il Context Expander aggiunge automaticamente questo contesto, arricchisce il risultato di ricerca:

```typescript
async expand(chunks: RetrievedChunk[]): Promise<ExpandedContext> {
  // 1. Estrai tipi referenziati (User, UserNotFoundException)
  const types = this.extractReferencedTypes(chunks);

  // 2. Recupera definizioni dei tipi
  const typeDefinitions = await this.fetchTypeDefinitions(types);

  // 3. Recupera metodi fratelli (stessa classe)
  const siblings = await this.fetchSiblingMethods(chunks);

  return { original: chunks, types: typeDefinitions, siblings };
}
```

**Costo**: 2-3 query extra a ChromaDB, circa 15ms.
**Beneficio**: Contesto 3x più ricco per l'LLM.

---

## Summary Enrichment: Il Livello Successivo

Validato l'approccio pragmatico, ho implementato anche il **Summary Enrichment** come opzione avanzata. È il "piano best" che io, Claude e Gemini avevamo messo in roadmap, ora disponibile per chi ha bisogno di qualità massima.

L'idea è semplice: invece di costruire l'embeddingText con euristiche, chiediamo a un LLM di **analizzare il codice** e generare un summary semantico.

Per ogni chunk, l'LLM produce:

```typescript
interface CodeSummary {
  summary: string;      // "Validates user credentials and returns JWT token"
  signature: string;    // "login(user: UserDTO): Promise<AuthResult>"
  questions: string[];  // ["How do I authenticate?", "Where is login endpoint?"]
  dependencies: string[]; // ["userRepository", "jwtService"]
  intent: 'query' | 'mutation' | 'validation' | 'utility';
}
```

Il campo `questions` è particolarmente potente: contiene le **domande tipiche** che un utente potrebbe fare su quel codice. Quando l'utente chiede "Come faccio l'autenticazione?", il match con "How do I authenticate?" è quasi perfetto.

### Trade-off Esplicito

  Ogni indexing ora genererà automaticamente:

- summary: descrizione business-level (2-3 frasi)
- questions: 3-5 domande che il codice risponde
- intent: classificazione (query|mutation|validation|utility|configuration)
- dependencies: servizi esterni utilizzati
  
  Nota: Questo aumenta il tempo di indexing (~0.5s per chunk) ma migliora la qualità del retrieval del +30-50%.

### Graceful Degradation

Il sistema è progettato per **non perdere dati** se l'LLM fallisce:

```typescript
// Se l'enrichment fallisce per un chunk
.catch((error) => {
  console.warn(`Failed to enrich chunk ${chunk.id}`);
  return this.createFallbackChunk(chunk);  // Usa Dual Embedding Lite
})
```

Se l'LLM non risponde o restituisce output invalido (si perché l'output dell'IA va sempre validato), il chunk viene indicizzato comunque usando l'embeddingText euristico. Nessun dato perso, solo qualità leggermente inferiore per quel chunk specifico.

### Quando Usarlo

Il Summary Enrichment è **opzionale** e si attiva con un flag:

```typescript
await agent.execute({
  path: '/path/to/codebase',
  options: {
    enableSummaryIndexing: true,  // Attiva enrichment LLM
  }
});
```

**Consigliato per**: codebase dove la qualità di retrieval è critica.
**Sconsigliato per**: test o utilizzo di LLM remoti dove il costo sarebbe proibitivo.

Questo è l'approccio Agile in azione: prima rilasci la soluzione pragmatica che funziona per tutti, poi aggiungi l'opzione avanzata per chi ne ha bisogno.

---

## Risultati

Con l'approccio incrementale abbiamo ottenuto:

```text
| Metrica                | Baseline | Dual Lite | Con Summary |
|------------------------|----------|-----------|-------------|
| Relevance Score medio  | 0.45     | 0.75+     | 0.85+       |
| Tempo indexing/file    | 85ms     | 95ms      | ~500ms      |
| Tempo query RAG        | <100ms   | <115ms    | <115ms      |
```

Il sistema funziona e continua a migliorare.

**Nella roadmap** rimangono ottimizzazioni future:

- HyDE per query expansion (riformulazione automatica delle domande)
- Modelli di embedding code-optimized (voyage-code-2)
- Fine-tuning per domini specifici

Ma il pattern è chiaro: **ship, measure, improve**. Non aspettare la perfezione per rilasciare. Rilascia qualcosa che funziona, misura, migliora iterativamente.

---

## Lezioni Apprese

### 1. Codice ≠ Documenti

L'ingestion del codice richiede parsing semantico (AST), non semplice tokenizzazione. Le unità di chunking devono essere funzioni e classi, non paragrafi arbitrari.

### 2. Dual Representation

Mantenere separati il contenuto raw (per l'utente, la nostra Single Source of Truth) e il testo semantico (per l'embedding) risolve il collo di bottiglia semantico senza costi aggiuntivi.

### 3. Pragmatico > Perfetto

80% effort in meno per 85% dei benefici è un trade-off eccellente. La soluzione perfetta che non rilasci mai non aiuta nessuno, non ti consente di proseguire il lavoro.

### 4. Metadata Abilita Features

L'aggiunta di `containerName` ai metadata (30 minuti di lavoro) ha sbloccato tutto il sistema di Context Expanders. I metadata giusti sono investimenti che pagano enormemente, non trascurare mai il Domain Driven Design.

### 5. Iterazione > Pianificazione

Avrei potuto pianificare per settimane. Invece ho implementato in 6 ore, misurato, e ora so esattamente cosa migliorare.

---

## Conclusione

Oscar Wilde diceva che l'esperienza è il nome che diamo ai nostri errori. In questo progetto, l'errore è stato pensare che codice e documenti fossero la stessa cosa. L'esperienza è stata scoprire che non lo sono affatto.

L'ingestion del codice sorgente aveva un problema specifico: il rumore sintattico diluiva la semantica. La soluzione specifica: Dual Embedding con testo pulito.

Non ho costruito il sistema RAG perfetto. Ho costruito un sistema RAG che **funziona** e che ha spazio per migliorare. E siccome scrivo i post ex-post, è già migliorato, iterazione dopo iterazione.

Perché questo è Agile: non la ricerca della perfezione, ma il **progresso continuo** verso di essa.

---

## Serie "CodeIntel System: Dal Concetto al Codice"

- Post 1: [La Visione del Progetto](/Journey/posts/01-la-visione-del-progetto/)
- Post 2: [SDLC e Metodologia Agile](/Journey/posts/02-sdlc-e-metodologia-agile/)
- Post 3: [Analisi, Progettazione e Architettura](/Journey/posts/03-analisi-progettazione-architettura/)
- Post 4: [L'IA come Co-Sviluppatore](/Journey/posts/04-ia-come-co-sviluppatore/)
- Post 5: [AST, Tree-sitter e Parsing del Codice](/Journey/posts/05-ast-treesitter-parsing/)
- Post 6: [CI/CD e Quality Gates](/Journey/posts/06-cicd-quality-gates/)
- Post 7: [Agent Framework e Orchestrazione](/Journey/posts/07-agent-framework-orchestration/)
- Post 8: [Documentazione come Filosofia](/Journey/posts/08-documentazione-come-filosofia/)
- Post 9: [Imparare dai Giganti: Analogie Interdisciplinari](/Journey/posts/09-analogie-interdisciplinari/)
- Post 10: [Lo Stack dell'Intelligenza Artificiale Applicata](/Journey/posts/10-stack-intelligenza-artificiale/)
- **Post 11**: L'Evoluzione della Qualità RAG ← *Sei qui*

---
layout: layouts/post.njk
tags: [post, serie-codeintel]
title: "AST, Tree-sitter e l'Arte di Comprendere il Codice"
subtitle: "Come Tree-sitter abilita l'analisi semantica del codice"
date: 2025-12-28
quote: "La semplicità è la suprema sofisticazione"
quoteAuthor: "Leonardo da Vinci"
---

## Il Codice come Struttura, Non come Testo

Per l'occhio inesperto, il codice è una sequenza di caratteri. Testo. Stringhe. Regex. Per chi sviluppa strumenti di analisi del codice, questa visione è tragicamente limitata.

Considera questa funzione:

```typescript
function calculateDiscount(price: number, customer: Customer): number {
  if (customer.isPremium) {
    return price * 0.8;
  }
  return price;
}
```

Come testo è una sequenza di 132 caratteri. Come **Abstract Syntax Tree** è una struttura: una `FunctionDeclaration` con due `Parameter` tipati, un `IfStatement` con condizione e due rami, due `ReturnStatement`. Non è solo parsing: è *struttura del significato*.

Con il testo puoi cercare la stringa "calculateDiscount". Con l'AST puoi estrarre tutti i parametri con i loro tipi, identificare tutte le condizioni, calcolare la complessità ciclomatica, rilevare code smell, generare documentazione, refactoring sicuro.

AST non è solo parsing. È comprensione semantica.

## Perché Non Regex

Una funzione di estrazione naïve potrebbe usare `function\s+(\w+)\s*\(([^)]*)\)`. Funziona per i casi semplici. Cade su arrow function, async, generator, funzioni nested, type annotations, decoratori.

Regex è il tool sbagliato per parsing del codice. Va usato per ricerche testuali; l'analisi strutturale richiede un parser vero.

## Tree-sitter come Parser Universale

Tree-sitter è un parser generator creato da GitHub, usato in Atom, Neovim, GitHub stesso. Caratteristiche chiave:

- **Multi-language**: 40+ linguaggi con la stessa API.
- **Incremental**: re-parse solo le parti modificate. Critico per editor live e per re-indexing su grandi codebase.
- **Error-tolerant**: parse anche codice con errori sintattici. Costruisce nodi `ERROR` per le parti invalide ma non si ferma. Posso analizzare codice work-in-progress o file con typo temporanei.
- **Query language**: pattern matching dichiarativo per estrarre nodi specifici.

In CodeIntel inizializzo un parser per ogni linguaggio supportato e li tengo in una mappa. Ogni file passa attraverso il parser corrispondente, che restituisce un albero su cui posso applicare query e visitor.

## Language Detection Multi-Strategy

Prima del parsing, devo identificare il linguaggio. Uso tre strategie in ordine di priorità:

1. **Shebang** (per script Unix). Precisione altissima quando presente.
2. **Estensione del file**. ~95% precisione per estensioni standard. Cade su `.h` (C o C++?) e file senza estensione.
3. **Content analysis**. Pattern caratteristici (`def` per Python, `package` per Java, `interface` per TypeScript). Fallback quando le altre strategie non bastano.

La combinazione delle tre copre praticamente ogni caso reale.

## Semantic Chunking

Il problema chiave in RAG è: come dividi il codice in chunk?

L'approccio naïve è fixed-size: ogni 500 token, taglia. Sul codice fallisce miseramente. Spezza una funzione a metà e ottieni due chunk inutili: la firma senza il corpo, il corpo senza contesto.

L'approccio AST-based ragiona per **unità semantiche**. La gerarchia di priorità è:

1. **Funzione**: prima scelta. Una funzione è un'unità di significato compiuta.
2. **Classe**: se non ci sono funzioni stand-alone significative.
3. **Blocco di import**: il "vocabolario" del file.
4. **File intero**: solo come fallback per file piccoli.

Se una funzione è troppo grande per un singolo chunk, la divido per statement preservando la firma. Mai un chunk senza contesto.

Risultato: chunk semanticamente coerenti, embedding più precisi, retrieval più rilevante.

## Estrarre Metadata dalle Funzioni

Una volta parsato, posso estrarre per ogni funzione: nome, modificatori (export, async), parametri (con tipo e opzionalità), tipo di ritorno, commento leading, complessità ciclomatica, righe di codice.

Questi metadata abilitano funzionalità che con la sola ricerca testuale sarebbero impossibili: documentazione JSDoc generata automaticamente, dependency graph reali, refactoring suggestion basate su metriche.

## Performance e Multi-Linguaggio

Tree-sitter è 3-4 volte più veloce dei parser tradizionali su parsing completo, e con il re-parse incrementale diventa ordini di grandezza più veloce su modifiche puntuali. Questo è ciò che lo rende viable per codebase grandi e per analisi continua.

Il sistema mantiene un'interfaccia unificata: `ParsedFunction` con nome, parametri, tipo di ritorno, body. Gli estrattori specifici per linguaggio sono isolati dietro questa interfaccia. Aggiungere un nuovo linguaggio significa aggiungere un grammar e un estrattore, senza toccare il resto.

## Conclusione: Vedere Oltre la Superficie

Leonardo cercava la semplicità oltre la complessità apparente. Gli AST fanno questo: riducono il codice — apparentemente complesso — alla sua struttura essenziale.

Con Tree-sitter non sto solo tokenizzando caratteri. Sto comprendendo significato. Sto estraendo cosa fa il codice (funzioni, classi), come lo fa (controllo di flusso, chiamate), perché è strutturato così (pattern architetturali).

Questa comprensione semantica è il fondamento di CodeIntel. Senza AST, non potrei fare semantic chunking intelligente, generare documentazione accurata, rilevare smell architetturali, calcolare metriche.

Nel prossimo post: CI/CD, pre-commit hook, e quality gate automatizzate.

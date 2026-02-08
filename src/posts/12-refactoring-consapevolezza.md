---
layout: layouts/post.njk
tags: [post]
title: "Non Puoi Delegare Ciò Che Non Sai Fare"
subtitle: "Riflessioni su refactoring, modernizzazione e il ruolo dell'umano nell'era dell'IA"
date: 2025-02-08
quote: "So di non sapere"
quoteAuthor: "Socrate, cit."
---

## Una Settimana tra COBOL e TypeScript

Questa settimana ho lavorato su due fronti paralleli. Da un lato, il refactoring di diversi progetti COBOL da riscrivere in Java. Dall'altro, la riscrittura completa di un backend web da PHP a TypeScript, mantenendo la retrocompatibilità ma rinnovando architettura e API.

Due mondi apparentemente lontani. Eppure, la stessa domanda mi ronzava in testa.

**Esiste un thinking flow ideale per questo genere di attività?**

Non porting. Refactoring. La distinzione è fondamentale. Il porting è traduzione meccanica. Il refactoring è ripensamento. È usare il vecchio codice come specifica eseguibile della business logic, mentre il design nuovo è guidato da obiettivi di manutenibilità, pattern moderni, architettura pulita.

E in tutto questo, l'IA. Copilot in primis, Claude Code dove consentito, ma anche NotebookLM per la ricerca, Perplexity per le deep dive tecniche.

## L'Insight della Settimana

C'è una cosa che mi sono reso conto, lavorando fianco a fianco con questi strumenti.

**Non puoi delegare all'IA qualcosa che non sai fare o di cui non sei consapevole.**

Sembra ovvio, detto così. Ma non lo è. C'è una tentazione sottile, quando hai un LLM potente a disposizione, di pensare che possa colmare le tue lacune. "Non conosco bene questo pattern, ma l'IA lo saprà." "Non ho capito esattamente il requisito, ma l'IA capirà."

No. Non funziona così.

L'IA amplifica. Non sostituisce. Amplifica la tua comprensione, la tua capacità di analisi, la tua velocità di esecuzione. Ma se la comprensione di base manca, l'amplificazione è rumore, non segnale.

## Chiarire Prima di Toccare

La prima lezione che ho consolidato questa settimana: **prima di toccare una riga di codice, formalizzare esplicitamente cosa deve rimanere invariato e cosa deve cambiare**.

Invarianti:
- Il comportamento osservabile (use case, scenari, contratti API, SLA)
- I flussi critici (billing, contabilizzazioni, calcoli)

Varianti:
- L'architettura interna
- Lo stile (OO, functional, ibrido)
- La gestione degli errori
- Il logging, la sicurezza, le performance

Per il refactoring COBOL → Java, questo significa: il COBOL è la specifica. Il Java è il design nuovo. Non devo tradurre sintassi, devo catturare semantica e reimplementarla con principi moderni (DDD, layering, separation of concerns).

L'IA mi aiuta a leggere il COBOL, a inferire regole di business nascoste in migliaia di righe di procedure division. Ma il giudizio su cosa sia essenziale e cosa sia accidentale? Quello resta mio.

## La Safety Net Prima del Salto

Un'altra consapevolezza che si è consolidata: **non c'è refactoring serio senza safety net**.

I passi che ho seguito:
1. Identificare i flussi critici
2. Costruire test di caratterizzazione: stessi input, stessi output
3. Congelare i contratti esterni (API, formati file, schema DB)
4. Aggiungere logging sul sistema legacy per raccogliere casi reali

E qui l'IA cambia ruolo. Non più "scrivimi il codice", ma:
- "Aiutami a generare casi di test"
- "Inferisci invarianti da questi log"
- "Proponi test di regressione per questo scenario"

È un uso diverso. Più umile. Più efficace.

## Small Steps, Atomic Commits

Il pattern che ho seguito per l'implementazione:

1. **Piccoli passi**: un refactor concettualmente omogeneo alla volta
2. **Prima osservabile, poi interno**: rendere il codice testabile, poi migliorare la struttura
3. **Attaccare i code smell evidenti**: metodi enormi, conditionals annidati, duplicazioni, magic numbers

Per il backend PHP → TypeScript, ho applicato lo [Strangler Fig pattern](https://martinfowler.com/bliki/StranglerFigApplication.html) di Martin Fowler: mantengo le API legacy, introduco nuovi moduli strutturati, sposto gradualmente il comportamento. I test garantiscono che il vecchio contratto resti soddisfatto mentre il nuovo cresce.

L'IA propone trasformazioni. Un secondo passaggio (io stesso scrivendo codice, a volte con prompt strutturati, altre volte un altro agent) valuta rispetto a criteri espliciti: equivalenza funzionale, aderenza a convenzioni, chiarezza dei nomi, accoppiamento.

Cicli di correzione fino a superare una soglia di qualità. Iterative refinement.

## Il Ruolo dell'IA nel Refactoring

Ho trovato un equilibrio che funziona per me:

**Delegare all'IA**:
- Lavori meccanici (rinominare, spezzare funzioni, aggiungere log)
- Generazione di test parametrizzati
- Proposta di trasformazioni locali
- Analisi di dipendenze e diagrammi

**Tenere per me**:
- Decisioni fondamentali di design
- Valutazione di trade-off architetturali
- Giudizio su cosa sia essenziale vs accidentale
- La responsabilità finale

L'IA è un co-reviewer eccezionale. Un code transformer instancabile. Ma il giudizio resta umano. Deve restare umano.

## Il Thinking Flow che Emerge

Dopo questa settimana, ho abbozzato un flow che userò come riferimento anche se probabilmente non sarà definitivo:

1. **Allineare**: obiettivi e invarianti (comportamento, contratti)
2. **Costruire**: safety net di test e snapshot su casi reali
3. **Mappare**: dominio e architettura attuale → futura
4. **Refactoring incrementale**: piccoli passi, AI per suggerire trasformazioni
5. **Introdurre gradualmente**: il nuovo design (DDD, layering, moderni pattern)
6. **Stabilizzare**: performance, manutenzione, documentazione

Non è scienza. È pratica codificata. È esperienza che diventa metodo.

## La Riflessione di Fondo

Socrate diceva "so di non sapere". In questa settimana di refactoring intensivo, ho capito cosa significa.

Sapere di non sapere COBOL abbastanza bene per tradurlo meccanicamente? Mi ha spinto a usare l'IA per analisi, non per traduzione.

Sapere di non sapere tutti i casi d'uso del sistema legacy? Mi ha spinto a costruire test di caratterizzazione prima di toccare qualsiasi cosa.

Sapere di non sapere se il mio nuovo design è corretto? Mi ha spinto a procedere per piccoli passi, validando continuamente.

**La consapevolezza dei propri limiti non è debolezza. È la precondizione per usare bene gli strumenti che amplificano le nostre capacità.**

L'IA non mi rende onnisciente. Mi rende più veloce nel percorso dalla mia ignoranza attuale alla conoscenza che mi serve. Ma il percorso devo comunque farlo io.

## Conclusione: L'Umano nel Loop

Questa retrospettiva è per me stesso, tra me e me. Un promemoria per le prossime settimane di refactoring.

Non puoi delegare ciò che non sai fare. Ma puoi usare l'IA per imparare più velocemente, per validare le tue ipotesi, per amplificare la tua capacità di analisi.

Il refactoring non è traduzione. È comprensione profonda seguita da ri-creazione consapevole.

E la consapevolezza? Quella non si delega. Si costruisce. Un commit alla volta.

---

**Serie "CodeIntel System: Dal Concetto al Codice"**
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
- Post 11: [L'Evoluzione della Qualità RAG](/Journey/posts/11-rag-quality-evolution/)
- **Post 12**: Non Puoi Delegare Ciò Che Non Sai Fare ← *Sei qui*

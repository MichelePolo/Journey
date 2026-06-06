---
layout: layouts/post.njk
tags: [post, serie-codeintel]
title: "CI/CD, Pre-Commit Hooks e Quality Gates: La Guardia della Qualità"
subtitle: "Automazione, testing e qualità continua"
date: 2026-01-11
quote: "La qualità non è mai un caso; è sempre il risultato di uno sforzo intelligente"
quoteAuthor: "John Ruskin"
---

## Qualità come Processo, Non come Incidente

John Ruskin, teorico dell'arte vittoriana, comprendeva una verità universale: la qualità non emerge spontaneamente. Richiede intenzione, disciplina, sforzo sistematico.

Nel software, questa verità è amplificata. Un codebase può degradarsi velocemente: un test skippato "temporaneamente", un warning "da fixare dopo", un commit "tanto è solo una piccola modifica", un merge "funziona sulla mia macchina". E improvvisamente sei in produzione con bug che passavano inosservati, copertura al 40%, build che si rompono ogni settimana.

Il problema non è la mancanza di conoscenza. È la mancanza di **enforcement**.

Tutti sanno che i test sono importanti. Quanti progetti hanno davvero 80% di coverage *e lo mantengono nel tempo*? Tutti sanno che il linting è utile. Quanti hanno davvero zero warning ESLint in produzione?

La risposta è: pochissimi. Perché la qualità manuale decade. Sempre. La soluzione: automatizzarla.

## Layer 1: Pre-Commit Hooks

Obiettivo: bloccare commit invalidi *prima* che raggiungano il repository.

Implementazione: Husky + lint-staged. Il workflow è semplice — ogni commit innesca lint, format e type check sui soli file modificati. Se uno qualsiasi fallisce, il commit è bloccato.

I controlli che applico:

- **ESLint**: niente `any` impliciti, niente variabili inutilizzate, complessità ciclomatica massima per funzione.
- **Prettier**: stile uniforme, zero discussioni sul formato.
- **TypeScript** in modalità strict: nessun null/undefined non gestito, nessun type implicito.

Il valore: feedback in meno di cinque secondi, tutto il codice formattato in modo identico, zero discussioni di stile in code review, zero TypeScript error che arrivano in CI.

I pre-commit hook *possono* essere bypassati con `--no-verify`. Per questo non sono il livello finale di difesa: sono il primo.

## Layer 2: CI/CD Pipeline

GitHub Actions è la safety net. Ogni push esegue:

1. **Type checking** completo (non solo sui file modificati).
2. **Lint** su tutto il codebase.
3. **Test suite** con coverage threshold. Se la copertura scende sotto la soglia, il merge è bloccato.
4. **Build**. Cattura errori di compilazione, dipendenze mancanti, import sbagliati.

Per i test di integrazione servono ChromaDB e Ollama in esecuzione. Le service container di GitHub Actions risolvono il problema: ogni run parte con container freschi, isolati, ricostruiti.

La pipeline gira su Node 18, 20 e 22 in matrice. Tre volte il tempo di CI, ma garanzia di compatibilità cross-version.

## Caso di Studio: 8 Iterazioni per un CI

Setup di un'integrazione CI con ChromaDB + Ollama: stimato 4 ore, costato 8.

Le otto iterazioni sono passate per: port mapping sbagliato (8001:8000 invece di 8000:8000), API endpoint deprecata (v1 invece di v2), timeout di health check troppo breve, endpoint di health check sbagliato, autenticazione mancante lato server, autenticazione mancante lato client, incompatibilità tra ChromaDB 0.4.22 e NumPy 2.0.

L'ottava iterazione — quella che ha funzionato — è arrivata da intervento umano: l'IA proponeva fix ragionevoli, ma il pattern complessivo (autenticazione end-to-end mancante) richiedeva un occhio che vedesse il problema dall'alto.

Lezione tecnica: port mapping diretto è sempre meglio del remap, le auth vanno testate end-to-end localmente prima del CI, dependencies più recenti evitano incompatibilità.

Lezione di processo: ho documentato ogni iterazione con commit hash, problema, fix tentato, risultato. Quando in seguito ho dovuto configurare un'altra integrazione simile, zero problemi: ho riusato la knowledge base.

## Layer 3: Branch Protection

A monte di tutto, le regole GitHub:

- `main` non riceve push diretti, solo merge da PR.
- I check di CI sono required: niente merge se rosso.
- Niente force push.
- Linear history.

Sono regole banali, ma se non sono enforced il team prima o poi le aggira. Configurarle una volta costa cinque minuti e protegge il repository per sempre.

## L'Effetto Composto

Pre-commit hook + CI + branch protection sono livelli di una stessa difesa. Il pre-commit dà feedback istantaneo, il CI cattura quello che il pre-commit non vede (o che è stato bypassato), il branch protection enforce il risultato.

Ognuno preso da solo lascia falle. Insieme costruiscono una **cultura**.

Quando ogni commit passa attraverso questi tre layer, smette di essere "dovrei scrivere test" e diventa "non posso committare senza test". Smette di essere "dovrei fixare questi warning" e diventa "i warning bloccano il merge". La qualità diventa la via di minor resistenza.

## Conclusione: Qualità come Cultura

Quality gate non sono solo strumenti tecnici. Sono cultura.

L'investimento in automazione ripaga subito: meno tempo a debuggare regressioni, meno discussioni di stile, meno bug in produzione. E intangibili reali: serenità, fiducia nel refactoring, onboarding immediato per chi arriva.

Ruskin aveva ragione: la qualità è il risultato di sforzo intelligente. Nel software, lo sforzo migliore è quello che si automatizza.

Nel prossimo post: l'Agent Framework, il pattern architetturale per orchestrare agenti specializzati.

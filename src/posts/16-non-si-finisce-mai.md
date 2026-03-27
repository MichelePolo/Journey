---
layout: layouts/post.njk
tags: [post]
title: "Si vola più lontano per il gusto di volare"
subtitle: "Ho scoperto di saper volare e sono volato sul divano"
date: 2026-03-27
quote: "Il gioco è la forma più alta di ricerca."
quoteAuthor: "Albert Einstein"
---

## Tutto d'un Tratto, Sapevo Volare

Immagina di scoprire all'improvviso di saper volare.

Non piano piano, non con allenamento. Dal niente: puoi volare. Cosa fai?

La risposta onesta, almeno la mia, è: voli dappertutto. Voli sul divano, voli per raggiungere il frigo. Sprechi il superpotere per cose che avresti fatto uguale a piedi, solo con più stile.

Così è stato con l'IA.

A maggio 2025 ho iniziato a utilizzare l'autocompletamento di Copilot e Gemini su Visual Studio Code, poi Claude Code per scrivermi i metodi e le funzioni Javascript, poi iniziavano a bastare i prompt, poi le skills, poi gli agenti specializzati. Ho scoperto tutto d'un tratto di poter fare in un'ora il lavoro di una giornata. Il primo riflesso è stato "come uso questo potere in modo intelligente? Usiamolo per *tutto*". Portali web per il condominio, dashboard per il trading, script, configurazioni. Anche le commit. Soprattutto le commit. Mille idee, mille esperimenti avviati in parallelo, finiti più o meno bene.

Continuavo a volare sul divano.

## Il Problema di Chi Sa Volare Senza Capire Come

Il guaio del volo improvviso è che non sai perché funziona. E quando smette di funzionare — o funziona male — non hai nessuno strumento per capire cosa stia succedendo.

L'IA che allucinava sicura. L'IA che riscriveva tutto invece di correggere un dettaglio. L'IA che produceva codice che sembrava giusto e non lo era. Ogni volta la reazione era "strano, non capisco perché è successo".

Finché non ho deciso di fare una cosa che avrei dovuto fare dall'inizio: capire davvero cosa avevo tra le mani.

## Passo Uno: Demistificare l'IA

Il primo passo vero non è stato usare meglio l'IA. È stato smettere di trattarla come magia ma ci sono voluti davvero tanto insight e tanto studio.

Un LLM non pensa. Non capisce. Non ragiona. Genera il prossimo token più probabile dato il contesto — miliardi di volte, molto velocemente, con pesi calibrati su quantità di testo che nessun essere umano potrebbe leggere in cento vite. Il risultato *assomiglia* a comprensione. A vedere dentro com'è fatta la scatola gli si toglie un pò di magia ma non è per questo meno affascinante, poi leggi libri, articoli, ci parli e di nuovo pensi sia una forma di intelligenza, solo che è diversa dalla nostra e ancora molto incompresa. Provi di nuovo empatia per la macchina.

Capire questo cambia tutto. Smetti di fidarti del tono sicuro come segnale di correttezza. Smetti di aspettarti che "ricordi" tra sessioni. Capisci perché certi prompt funzionano e altri no. Capisci perché con più contesto le risposte migliorano — non per magia, ma perché hai dato più token.

La demistificazione non riduce lo strumento. Lo rende usabile sul serio.

## Passo Due: Imparare a Pilotare

Capito cos'è, il passo successivo è capire come si pilota.

Nel caso di Claude — ma il discorso vale per qualsiasi LLM avanzato — c'è un ecosistema di strumenti che la maggior parte delle persone non esplora mai: hooks, commands, skills, MCP, agents, `CLAUDE.md`. Ognuno risolve un problema specifico. Ognuno cambia il modo in cui interagisci con il modello.

Non è roba da nerd. È la differenza tra guidare una macchina conoscendo solo l'acceleratore e guidarla conoscendo anche freni, marce, e sterzo. La velocità massima è la stessa — ma dove arrivi, no.

## Passo Tre: Sbagliare con Metodo

Poi viene la parte più importante: provarci, sbagliare, capire perché, finalmente riuscire e ottenere la soddisfazione in premio.

Non c'è scorciatoia. Si impara cosa funziona meglio solo dopo aver visto cosa funziona peggio. Un contesto mal costruito. Un agent che fa troppo da solo. Un hook che si attiva quando non dovrebbe. Un `CLAUDE.md` che dà istruzioni contraddittorie. Non siamo reti neurali e non ci basta leggere per capire.

Ogni errore è più informativo di dieci tutorial che spiegano come fare tutto giusto.

## Gli Esperimenti

Da qui in poi per me è diventato finalmente un gioco. Un gioco vero, con la curiosità che traina e il divertimento che mi tiene sveglio fino a tardi la notte. Non dormo da mesi.

Una lista, senza troppi dettagli, perché i dettagli qui contano meno della traiettoria:

- Portali web per il condominio e dashboard, i primi voli goffi
- Uno studio sul machine learning per leggere il contesto
- Una libreria TypeScript per visualizzare grafici
- Un sistema per capire e gestire il codice sorgente tramite IA
- Pipeline di ingestion e RAG, con una trentina di strategie diverse provate e confrontate
- Studio di semantica e sintassi del codice come oggetto linguistico, per fare più velocemente code coverage
- Studio degli LLM dall'interno — come funzionano davvero
- Un SDLC ripensato con l'IA dentro al loop
- LLM installati sul cellulare, sul Mac, sui server a consumo di Vast.ai

Ogni voce di questa lista ha aperto almeno 10 nuove strade da esplorare. È questo l'effetto più strano e più bello: non arrivi a una risposta, arrivi a domande migliori. E le domande migliori generano un effetto wow che non si consuma, anzi cresce.

## Usare l'IA Come Feature, o Come Prodotto

Ora lo scenario cambia.

Non è più "come uso l'IA per scrivere software più velocemente". Diventa: come metto l'IA *dentro* il software? Può essere la feature centrale di un prodotto? Può essere il prodotto stesso?

È uno shift mentale che apre un territorio completamente diverso. Non stai più accelerando il tuo lavoro — stai costruendo sistemi che non sarebbero esistiti prima. Sistemi che imparano, che si adattano, che migliorano con l'uso.

Questo è il territorio dove si vola davvero alto. E dove non basta saper volare — bisogna sapere dove si vuole andare.

## Oggi, il Reinforcement Learning

L'ultimo esperimento finora è il più strano e il più personale.

Reinforcement learning su modelli open source. I modelli Qwen 3.5 sono quelli che al momento mi stanno dando più soddisfazione, distillati per girare su hardware consumer, che girano anche su un telefono, e con buone prestazioni. Training locale, iterazioni veloci, controllo completo del processo.
In pratica è la logica dell'addestramento: Se indovina lo premi, se sbaglia lo sgridi.
E' lo stesso meccanismo che ho descritto per me stesso poche righe fa. Quindi l'LLM rinforza l'apprendimento proprio come facciamo noi.

Non è roba da laboratorio di ricerca. È roba che funziona sul dispositivo che ho in tasca.

Non sto costruendo per un cliente, non sto risolvendo un problema di business. Sto studiando. Stavo volando per vedere dove riuscivo ad arrivare.
Alla fine lo fai per te stesso, per gioco e per passione.

## Non Si Finisce Mai

Il percorso non ha una destinazione. Ha una direzione.

La direzione la scegli tu — non il mercato, non il framework più di moda, non il tutorial più condiviso su LinkedIn. La scegli tu ogni volta che ti chiedi *cosa succede se provo questo?*

Chi trova questo aspetto sfiancante probabilmente cerca la padronanza definitiva — il punto in cui si smette di imparare e di faticare. Temo vi schianterete perché non arriva mai.

Chi lo trova divertente invece ha già capito il gioco.

**Vola più lontano chi vola per il gusto di volare.**

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
- Post 12: [Non Puoi Delegare Ciò Che Non Sai Fare](/Journey/posts/12-refactoring-consapevolezza/)
- Post 13: [Non Mandare un Robot in Palestra](/Journey/posts/13-non-mandare-un-robot-in-palestra/)
- Post 14: [Il Dado Pesato](/Journey/posts/14-il-dado-pesato/)
- Post 15: [Una Serata in Coworking](/Journey/posts/15-una-serata-in-coworking/)
- **Post 16**: Non Si Finisce Mai ← *Sei qui*

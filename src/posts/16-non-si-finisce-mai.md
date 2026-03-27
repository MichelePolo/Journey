---
layout: layouts/post.njk
tags: [post]
title: "Non Si Finisce Mai"
subtitle: "Un percorso di studio che ha iniziato con un assistente di coding e non sa ancora dove finisce"
date: 2026-03-27
quote: "Il vero viaggio di scoperta non consiste nel cercare nuovi paesaggi, ma nell'avere nuovi occhi."
quoteAuthor: "Marcel Proust"
---

## Maggio dell'Anno Scorso

Tutto è iniziato con una cosa semplice: volevo scrivere codice più velocemente.

Maggio 2025. Un assistente di coding. Un editor, un prompt, qualcosa che rispondeva alle domande sul codice senza costringermi ad aprire Stack Overflow. Il primo impatto è stato quello di tutti: *funziona davvero*. Non perfettamente, non sempre, ma abbastanza da cambiare il ritmo.

Non sapevo ancora che quella porta portava a una stanza più grande. E che quella stanza portava a un corridoio. E che il corridoio non aveva fondo visibile.

Questo è il racconto di quel percorso — non come curriculum, ma come mappa. Una mappa di chi era convinto di stare imparando a usare uno strumento, e si è ritrovato a studiare il funzionamento della mente artificiale, il trading algoritmico, la linguistica computazionale, e l'architettura dei modelli neurali.

Non si finisce mai. Questa non è una lamentela.

## Livello Uno: L'Assistente

Il punto di ingresso è lo stesso per quasi tutti.

Portali web. Dashboard. Cose concrete, cose che si vedono. L'IA come acceleratore: descrivi il componente, ricevi il codice, adatti, iterei. Il ciclo di feedback è immediato, il guadagno di velocità è reale, la sensazione è quella di avere un collaboratore instancabile che non si stanca mai di spiegare e non si offende se gli chiedi di riscrivere tutto.

In questa fase si impara qualcosa di fondamentale senza accorgersene: **il modo in cui fai la domanda determina la qualità della risposta**. Il prompt è un'interfaccia. Chi sa usarla bene ottiene risultati diversi rispetto a chi la usa come se fosse un motore di ricerca.

Qui nasce il primo studio implicito: capire come comunicare con una macchina che parla come un umano ma ragiona in modo statistico.

## Livello Due: Il Sistema

Dopo i portali e le dashboard è arrivata l'infrastruttura di trading.

Non era più solo "genera questo componente". Era: costruisci un sistema che analizza il contesto di mercato, che usa il machine learning per interpretare segnali, che prende decisioni su basi statistiche. Un sistema con stati, con pipeline, con feedback loop.

Qui il salto è stato verticale.

Il machine learning non è un'API. Non è qualcosa che si installa e si configura. È una disciplina con le sue fondamenta matematiche, le sue metriche, i suoi trade-off. Feature engineering. Normalizzazione. Overfitting. Validazione out-of-sample. La differenza tra un modello che funziona sul backtest e uno che sopravvive al mercato reale è la stessa differenza tra un test che passa e un sistema che regge in produzione — moltiplicata per il fatto che qui l'errore ha un costo immediato e misurabile.

**L'IA come assistente di coding aveva aperto la porta al machine learning come disciplina di studio.**

## Livello Tre: La Semantica del Codice

Parallelamente al trading, è arrivata la libreria TypeScript per la visualizzazione dei grafici.

Sembra laterale. Non lo è.

Costruire una libreria — non un'applicazione, una libreria — richiede di pensare alle interfacce, alle astrazioni, ai contratti tra componenti. Richiede di chiedersi come il codice verrà *usato*, non solo come funziona. È un esercizio di design API che porta naturalmente a interrogarsi sulla struttura sintattica e semantica del codice stesso.

Da qui è partito lo studio dell'AST — Abstract Syntax Tree. Tree-sitter. Il parsing. La grammatica formale dei linguaggi di programmazione.

Il codice non è testo. È struttura. E quella struttura si può analizzare, manipolare, interrogare. Nasce così CodeIntel System: un sistema di comprensione e gestione del codice sorgente tramite IA. Non un linter, non un formatter — uno strumento che capisce *cosa fa* il codice, non solo *come è scritto*.

**Studiare il codice come oggetto linguistico apre una finestra sulla linguistica computazionale che non si chiude facilmente.**

## Livello Quattro: Il Recupero dell'Informazione

Un sistema di code intelligence ha bisogno di memoria. Non la memoria di sessione di un LLM — memoria persistente, strutturata, interrogabile.

Entra in gioco il RAG: Retrieval-Augmented Generation.

La prima implementazione è lineare: chunk il documento, calcola gli embedding, salva nel database vettoriale, recupera per similarità coseno, inietta nel contesto. Funziona. Poi si scopre che funziona male su certi tipi di query. Allora si affina: chunking semantico invece di chunking per dimensione fissa. Poi re-ranking. Poi query expansion. Poi strategie ibride che combinano ricerca vettoriale e BM25.

Una trentina di strategie diverse, nel tempo. Non per collezionarle — per capire quando ciascuna funziona meglio e perché. **Ogni strategia fallita insegna qualcosa che nessun tutorial spiega.**

Il RAG è diventato un laboratorio di information retrieval, di teoria dell'informazione, di compromessi tra precisione e recall. Un campo che esiste da prima che esistessero i transformer, e che ha trovato nuova vita nell'era dei LLM.

## Livello Cinque: Aprire il Cofano

A un certo punto non bastava più sapere *cosa* fa un LLM. Bisognava sapere *come*.

Aprire il cofano.

Tokenizzazione. Embedding. Self-attention. Layer transformer. Softmax. Temperatura. Il dado pesato — quella metafora che spiega meglio di qualsiasi altra cosa perché il modello può essere così sicuro quando sbaglia: non perché mente, ma perché non ha accesso al concetto di verità. Genera ciò che è statisticamente probabile, con la stessa fluidità indifferente a prescindere dalla correttezza.

Studiare l'architettura degli LLM ha cambiato il modo di usarli. Quando capisci che la chain-of-thought funziona perché introduce più token di contesto su cui basare i lanci successivi — non perché il modello "ragiona davvero" — smetti di trattare le risposte come output di un esperto e inizi a trattarle come output di un sistema probabilistico molto sofisticato che va guidato, verificato, calibrato.

**La comprensione meccanica è il miglior antidoto all'antropomorfizzazione.**

## Livello Sei: Lo SDLC Aumentato

Nel mezzo di tutto questo, lo studio del processo di sviluppo.

Come cambia il ciclo di vita del software quando l'IA è dentro il loop? Non come strumento esterno che accelera la scrittura, ma come partecipante attivo nella progettazione, nella revisione, nella documentazione?

L'IA non migliora il processo di sviluppo automaticamente. Lo amplifica — nel bene e nel male. Un processo caotico con l'IA diventa più caotico più velocemente. Un processo rigoroso con l'IA diventa più rigoroso con meno attrito.

La disciplina del software engineering — requisiti, architettura, test, review — non diventa meno importante nell'era dell'IA. Diventa *più* importante, perché la velocità con cui si può produrre codice cattivo aumenta esponenzialmente.

**Imparare a lavorare con l'IA ha richiesto di tornare alle basi del mestiere.**

## Livello Sette: I Modelli sul Dispositivo

L'ultimo passo — finora — è stato portare i modelli sul cellulare e sul Mac.

Non per curiosità. Per necessità: il reinforcement learning per il trading richiede sperimentazione rapida, iterazioni locali, controllo completo del processo di addestramento. I modelli Qwen 3.5, ottimamente distillati, si prestano a questo tipo di deployment.

Ma l'installazione di un LLM in locale apre un altro capitolo: la gestione delle risorse hardware, la quantizzazione dei pesi, i formati GGUF e ONNX, i runtime di inferenza. Un altro strato di competenza che si sovrappone a tutti i precedenti.

E poi c'è il reinforcement learning da linguaggio — RLHF e le sue varianti. Come si addestra un modello a comportarsi in modo desiderabile. Come si costruisce una funzione di reward che catturi davvero l'obiettivo. Come si evita che il modello ottimizzi la metrica invece del comportamento.

Un campo aperto. Un'area di ricerca attiva. La frontiera si è spostata ancora.

## La Mappa del Percorso

Guardando indietro, il percorso ha una struttura che non era visibile mentre si percorreva:

```
Assistente di coding
    └── Prompt engineering
    └── Portali web, dashboard

Machine learning applicato
    └── Trading algoritmico
    └── Feature engineering, validazione

Semantica del codice
    └── AST, Tree-sitter, parsing
    └── Code intelligence, analisi strutturale

Information retrieval
    └── RAG, embedding, database vettoriali
    └── 30+ strategie, chunking semantico, re-ranking

Architettura degli LLM
    └── Transformer, attention, softmax
    └── Tokenizzazione, embedding, temperatura

SDLC aumentato
    └── Processo di sviluppo con IA
    └── Qualità, revisione, documentazione

Deployment locale
    └── Modelli su dispositivo, quantizzazione
    └── Reinforcement learning, RLHF
```

Non è un curriculum lineare. È una mappa dove ogni punto di arrivo apre tre nuovi percorsi.

## I Prossimi Passi

Se la mappa ha una direzione, è questa:

**Reinforcement learning applicato al dominio**: affinare i modelli per il trading non è solo un esercizio tecnico — è capire come si trasferisce conoscenza di dominio in un sistema che impara per feedback. La funzione di reward è un'ipotesi sul mondo. Scriverla bene è una competenza rara.

**Architetture multi-agente**: i sistemi dove più LLM cooperano, si specializzano, si verificano a vicenda. Non è fantascienza — è l'evoluzione naturale del RAG e degli agent framework. La sfida è l'orchestrazione: chi decide cosa, quando, con quale priorità.

**Valutazione e metriche**: uno dei problemi più sottovalutati nell'IA applicata. Come misuri che il tuo sistema funziona bene? Le metriche classiche del ML non bastano quando l'output è testo. L'evaluazione diventa essa stessa un problema di ricerca.

**La semantica a runtime**: non solo capire il codice statico, ma il codice in esecuzione. Trace distribuiti, profiling, analisi del comportamento a runtime. Il confine tra code intelligence e observability è più sottile di quanto sembri.

**I fondamenti matematici**: tornare indietro, riempire i gap. L'algebra lineare alla base degli embedding. La teoria dell'informazione alla base della tokenizzazione. La statistica bayesiana alla base del ragionamento sotto incertezza. Non per fare ricerca — per capire davvero cosa succede sotto il cofano.

## La Morale

Non si finisce mai.

Non è una minaccia. Non è un invito all'ansia. È la descrizione di un campo che è vivo, che si muove, che cambia mentre lo studi. Ogni risposta che trovi apre due domande nuove. Ogni sistema che costruisci rivela una complessità che non era visibile dall'esterno.

C'è chi trova questo sfiancante. C'è chi lo trova liberatorio.

La differenza sta in cosa si cerca. Se si cerca la padronanza definitiva — il punto in cui si può smettere di imparare perché si sa tutto — questo campo sarà sempre una frustrazione. Non arriva quel punto. Non esiste.

Se invece si cerca il movimento — il piacere di capire qualcosa che prima non si capiva, il momento in cui un concetto cade al suo posto, la soddisfazione di un sistema che funziona per ragioni che si comprendono — allora questo è uno dei campi più ricchi che esistano.

**Il viaggio non ha destinazione. Ha solo direzione.**

E la direzione, per adesso, è ancora in avanti.

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

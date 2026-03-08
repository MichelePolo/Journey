---
layout: layouts/post.njk
tags: [post]
title: "Il Dado Pesato"
subtitle: "Un LLM non pensa né capisce: genera il prossimo token lanciando un dado, miliardi di volte"
date: 2026-03-04
quote: "Il pericolo delle macchine non è che penseranno come uomini, ma che gli uomini penseranno come macchine."
quoteAuthor: "Sydney J. Harris"
---

## Il Tiratore di Dadi Più Sofisticato del Mondo

Immagina un dado. Non il classico cubetto a sei facce, ma un dado con centotrentamila facce — una per ogni possibile parola, frammento di parola, segno di punteggiatura che una macchina conosce. Ogni faccia ha un peso diverso, e quel peso cambia in base a tutto quello che è stato detto prima.

Lanci il dado. Ottieni "il". I pesi cambiano. Rilanci. "gatto". Ancora. "dorme". E così via, token dopo token, finché la risposta non è completa.

Questo è un Large Language Model. Niente di più, niente di meno.

Non c'è un cervello nascosto. Non c'è un database di fatti che viene consultato in silenzio. Non c'è comprensione, intuizione, o esperienza accumulata nel senso in cui la intendiamo noi. C'è una funzione matematica straordinariamente complessa che, dato un contesto, produce una distribuzione di probabilità sul prossimo token — e poi campiona da quella distribuzione.

La magia che percepiamo come "intelligenza" è l'effetto di miliardi di parametri addestrati per pesare le parole nel modo giusto.

## Dalla Parola al Vettore: Il Vocabolario del Modello

Prima che il modello possa fare qualsiasi cosa, il testo deve diventare numeri.

Il processo inizia con la **tokenizzazione**: il testo viene spezzato in unità elementari chiamate token. Non sono necessariamente parole intere — "informatica" potrebbe diventare "inform" + "atica", "GPT-4" potrebbe essere tre token separati. Il vocabolario di un modello come Claude Opus 4.6 contiene circa 1M di token che corrispondono a un vocabolario di 750.000 parole.

Sebbene la versione standard operi con una finestra di 200.000 token, la versione aggiornata 4.6 supporta il milione di token via API.

Ogni token viene poi trasformato in un **vettore di embedding**: un array di numeri che rappresenta la "posizione" del token in uno spazio matematico ad alta dimensionalità. La cosa interessante è che in questo spazio, il vettore di "re" meno il vettore di "uomo" più il vettore di "donna" si avvicina sorprendentemente al vettore di "regina". Il significato — o qualcosa che gli assomiglia molto — emerge dalla geometria.

Questi vettori non vengono costruiti a mano. Emergono dall'addestramento: il modello ha visto così tanto testo che ha imparato, per forza di cose, che "gatto" e "felino" appaiono in contesti simili, e che i loro vettori devono essere vicini.

**Ma attenzione**: vicini nello spazio vettoriale non significa che il modello "sa" cosa sia un gatto. Significa che ha imparato che quella stringa di caratteri appare spesso vicino ad altre stringhe di caratteri simili. È statistica, non conoscenza.

## I 32 Layer che Trasformano il Contesto

Il cuore del modello è uno stack di **32 blocchi transformer**. Ogni blocco riceve i vettori in ingresso e li trasforma, arricchendoli progressivamente di contesto.

Ogni blocco fa due cose in sequenza.

La prima è la **self-attention**: il meccanismo che permette a ogni token di "guardare" tutti gli altri nella sequenza. In un modello a 32 layer con 32 teste di attenzione ciascuno, ci sono 1.024 teste in totale, ognuna che impara a catturare relazioni diverse: accordo soggetto-verbo, dipendenze a lunga distanza, strutture sintattiche, sfumature semantiche. Nessuno ha programmato esplicitamente queste relazioni — sono emerse dall'addestramento.

La seconda operazione è il **feed-forward network**: una rete neurale densa che elabora ogni token indipendentemente, applicando trasformazioni non lineari che permettono al modello di "elaborare" l'informazione accumulata dall'attenzione.

Alla fine dei 32 layer, ogni vettore contiene una rappresentazione del proprio token arricchita dall'intero contesto. Quei vettori vengono poi proiettati su uno spazio di 1.000.000 di dimensioni — una per ogni token del vocabolario - producendo i valori grezzi che, passati per una funzione softmax, diventano probabilità.

La funzione Softmax è una funzione di attivazione utilizzata nel Machine Learning, in particolare nello strato finale delle reti neurali per la classificazione multiclasse. Converte un vettore di numeri grezzi (logit) in una distribuzione di probabilità normalizzata, dove ogni valore è compreso tra 0 e 1 e la somma totale è pari a 1.

## Il Lancio del Dado e il Parametro Temperatura

Ora il modello ha una distribuzione di probabilità: "gatto" ha il 23%, "cane" ha il 18%, "uccello" ha il 4%, e così via per tutto il 1.000.000 di token possibili.

Come si sceglie il prossimo token?

Entra in gioco la **temperatura**.

Con temperatura zero, si prende sempre il token più probabile. Il dado diventa deterministico — per lo stesso input, stesso output, ogni volta. Utile per compiti tecnici precisi.

Con temperatura alta (1.5-2), i pesi si appiattiscono: token meno probabili diventano più competitivi. Il dado è più libero. Le risposte sono più *creative, variegate, inattese* — ma anche più inclini all'errore e all'incoerenza.

Il punto cruciale: **il modello non decide cosa è corretto**. Campiona ciò che è statisticamente plausibile dato il contesto. Se la maggior parte dei testi nel corpus di addestramento associava "la capitale dell'Australia" con "Canberra", allora "Canberra" avrà un peso alto. Non perché il modello "sappia" che Canberra è la capitale dell'Australia', ma perché ha visto quella associazione miliardi di volte.

```
Prompt: "La capitale dell'Australia è"

Logit → Softmax:
  "Canberra"   → 94.3%   ← campionato
  "Sidney"     →  1.8%
  "CucaMonga"  →  1.0%
  "Roma"       →  0.7%
  "Gatto"      →  0.1%
  ...                   1.000.000 altri token
```

Quando invece il modello scrive "La capitale dell'Australia è Canberra" produce ciò che è statisticamente plausibile. Il fatto che sia anche vero è solamente correlazione, non causalità.

## Perché Sbaglia e Allucina con la Stessa Sicurezza

**Come può essere così sicuro quando sbaglia?**

Perché la sicurezza non viene dalla verifica. Viene dalla distribuzione di probabilità.

Quando il modello scrive "Aggiungi due cucchiai di sale", lo fa con la stessa naturalezza con cui potrebbe scrivere "due cucchiai di zucchero". Non sta assaggiando il piatto nella sua testa, né consulta una ricetta online. Sta solo calcolando che, dopo la parola "due cucchiai di", il token "sale" ha una probabilità statistica altissima nel contesto di una ricetta salata. Se il contesto fosse leggermente ambiguo, potrebbe scambiarli senza distinzione.

Le **allucinazioni** — fatti inventati, citazioni inesistenti, date sbagliate — non sono bug nel senso tradizionale. Sono il comportamento atteso di un sistema che genera testo plausibile, non testo vero.

I numeri sono particolarmente problematici. Date, misure, statistiche: appaiono frequentemente nel corpus di addestramento, quindi il modello ha imparato a produrre numeri con sicurezza. Ma non ha imparato a distinguere i numeri corretti dai numeri plausibili. Per lui non esiste questa distinzione — esiste solo la distribuzione di probabilità. Michele è nato nel 1979 è ugualmente plausibile di Michele è nato nel 1879.

**Ogni risposta è una sequenza di lanci di dado.** Il modello non mantiene un quadro logico globale. Non "ragiona" nel senso in cui ragioniamo noi. Produce un token, poi il successivo, poi il successivo ancora, senza mai tornare indietro a verificare la coerenza dell'insieme.

## La Conoscenza Ungrounded

C'è un termine tecnico che descrive il problema di fondo: **ungrounded**.

La conoscenza del modello non è ancorata al mondo reale. Sono pattern statistici estratti da testi scritti da umani — e quella catena si ferma lì. Il modello non ha mai assaggiato un piatto. Non ha mai visto un gatto. Non ha visitato Canberra. Ha visto miliardi di frasi su ricette e gatti e ha costruito relazioni statistiche tra quelle parole.

Se il testo di partenza era sbagliato, il modello ha imparato la versione sbagliata con la stessa efficienza con cui ha imparato quella corretta. Non esiste un meccanismo interno di sanity check. Non esiste una bussola che punta verso la verità.

**Il modello non è bugiardo. Non è onesto. È amorale rispetto alla verità**, nel senso che non ha accesso al concetto. Genera ciò che è statisticamente probabile nel contesto dato, indipendentemente da ciò che è vero.

## RAG: Dare una Memoria al Dado

L'approccio più efficace per compensare questo limite si chiama **RAG — Retrieval-Augmented Generation**.

L'idea è semplice: prima di chiedere al modello di generare, recupera documenti rilevanti da un database esterno e inseriscili nel contesto. Il modello non deve più "ricordare" da solo — gli forniamo il materiale su cui basarsi.

Il flusso pratico:

1. La domanda viene trasformata in un vettore di embedding
2. Un database vettoriale (ChromaDB, Qdrant, pgvector) trova i frammenti più simili
3. Quei frammenti vengono inseriti nel prompt come contesto
4. Il modello genera basandosi su quei contenuti, non sulla sua memoria statistica

Con il RAG (Retrieval-Augmented Generation), il "dado" statistico del modello non lancia più numeri a caso, ma numeri pesati da documenti reali e non solo dai pattern appresi durante l'addestramento. Se i documenti sono affidabili e aggiornati, le risposte lo saranno molto di più.

Oggi questo concetto si evolve ulteriormente con strumenti come Claude Code e le sue "Skills". In questo scenario, il RAG non è più solo una ricerca passiva in un archivio di testi, ma diventa una capacità attiva:

Invece di limitarsi a pescare un vecchio manuale, Claude Code può usare una "Skill" per eseguire un comando nel terminale, leggere i log di sistema o analizzare l'attuale struttura del tuo codice.

**Ma il RAG e le Skills non sono magia**. Se il documento recuperato è obsoleto, o se la *Skill* di Claude Code analizza un file di test sbagliato, il modello ci costruirà sopra una risposta con la stessa sicurezza. La qualità dell'output dipende sempre dalla precisione dell'input. È il principio del Garbage In, Garbage Out: se alimenti il sistema con dati errati, otterrai solo un'allucinazione più sofisticata.

## Agenti che Cooperano per Compensare i Limiti del Singolo

Un singolo modello con RAG è già molto più affidabile di un modello nudo. Ma per compiti complessi — analisi di codice, report su dati — serve qualcosa di più strutturato.

Entrano in gioco i **sistemi multi-agente**: architetture in cui più LLM specializzati cooperano, ognuno con un ruolo definito.

Un'architettura tipica potrebbe avere:

- Un **agente di pianificazione** che scompone il task in sotto-obiettivi
- Un **agente di ricerca** che interroga il database vettoriale per arricchire il contensto
- Un **agente di analisi** che elabora i documenti recuperati
- Un **agente di dominio** specializzato in un settore specifico
- Un **agente di sintesi** che produce il report finale
- Un **agente di verifica** che assegna punteggi di fiducia alle affermazioni

Ogni agente è ancora un dado pesato. Ma la cooperazione introduce **ridondanza**, **specializzazione**, e la possibilità di **fact-checking incrociato**. Un agente verifica le affermazioni di un altro. Il risultato finale non è prodotto da un singolo lancio di dado, ma da un processo iterativo in cui gli errori hanno più opportunità di essere intercettati.

Non è pensiero. Ma comincia ad assomigliare a una pipeline più robusta.

## Quello che il Modello Non Farà Mai da Solo

Ho lavorato abbastanza con questi sistemi da identificare ciò che un LLM gestisce male per come è fatto.

**Non verifica.** Non può aprire una finestra sul browser, consultare Wikipedia, controllare se una data è corretta. A meno che non gli venga fornito un tool esplicito per farlo, genera e basta.

**Non ricorda tra sessioni.** Ogni conversazione inizia da zero. La "personalità" che sembra emergere in una sessione lunga è un effetto del contesto, non di una memoria persistente.

**Non ragiona passo dopo passo nel senso profondo del termine.** La chain-of-thought — quella tecnica per cui chiediamo al modello di "pensare per step" — migliora le performance su certi task perché introduce più token di contesto su cui basare i lanci successivi. Ma non è ragionamento: è più token che guidano il dado.

**Non sa di non sapere.** Non esiste un meccanismo di incertezza genuina. Il modello può imparare a scrivere "non sono sicuro" in certi contesti — ma quella frase è essa stessa un pattern statistico, non una valutazione autentica.

## Il Dado Come Strumento

Capire come funziona il dado cambia il modo in cui lo si usa.

Se sai che il modello genera risultati plausibili, non veri, sai che devi verificare i fatti critici indipendentemente. Se sai che la sicurezza nel tono non correla con la correttezza del contenuto, smetti di fidarti della sicurezza come segnale. Se sai che con temperatura alta ottieni più creatività ma meno affidabilità, calibri la temperatura in base al task.

**Il modello non è un esperto. Non è una fonte di verità.** È un motore di linguaggio potentissimo che genera il prossimo token più probabile dato il contesto — e lo fa con una velocità, una fluidità, e una coerenza locale che a prima vista somiglia a comprensione.

Non lo è. Ma questo non lo rende meno utile.

Usarlo bene significa capire cosa sta lanciando il dado — e decidere consapevolmente quando quell'output è abbastanza buono, e quando ha bisogno di essere verificato, corretto, o completamente scartato.

## Conclusione: Demistificare l'intelligenza artificiale

C'è una tendenza inevitabile a antropomorfizzare l'Intelligenza Artificiale, "La mia macchina si è offesa perché stanotte l'ho lasciata fuori dal garage". Gli LLM parlano la nostra lingua. Rispondono alle nostre domande. Sembrano capire il contesto e l'ironia, generano barzellette.

Ma sotto quella superficie c'è solo matematica: matrici di pesi, moltiplicazioni, softmax, logit, campionamento.

Non è una critica. È una caratteristica. Un coltello non è peggio di un bisturi perché non capisce l'anatomia. Funziona secondo i suoi principi, e chi lo usa bene lo conosce per quello che è.

**Un LLM genera testo probabile. Nient'altro, ma nemmeno qualcosa di meno.**

Ogni parola che produce è il risultato di un dado pesato. Quel dado è straordinario — pesa meglio di qualsiasi strumento che abbiamo mai costruito. Ma resta un dado, e va usato sapendolo.

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
- **Post 14**: Il Dado Pesato ← *Sei qui*

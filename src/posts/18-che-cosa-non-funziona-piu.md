---
layout: layouts/post.njk
tags: [post]
title: "Che Cosa Non Funziona Più"
subtitle: "L'IA non ha creato la mediocrità. L'ha resa immediatamente visibile."
date: 2026-04-22
quote: "Non c'è nulla di così inutile come fare con grande efficienza ciò che non dovrebbe essere fatto affatto."
quoteAuthor: "Peter Drucker"
---

## L'Istinto del Senior

Quante volte, nella tua storia di lavoro, hai affrontato un problema costruendo una soluzione?

Un protocollo, un processo, un documento, un software, una regola operativa. Hai provato, hai sbagliato, hai corretto il tiro, hai riprovato. Decine di volte. Centinaia. Per alcuni, migliaia.

Alla lunga nasce una forma di istinto.

Non la soluzione perfetta. Non la soluzione elegante. Una soluzione **abbastanza buona** da far andare avanti il progetto, chiudere la richiesta, soddisfare il cliente, consegnare entro la scadenza.

Per anni questa cosa ha funzionato. Vale per il PM che risponde in chat alle 23. Vale per l'analista funzionale che chiude la specifica con un "ne riparliamo in fase di test". Vale per il tecnico che lascia il `TODO` nel commit e per il dirigente che firma una roadmap che sa di non poter rispettare.

Tutti, prima o poi, abbiamo imparato a cavarcela.

***

## La Leggenda del Fiuto

La leggenda del senior è tutta qui: dopo tante battaglie, sviluppi un fiuto.

Sai riconoscere subito dove si annida il problema. Capisci quale richiesta è ambigua. Intuisci quando una specifica è troppo vaga, quando un processo è fragile, quando un software è destinato a diventare costoso da mantenere.

Non è magia. È esperienza sedimentata.

Un analista funzionale capisce al volo dove un flusso si rompe. Un tecnico sa già che una certa architettura "reggerà finché regge". Un PM riconosce quando una roadmap è ottimista. Un dirigente sente che un'iniziativa è operativamente debole.

Per molto tempo, questo è bastato. Portava a casa il risultato. A volte anche bene.

Poi è arrivata l'IA.

***

## Il Punto di Rottura

Per essere chiari: **l'IA non ha creato il problema della mediocrità**. Ha fatto una cosa più fastidiosa. L'ha resa immediatamente visibile.

Prima potevi permetterti una soluzione discreta, un po' grezza, un po' troppo lunga, un po' fragile. C'era tempo per correggere, iterare, rivedere. C'erano mesi di sviluppo, change request, passaggi intermedi, rallentamenti naturali che assorbivano gli errori iniziali.

Oggi quel tempo non c'è più.

Il moltiplicatore IA prende la tua intuizione e la trasforma subito in output. Se l'idea è confusa, **il rumore esce subito**. Se l'analisi è debole, **il codice lo mostra subito**. Se la progettazione è approssimativa, **la prima implementazione la espone senza pietà**.

Non hai più il lusso dell'errore lento.

Un LLM genera ciò che è statisticamente plausibile, non ciò che è giusto. Se gli dai un input ambiguo, ti restituisce un output ambiguo confezionato in modo convincente. Garbage In, *Confident* Garbage Out.

***

## Tre Esempi Concreti

Prendiamo una richiesta commerciale qualsiasi, di quelle che arrivano vaghe e apparentemente innocue:

> "Serve una dashboard per monitorare le anomalie."

Prima questa frase poteva sopravvivere giorni o settimane. Durante l'analisi qualcuno avrebbe chiesto chiarimenti. Durante la progettazione qualcuno avrebbe scoperto che "anomalia" significava tre cose diverse a seconda del reparto. Durante lo sviluppo il team avrebbe visto che mancavano i dati, che i filtri erano incoerenti, che la metrica non era realmente calcolabile.

Con l'IA, se parti male, parti subito male.

Puoi far generare una dashboard in poche ore. Ma se non hai chiarito cosa sia davvero un'anomalia, ti ritrovi con un'interfaccia elegante che misura la cosa sbagliata. Pixel perfetti, semantica nulla.

---

Secondo esempio: i performance test su un'API.

Se non definisci bene l'obiettivo, l'infrastruttura, la tipologia di test, l'IA produce un workspace di default. Non si tara sulla tua infrastruttura. Non distingue tra carico nominale e picchi. E poi scopri che il caso più raro — quello che succede una volta ogni mille — era esattamente quello che contava testare.

Correggerlo dopo costa molto più che fermarsi prima e ragionare meglio.

---

Terzo esempio, più vicino a chi gestisce: un PM chiede di "consegnare il progetto con due settimane di anticipo".

Senza una vera analisi puoi ottenere subito una proposta, un mockup, un backlog popolato. Ma se non distingui tra raccolta requisiti, controlli di compliance, analisi, progettazione, sviluppo, monitoraggio, stai ottimizzando un processo che non hai capito.

L'IA non perdona questa approssimazione. La amplifica.

***

## L'Attrito Era una Funzione

Il punto non è che prima si lavorasse meglio. Il punto è che prima c'era più **attrito** tra idea e risultato.

Quell'attrito era lento, a volte frustrante, ma aveva una funzione. Ti dava tempo di capire che stavi sbagliando. Ti dava i giorni di silenzio in cui un dubbio diventava una domanda, e una domanda diventava una correzione.

Oggi l'attrito si è ridotto. E quando l'attrito si riduce, il vizio della superficialità diventa più visibile.

È lo stesso meccanismo che ho descritto in ["Non Mandare un Robot in Palestra"](/Journey/posts/13-non-mandare-un-robot-in-palestra/): se deleghi alla macchina il lavoro cognitivo, il muscolo non cresce. La differenza è che lì parlavo di apprendimento personale. Qui parlo di output professionale.

Stesso principio. Effetti diversi. Entrambi più visibili di prima.

***

## Esperienza Più Disciplina

Per questo non basta più avere esperienza. Serve esperienza **più disciplina di pensiero**.

Bisogna progettare meglio prima di scrivere. Bisogna saper fare le domande giuste prima di generare la risposta. Bisogna distinguere tra:

- soluzione rapida
- soluzione robusta
- soluzione manutenibile
- soluzione comprensibile da chi verrà dopo

Sono quattro cose diverse. Una buona Skill — di quelle di cui ho parlato nel [post sulle Skill](/Journey/posts/17-come-creare-una-skill/) — può aiutarti a ricordartelo. Un buon `CLAUDE.md` può forzare il flusso. Ma nessuno strumento decide al posto tuo cosa stai cercando.

L'IA sa accelerare. Non sa scegliere il problema giusto.

***

## Dove Si Sposta il Valore

Il valore del senior, oggi, non sta più nel saper cavarsela comunque. Sta nel saper vedere prima dove il sistema si romperà.

Un buon PM non è quello che scrive il piano più lungo. È quello che capisce dove il piano è debole.

Un buon analista non è quello che produce più documenti. È quello che elimina le ambiguità prima che diventino codice sbagliato.

Un buon tecnico non è quello che implementa più in fretta. È quello che riconosce quando una strada veloce produrrà debito tecnico.

L'IA rende tutto questo più importante, non meno. Perché se la qualità della riflessione cala, la produzione aumenta lo stesso. E proprio per questo il danno arriva prima.

È la stessa intuizione di [Una Serata in Coworking](/Journey/posts/15-una-serata-in-coworking/): il mercato che non sa misurare la qualità premia chi sa vendersi. Solo che adesso anche la quantità è abbondante. Anche la quantità ha smesso di essere un segnale.

***

## La Domanda Nuova

La domanda, allora, non è più soltanto:

**"Come risolvo questo problema?"**

Diventa:

**"Che cosa non funziona più, se lascio fare tutto in fretta all'IA?"**

Che cosa non funziona più nella raccolta requisiti, nella progettazione, nella verifica, nel monitoraggio, nella manutenzione?

Che cosa non funziona più quando ci accontentiamo di una soluzione che sembra giusta?

Che cosa non funziona più quando confondiamo velocità con maturità?

È qui che cambia il mestiere.

Non basta più saper costruire. Bisogna saper distinguere, prima ancora, ciò che merita davvero di essere costruito.

**Il fiuto del senior non è morto. È diventato l'unica cosa che conta davvero.**

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
- Post 16: [Si Vola Più Lontano per il Gusto di Volare](/Journey/posts/16-non-si-finisce-mai/)
- Post 17: [Come Creare una Skill per Claude Code](/Journey/posts/17-come-creare-una-skill/)
- **Post 18**: Che Cosa Non Funziona Più ← *Sei qui*

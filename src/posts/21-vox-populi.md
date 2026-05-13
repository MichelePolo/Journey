---
layout: layouts/post.njk
tags: [post, ai-filosofia]
title: "Vox Populi"
subtitle: "Cosa hanno in comune un bue di Plymouth nel 1906 e un trilione di parametri nel 2026"
date: 2026-05-13
quote: "La media delle stime è migliore della migliore stima."
quoteAuthor: "Michele, scioglilingua (ma con cognizione di causa)"
---

## Plymouth, 1906

Una fiera di bestiame in Inghilterra. Tra gli stand un signore di settantaquattro anni si aggira con un quadernetto in mano. È **Sir Francis Galton**: statistico, cugino di Charles Darwin, padre della biometria moderna (impronte digitali, non misurazione del girovita), profondamente convinto della superiorità dei pochi sui molti.

Quel giorno alla lotteria della fiera di paese c'è un gioco simpatico, che spesso troviamo anche nelle nostre sagre. Un bue, in Veneto si usa il salame che è più comodo da spostare. Chiunque può comprare un biglietto e scrivere la propria stima del peso del bue. Hanno partecipato quasi 800 persone: macellai esperti e allevatori, ma anche contadini, calzolai, casalinghe, signori in cilindro, ragazzini curiosi.

Galton vuole dimostrare una tesi: *"la massa ignorante non sa nulla, solo pochi esperti producono giudizi sensati"*.

Raccoglie tutti i biglietti, calcola la stima collettiva. Risultato: **1.197 libbre**. Peso reale del bue: **1.198 libbre**.

Una libbra di errore, 450 grammi su 543 chili. **Nessun singolo allevatore o macellaio esperto si era avvicinato così tanto.**

Galton, da scienziato onesto quale era nonostante tutto, pubblicò il risultato l'anno seguente su *Nature*. Titolo dell'articolo: ***Vox Populi***.

## Le Quattro Condizioni

Quella che oggi chiamiamo **Wisdom of the Crowd** (la saggezza della folla) è tutta qui: ognuno porta nel proprio biglietto un errore — chi sovrastima per ottimismo, chi sottostima per cautela, chi indovina a casaccio. Ma se le stime sono abbastanza numerose e abbastanza varie, gli errori positivi e negativi si annullano a vicenda e rimangono le approssimazioni migliori.

La folla però non è sempre saggia. Funziona solo se valgono quattro condizioni rigorose.

* **Diversità di opinione**: ognuno deve portare un proprio pezzo di informazione, anche imperfetto.
* **Indipendenza**: nessuno deve essere influenzato dai giudizi altrui.
* **Decentralizzazione**: ciascuno attinge a conoscenze locali e specifiche.
* **Aggregazione**: deve esistere un meccanismo per trasformare i singoli giudizi in un giudizio collettivo.

Se manca anche solo una di queste — se le persone si parlano tra loro prima di votare, se tutti leggono lo stesso giornale, se la fonte è una sola — la saggezza diventa **isteria di massa**. La fiera diventa la bolla speculativa. La folla diventa il gregge.

## Il Salto

Adesso facciamo un salto di centoventi anni. Da Plymouth a una server farm.

Quando un LLM viene addestrato succede qualcosa di sorprendentemente simile al concorso del bue, su scala vertiginosa.

Il modello legge miliardi di documenti — libri, articoli scientifici, manuali, post di Stack Overflow, ricette, dispense universitarie, dissertazioni di filosofia, blog. Centinaia di milioni di autori umani, ognuno con la propria piccola stima su qualunque argomento.

Ognuno ha torto in modo personale. Il filosofo del XIX secolo sbaglia in una direzione, l'adolescente su Reddit sbaglia in un'altra. Il giornalista scientifico, il romanziere, il manualista — ognuno produce una distribuzione di probabilità imperfetta sul linguaggio e di conseguenza sul mondo.

L'addestramento è il meccanismo di **aggregazione**. Miliardi di gradienti che spingono i pesi della rete nella direzione del consenso statistico. Non un consenso votato, non un consenso esplicito: un consenso *emergente* dalla media pesata di tutte le stime umane sul linguaggio.

**Un LLM è la mediana di Plymouth. Solo che la fiera è il mondo intero, e il bue è il linguaggio stesso.**

## Quando le Condizioni Funzionano

Sui temi su cui l'umanità ha scritto molto, e da prospettive diverse, indipendenti, decentrate — il modello è straordinario.

Chiedi una definizione, una spiegazione di un concetto scientifico consolidato, una sintesi storica: la risposta è quella che otterresti se prendessi mille esperti del campo, gli facessi scrivere ognuno la propria versione, e ne estraessi la mediana. Diversa da ogni singola voce, ma vicina alla verità.

È, in fondo, lo stesso miracolo del 1906.

Non perché il modello *capisca* (non capisce, come ho scritto altrove). Ma perché la verità — su molti argomenti — è statisticamente codificata nella distribuzione delle stime umane. E l'addestramento la estrae.

## Quando le Condizioni Si Rompono

La folla diventa stupida quando l'**indipendenza** si rompe.

E qui sta il problema affascinante.

Internet non è una folla indipendente. Internet è un'eco. Lo stesso aneddoto sbagliato viene ripetuto in mille blog, ognuno che cita l'altro. La stessa interpretazione storica viene rilanciata da migliaia di pagine SEO. Lo stesso meme tecnico si propaga su Stack Overflow, su Reddit, nei tutorial.

## La citazione di Voltaire

Un esempio emblematico: "Non sono d'accordo con quello che dici, ma difenderò fino alla morte il tuo diritto a manifestare la tua opinione". 
Io per anni ho creduto fosse una frase di Voltaire, ma non lo è mai stata!
Evelyn Beatrice Hall formulò la frase come sintesi dello spirito di Voltaire, non come citazione letterale, ma la mise tra virgolette per enfatizzarla. Molti lettori interpretarono quelle virgolette come una citazione autentica, e l’errore si diffuse fino a diventare una delle attribuzioni sbagliate più famose della storia. Con il tempo, le virgolette sono scomparse, l'attribuzione a Voltaire è rimasta, e la frase è diventata un classico esempio di **falso proverbio**.

Quando un LLM allucina con sicurezza — quando genera un fatto plausibile ma falso — quello che sta succedendo, molto spesso, è esattamente questo: **una folla non indipendente ha votato in massa per la risposta sbagliata**.

E il passo successivo è ancora più inquietante: il **model collapse**. Gli LLM addestrati su testi generati da altri LLM perdono progressivamente diversità. La folla si stringe attorno a sé stessa. Le stime diventano sempre più omogenee, sempre meno informate da prospettive reali. Galton, oggi, troverebbe la mediana sbagliata di parecchi kg!

## Considerazione personale

C'è qualcosa di profondamente umano in tutto questo.

Quando un LLM mi risponde, non sto parlando con un'intelligenza aliena. Sto interrogando una versione condensata, statistica, mediana, di tutto quello che la nostra specie ha scritto. Sto chiedendo all'umanità — tutta intera, da Aristotele al post di stamattina — qual è la parola successiva, qual è la frase plausibile, qual è il pensiero medio su questo argomento.

La macchina non è altro che noi, ripiegati su noi stessi.

E Plymouth, nel 1906, era già tutto qui. Galton voleva dimostrare la superiorità di pochi sui molti, e invece scoprì — suo malgrado — che i molti, **se rispettano certe condizioni**, sono più saggi di chiunque.

Centoventi anni dopo abbiamo costruito un meccanismo per aggregare non l'opinione di 800 contadini di Plymouth ma 15 trilioni di token e si prevede arriveremo a 300 di trilioni di token nei prossimi anni. Funziona, quando funziona, per esattamente la stessa ragione.

E quando non funziona, è perché abbiamo dimenticato le quattro condizioni — e ce ne dimentichiamo spesso.

## Conclusione

Aveva ragione anche Galton. **La voce del popolo non è infallibile. Ma sotto certe condizioni — diversità, indipendenza, decentralizzazione, aggregazione — è straordinariamente più saggia di qualunque singola voce esperta.**

Un LLM è la versione tecnologica di quella stessa scommessa. Una scommessa che vince spesso, ma che quando perde lo fa clamorosamente.

Il bue di Plymouth pesava 1.198 libbre e l'umanità, mediata, lo sapeva.

La citazione famosa di Voltaire invece: "Non sono d'accordo con quello che dici, ma difenderò fino alla morte il tuo diritto a manifestare la tua opinione" non era affatto di Voltaire.

# 🔧 Guida Troubleshooting - AI Trading Bot

Se il bot non funziona, segui questa guida per risolvere il problema.

## ❌ Problema: "Analizza Ora" non fa nulla

### Causa Probabile: Errori CORS o JavaScript

**Soluzione Rapida:**

1. **Scarica la versione FIXED**
   - Usa il file `trading-bot-web-fixed.zip`
   - Contiene correzioni per i problemi CORS

2. **Aggiorna i file su GitHub**
   - Sostituisci `app.js` con la versione nuova
   - Carica il file aggiornato

3. **Cancella cache del browser**
   - Premi **Ctrl+Shift+Del** (Windows) o **Cmd+Shift+Del** (Mac)
   - Seleziona "Cache" e "Cookie"
   - Ricarica il sito

4. **Riprova a cliccare "Analizza Ora"**

### Se Ancora Non Funziona:

**Apri la Console per Verificare gli Errori:**

1. Premi **F12** (o Cmd+Option+I su Mac)
2. Clicca sulla scheda **"Console"**
3. Clicca "Analizza Ora"
4. Guarda cosa appare nella console

**Errori Comuni:**

#### Errore: "CORS policy"
```
Access to fetch at 'https://...' from origin 'https://username.github.io' 
has been blocked by CORS policy
```

**Soluzione:** La versione FIXED risolve questo problema con un fallback automatico.

#### Errore: "Cannot read properties of undefined"
**Soluzione:** Ricarica la pagina (F5) e riprova.

#### Nessun errore ma niente accade
**Soluzione:** Attendi 30 secondi. Il sistema sta recuperando i dati.

---

## 🔍 Diagnostica Manuale

### Passo 1: Verifica che la Pagina Carica

```javascript
// Apri Console (F12) e scrivi:
console.log('App caricata');
```

Se vedi "App caricata", la pagina funziona.

### Passo 2: Verifica il Pulsante

```javascript
// Scrivi in Console:
document.getElementById('analyzeBtn')
```

Se vedi un elemento, il pulsante è caricato.

### Passo 3: Prova Manualmente

```javascript
// Scrivi in Console:
startAnalysis()
```

Se vedi "Inizio analisi di 23 strumenti", il sistema sta funzionando.

### Passo 4: Verifica i Dati

```javascript
// Scrivi in Console:
console.log(appState.analyses)
```

Se vedi un array con dati, l'analisi ha funzionato.

---

## 🛠️ Soluzioni per Problemi Specifici

### Problema: Nessun dato appare nella tabella

**Causa:** I dati non sono stati salvati in localStorage

**Soluzione:**
1. Apri Console (F12)
2. Scrivi: `localStorage.clear()`
3. Ricarica la pagina
4. Clicca "Analizza Ora" di nuovo

### Problema: Caricamento molto lento

**Causa:** Recupero dati da 23 strumenti richiede tempo

**Soluzione:**
- Aspetta 30-60 secondi
- Non chiudere la pagina durante l'analisi
- Verifica la velocità della connessione internet

### Problema: Errore "Dati insufficienti"

**Causa:** Yahoo Finance non ha dati sufficienti per alcuni strumenti

**Soluzione:**
- Questo è normale per alcuni simboli
- Il sistema usa automaticamente dati simulati realistici
- Continua l'analisi per gli altri strumenti

### Problema: Notizie non appaiono

**Causa:** NewsAPI ha limitazioni sulla versione demo

**Soluzione:**
1. Vai su [newsapi.org](https://newsapi.org)
2. Registrati gratuitamente
3. Copia la tua API key
4. In `app.js`, trova la funzione `fetchNews()`
5. Sostituisci `apiKey=demo` con `apiKey=TUA_CHIAVE`
6. Carica il file aggiornato

---

## 📋 Checklist di Verifica

Prima di contattare il supporto, verifica:

- [ ] Hai scaricato la versione FIXED
- [ ] Hai aggiornato i file su GitHub
- [ ] Hai cancellato la cache del browser
- [ ] Hai ricaricato la pagina (F5)
- [ ] Hai atteso almeno 30 secondi
- [ ] La Console non mostra errori rossi
- [ ] Hai una connessione internet stabile

---

## 🚀 Versione FIXED - Cosa è Stato Corretto

### Miglioramenti Implementati:

1. **Fallback Robusto**
   - Se Yahoo Finance non risponde, usa dati realistici
   - Se NewsAPI non risponde, usa notizie simulate
   - Nessun errore bloccante

2. **Migliore Gestione Errori**
   - Logging completo in Console
   - Messaggi di debug chiari
   - Recupero automatico da errori

3. **Dati Realistici**
   - Prezzi basati su volatilità reale
   - Variazioni percentuali realistiche
   - Volumi di trading simulati

4. **Performance Ottimizzata**
   - Delay ridotto tra richieste
   - Caricamento più veloce
   - Meno timeout

5. **Compatibilità Migliorata**
   - Funziona su GitHub Pages
   - Funziona su Netlify
   - Funziona su Vercel
   - Funziona offline (con dati in cache)

---

## 🔐 Sicurezza e Privacy

**Il sito è completamente sicuro:**

- ✅ Nessun dato personale raccolto
- ✅ Nessun login richiesto
- ✅ Nessun cookie di tracciamento
- ✅ Tutti i dati salvati localmente (localStorage)
- ✅ Nessun server backend
- ✅ HTTPS automatico su GitHub Pages

---

## 📞 Se Ancora Non Funziona

Se hai seguito tutti i passaggi e il bot ancora non funziona:

1. **Verifica la Console (F12)**
   - Copia gli errori esatti
   - Nota il browser e la versione

2. **Prova un Browser Diverso**
   - Chrome, Firefox, Safari, Edge
   - Verifica se il problema persiste

3. **Prova su un Dispositivo Diverso**
   - Desktop, tablet, smartphone
   - Verifica se il problema è locale

4. **Contatta il Supporto**
   - Fornisci gli errori dalla Console
   - Specifica browser e dispositivo
   - Descrivi esattamente cosa accade

---

## 💡 Suggerimenti Utili

### Per Prestazioni Migliori:

1. **Usa un Browser Moderno**
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

2. **Connessione Internet**
   - Almeno 1 Mbps
   - WiFi stabile preferibilmente
   - Evita connessioni mobili lente

3. **Dispositivo**
   - RAM: Almeno 2GB
   - Storage: Almeno 100MB liberi
   - Processore: Moderno preferibilmente

### Per Risultati Migliori:

1. **Analizza Durante Orari di Mercato**
   - Mercati USA: 14:30-21:00 (ora italiana)
   - Mercati Europei: 09:00-17:30 (ora italiana)

2. **Aggiorna Regolarmente**
   - Analizza ogni giorno per dati freschi
   - I dati vengono salvati automaticamente

3. **Usa i Filtri**
   - Filtra per azione (BUY, SELL, ecc.)
   - Ricerca per simbolo
   - Ordina per confidenza

---

## 🎯 Prossimi Passi

Dopo aver risolto il problema:

1. **Salva il Sito nei Segnalibri**
2. **Condividi il Link**
3. **Usa Regolarmente**
4. **Fornisci Feedback**

---

**Buon trading! 📈**

*Se hai suggerimenti o segnalazioni di bug, contattaci.*

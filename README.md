# 🤖 AI Trading Bot - Web Platform

Piattaforma web moderna per analisi tecnica multi-strumento in tempo reale. Analizza 23 strumenti finanziari utilizzando indicatori tecnici avanzati e genera raccomandazioni di trading automatiche.

## ✨ Caratteristiche

- **23 Strumenti Finanziari**: Azioni tech USA, indici globali, commodities
- **Indicatori Tecnici Avanzati**: RSI, Bollinger Bands, MACD, EMA, ATR, OBV
- **Analisi AI**: Score di confidenza e raccomandazioni automatiche
- **Dashboard Interattivo**: Vista tabella e card con filtri
- **Dati in Tempo Reale**: Integrazione con Yahoo Finance
- **Responsive Design**: Funziona perfettamente su desktop, tablet, mobile
- **Persistenza Dati**: Salvataggio in localStorage
- **Export CSV**: Esporta analisi in formato CSV

## 🚀 Come Usare

### 1. Apri l'Applicazione

Semplicemente apri `index.html` nel tuo browser:

```bash
# Su Mac/Linux
open index.html

# Su Windows
start index.html

# Oppure doppio click sul file
```

### 2. Avvia Analisi

Clicca il pulsante **"⚡ Analizza Ora"** per avviare l'analisi di tutti i 23 strumenti.

Il sistema:
- Recupera dati di mercato in tempo reale
- Calcola tutti gli indicatori tecnici
- Genera raccomandazioni di trading
- Salva i risultati in localStorage

### 3. Visualizza Risultati

- **Vista Tabella**: Panoramica completa con tutti i dati
- **Vista Card**: Visualizzazione compatta per mobile
- **Ricerca**: Filtra per nome o simbolo
- **Filtri**: Mostra solo azioni specifiche (BUY, SELL, ecc.)
- **Dettagli**: Clicca su uno strumento per analisi completa

### 4. Esporta Dati

Clicca **"📥 Esporta"** per scaricare i risultati in CSV.

## 📊 Strumenti Analizzati

### US Tech Stocks (10)
- NVIDIA (NVDA)
- ARM Holdings (ARM)
- Alphabet (GOOGL)
- Meta (META)
- Apple (AAPL)
- Amazon (AMZN)
- Microsoft (MSFT)
- Netflix (NFLX)
- Tesla (TSLA)
- Alibaba (BABA)

### Indici Globali (7)
- S&P 500 (SPX)
- Nasdaq 100 (NDX)
- Germany 40 (DAX)
- UK 100 (FTSE)
- Netherlands 25 (AEX)
- Euro Stoxx 50 (EU50)
- Hong Kong 50 (HSI)

### Commodities (4)
- Gold (XAU)
- Silver (XAG)
- Crude Oil WTI (CL)
- Natural Gas (NG)

## 🎯 Azioni Consigliate

- **🟢🟢 STRONG BUY** (75-100% confidenza): Forte opportunità di acquisto
- **🟢 BUY** (60-74% confidenza): Opportunità di acquisto
- **🟡 HOLD** (40-59% confidenza): Attendere chiarimento
- **🔹 SELL** (25-39% confidenza): Segnale di vendita
- **🔴🔴 STRONG SELL** (0-24% confidenza): Forte segnale di vendita

## 📈 Indicatori Tecnici

### RSI (Relative Strength Index)
- Identifica condizioni di ipercomprato/ipervenduto
- Soglie: 80 (ipercomprato), 20 (ipervenduto)

### Bollinger Bands
- Analizza volatilità e posizione del prezzo
- Identifica supporti e resistenze dinamici

### MACD (Moving Average Convergence Divergence)
- Segnali di momentum e crossover
- Identifica cambio di trend

### EMA (Exponential Moving Average)
- Trend di lungo (200), medio (50), breve (20) termine
- Allineamento per trend forte

### ATR (Average True Range)
- Misura volatilità
- Calcola stop loss ottimali

### OBV (On Balance Volume)
- Analizza volumi per conferma trend
- Identifica accumulo/distribuzione

## 🔧 Struttura File

```
trading-bot-web/
├── index.html          # Interfaccia HTML
├── styles.css          # Stili CSS responsive
├── indicators.js       # Modulo indicatori tecnici
├── app.js             # Logica principale dell'app
└── README.md          # Questa documentazione
```

## 🌐 Pubblicazione Online

### Opzione 1: GitHub Pages

1. Crea un repository GitHub
2. Carica i file
3. Abilita GitHub Pages nelle impostazioni
4. Il sito sarà disponibile su `https://username.github.io/repository`

### Opzione 2: Netlify

1. Vai su [netlify.com](https://netlify.com)
2. Connetti il repository GitHub
3. Deploy automatico ad ogni push
4. URL pubblico generato automaticamente

### Opzione 3: Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Importa il progetto
3. Deploy con un click
4. URL pubblico istantaneo

### Opzione 4: Hosting Statico Generico

Carica i file su qualsiasi hosting web statico:
- Bluehost, GoDaddy, Hostinger, ecc.
- Tutti i file sono statici (HTML/CSS/JS)
- Nessun backend richiesto

## 💾 Persistenza Dati

L'applicazione utilizza **localStorage** del browser per salvare:
- Risultati delle analisi
- Timestamp dell'ultima analisi
- Preferenze utente

I dati rimangono disponibili anche dopo la chiusura del browser.

## ⚠️ Disclaimer

Questo strumento è fornito **solo a scopo educativo e informativo**.

- ❌ NON costituisce consulenza finanziaria
- ❌ NON garantisce profitti o risultati
- ❌ NON sostituisce l'analisi di un professionista
- ✅ Utilizzare solo per ricerca e apprendimento
- ✅ Fare sempre le proprie analisi
- ✅ Consultare un consulente finanziario qualificato

**Il trading comporta rischi significativi di perdita del capitale.**

## 🔄 Aggiornamento Dati

Per aggiornare l'analisi con dati più recenti:

1. Clicca **"⚡ Analizza Ora"** di nuovo
2. L'app recupererà i dati più recenti
3. I risultati verranno salvati automaticamente

## 📱 Compatibilità

- ✅ Chrome, Firefox, Safari, Edge (versioni recenti)
- ✅ Desktop, Tablet, Smartphone
- ✅ Windows, Mac, Linux
- ✅ Funziona offline dopo il primo caricamento (con dati in cache)

## 🎓 Interpretazione Segnali

### RSI
- **> 70**: Ipercomprato (possibile inversione)
- **< 30**: Ipervenduto (possibile rimbalzo)
- **50-70**: Momentum positivo
- **30-50**: Momentum negativo

### MACD
- **Bullish**: MACD > Signal Line
- **Bearish**: MACD < Signal Line
- **Crossover**: Cambio di trend

### EMA
- **Prezzo > EMA200**: Trend rialzista lungo termine
- **Prezzo > EMA50**: Trend rialzista medio termine
- **Prezzo > EMA20**: Trend rialzista breve termine

### Bollinger Bands
- **Prezzo > Upper**: Possibile resistenza
- **Prezzo < Lower**: Possibile supporto
- **Banda stretta**: Possibile espansione

## 🚀 Ottimizzazioni Future

- [ ] Grafici interattivi con TradingView Lightweight Charts
- [ ] Notifiche push per segnali importanti
- [ ] Storico analisi con trend
- [ ] Backtest strategie
- [ ] API backend per dati in tempo reale
- [ ] Autenticazione utente
- [ ] Portfolio tracking

## 📞 Supporto

Per domande o problemi:
1. Controlla la documentazione
2. Verifica la console del browser (F12) per errori
3. Assicurati di avere una connessione internet stabile

## 📝 Licenza

Questo progetto è fornito "as is" senza garanzie di alcun tipo.

---

**Buon Trading! 📈**

*Ricorda: Il trading è rischioso. Investi solo ciò che puoi permetterti di perdere.*

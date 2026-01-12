# 🔄 Guida Aggiornamento v2 - AI Trading Bot Web

Questo documento descrive i miglioramenti e le nuove funzionalità aggiunte alla versione 2 del sito.

## ✨ Nuove Funzionalità

### 1. 📊 Dati Reali da Yahoo Finance

**Prima:** Dati simulati per demo
**Ora:** Dati reali in tempo reale da Yahoo Finance

- Prezzo corrente aggiornato
- Variazione giornaliera con percentuale
- Ultimi 6 mesi di dati storici
- Supporto per 23 strumenti finanziari

### 2. 📈 Analisi Breve e Medio Termine

Ogni strumento ora include:

**Breve Termine (20 giorni):**
- Variazione percentuale
- Descrizione automatica del trend
- Analisi RSI
- Identificazione di ipercomprato/ipervenduto

**Medio Termine (60 giorni):**
- Variazione percentuale
- Allineamento EMA
- Trend di lungo termine
- Consolidamento vs. espansione

### 3. 🎯 Indicatori Dettagliati nella Scheda

Nella scheda di dettaglio di ogni strumento, ora troverai:

**Indicatori che Determinano la Decisione:**
- **RSI (14)**: Valore numerico + stato (Ipercomprato/Neutrale/Ipervenduto)
- **MACD**: Trend (Bullish/Bearish) + valore MACD
- **EMA Trend**: Allineamento + EMA200
- **Bollinger Bands**: Posizione + Bandwidth
- **ATR**: Volatilità + percentuale
- **OBV**: Trend (Accumulo/Distribuzione) + valore

Ogni indicatore mostra il valore specifico che contribuisce alla decisione finale.

### 4. 📰 Notizie in Tempo Reale

Ogni strumento include le ultime notizie del giorno:

- Titoli delle notizie più recenti
- Data e ora di pubblicazione
- Fonte della notizia
- Link alle notizie complete
- Aggiornamento automatico

**Nota:** Le notizie sono recuperate da NewsAPI. Attualmente usa la versione demo. Per notizie illimitate, registrati su [newsapi.org](https://newsapi.org) e sostituisci la chiave API.

### 5. 💰 Variazione Prezzo Giornaliera

Nella tabella principale e nelle card:

- Prezzo corrente
- Variazione in valore assoluto
- Variazione percentuale
- Colore verde per rialzi, rosso per ribassi
- Icone 📈 e 📉 per visualizzazione rapida

## 🔧 Implementazione Tecnica

### API Utilizzate

#### Yahoo Finance API
```
https://query1.finance.yahoo.com/v8/finance/chart/{symbol}
```
- Dati OHLCV (Open, High, Low, Close, Volume)
- Range: 6 mesi
- Intervallo: 1 giorno
- No authentication required (CORS enabled)

#### NewsAPI (Opzionale)
```
https://newsapi.org/v2/everything
```
- Notizie per simbolo
- Ordinamento: data di pubblicazione
- Lingua: italiano
- Attualmente: versione demo (5 notizie)

### Modifiche al Codice

**app.js - Nuove Funzioni:**

1. `fetchMarketData(symbol)` - Recupera dati reali da Yahoo Finance
2. `fetchNews(symbol)` - Recupera notizie da NewsAPI
3. `generateMockNews(symbol)` - Fallback con notizie simulate
4. `getShortTermDescription(change, rsi)` - Analisi breve termine
5. `getMediumTermDescription(change, ema)` - Analisi medio termine

**Struttura Dati Aggiornata:**

```javascript
{
    symbol: "NVDA",
    name: "NVIDIA",
    current_price: 123.45,
    price_change: 2.34,
    price_change_percent: 1.93,
    trend: "🟢 RIALZISTA",
    action: "BUY",
    confidence: 67,
    risk: "MEDIO",
    
    // Nuovo: Analisi breve termine
    short_term: {
        change: 5.23,
        description: "Trend rialzista forte. RSI a 65: Momentum positivo",
        period: "20 giorni"
    },
    
    // Nuovo: Analisi medio termine
    medium_term: {
        change: 12.45,
        description: "Trend rialzista. EMA strong_bullish: Consolidamento in rialzo.",
        period: "60 giorni"
    },
    
    // Nuovo: Notizie
    news: [
        {
            title: "NVIDIA raggiunge nuovi massimi",
            description: "...",
            url: "...",
            publishedAt: "2024-01-12T10:30:00Z",
            source: { name: "Market News" }
        }
    ],
    
    indicators: { /* ... */ },
    trading_levels: { /* ... */ }
}
```

## 📱 Interfaccia Aggiornata

### Tabella Principale
- Colonna "Variazione" con colore e percentuale
- Mostra i dati reali aggiornati

### Vista Card
- Aggiunta colonna "Variazione"
- Colore dinamico basato su rialzo/ribasso

### Scheda di Dettaglio
- **Sezione 1**: Informazioni generali + variazione giornaliera
- **Sezione 2**: Analisi breve termine (20 giorni)
- **Sezione 3**: Analisi medio termine (60 giorni)
- **Sezione 4**: Indicatori tecnici dettagliati
- **Sezione 5**: Notizie in tempo reale

## 🚀 Come Usare le Nuove Funzionalità

### 1. Dati Reali

Semplicemente clicca "⚡ Analizza Ora" come prima. Il sistema ora recupererà dati reali da Yahoo Finance.

### 2. Variazione Prezzo

Guarda la colonna "Variazione" nella tabella principale:
- Verde = Rialzo
- Rosso = Ribasso
- Percentuale = Variazione giornaliera

### 3. Analisi Breve/Medio Termine

Clicca su uno strumento per aprire la scheda:
1. Scorri fino a "Analisi Breve Termine"
2. Vedi la variazione degli ultimi 20 giorni
3. Leggi la descrizione automatica
4. Scorri fino a "Analisi Medio Termine"
5. Vedi la variazione degli ultimi 60 giorni

### 4. Indicatori Dettagliati

Nella stessa scheda, scorri fino a "Indicatori Tecnici che Determinano la Decisione":
- Ogni indicatore mostra il valore specifico
- Piccolo testo sotto spiega lo stato
- Contribuiscono al calcolo della confidenza

### 5. Notizie

Scorri fino a "Notizie in Tempo Reale":
- Ultime notizie del giorno
- Data e ora di pubblicazione
- Fonte della notizia
- Clicca per leggere l'articolo completo

## ⚙️ Configurazione Avanzata

### Cambiare il Range di Dati

In `app.js`, funzione `fetchMarketData()`:

```javascript
// Cambia da 6mo a 1y per un anno di dati
`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1y`
```

Opzioni: `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `2y`, `5y`, `10y`, `ytd`, `max`

### Attivare Notizie Reali

1. Vai su [newsapi.org](https://newsapi.org)
2. Registrati gratuitamente
3. Copia la tua API key
4. In `app.js`, funzione `fetchNews()`, sostituisci:

```javascript
// Vecchio
apiKey=demo

// Nuovo
apiKey=YOUR_API_KEY_HERE
```

### Personalizzare Periodi di Analisi

In `app.js`, funzione `analyzeSymbol()`:

```javascript
// Breve termine (attualmente 20 giorni)
const shortTermData = data.close.slice(-20);

// Medio termine (attualmente 60 giorni)
const mediumTermData = data.close.slice(-60);

// Cambia i numeri secondo le tue preferenze
```

### Aggiungere Nuovi Strumenti

In `app.js`, sezione `CONFIG`:

```javascript
CONFIG.SYMBOLS = {
    'US Tech Stocks': ['NVDA', 'ARM', 'GOOGL', /* ... */],
    'Nuova Categoria': ['NUOVO1', 'NUOVO2']  // Aggiungi qui
};

CONFIG.SYMBOL_NAMES = {
    'NUOVO1': 'Nome Completo',
    'NUOVO2': 'Nome Completo'
};
```

## 🐛 Troubleshooting

### "Dati insufficienti"
- Lo strumento potrebbe non avere 20 giorni di dati
- Prova con simboli più liquidi (AAPL, MSFT, ecc.)

### Notizie non compaiono
- NewsAPI potrebbe avere limitazioni
- Registrati su newsapi.org per accesso illimitato
- Controlla la console (F12) per errori

### Variazione prezzo non aggiornata
- Ricarica la pagina (F5)
- Clicca "Analizza Ora" di nuovo
- Verifica la connessione internet

### Indicatori mostrano valori strani
- Questo è normale se i dati sono limitati
- Aspetta che il sistema recuperi più dati
- Prova con un range di dati più lungo

## 📊 Interpretazione Indicatori

### RSI
- **> 70**: Ipercomprato (possibile inversione)
- **< 30**: Ipervenduto (possibile rimbalzo)
- **50-70**: Momentum positivo
- **30-50**: Momentum negativo

### MACD
- **Bullish**: MACD > Signal Line (rialzista)
- **Bearish**: MACD < Signal Line (ribassista)

### EMA Trend
- **strong_bullish**: Prezzo > EMA200 > EMA50 > EMA20
- **bullish**: Prezzo > EMA50 > EMA20
- **strong_bearish**: Prezzo < EMA200 < EMA50 < EMA20
- **bearish**: Prezzo < EMA50 < EMA20

### Bollinger Bands
- **above_upper**: Possibile resistenza
- **below_lower**: Possibile supporto
- **upper_half**: Forza rialzista
- **lower_half**: Debolezza ribassista

### ATR Volatilità
- **low**: < 1% (bassa volatilità)
- **medium**: 1-3% (media volatilità)
- **high**: > 3% (alta volatilità)

## 🔄 Aggiornamento da v1 a v2

Se hai già pubblicato la v1:

1. **Scarica i nuovi file:**
   - app.js (aggiornato)
   - index.html (aggiornato)

2. **Carica su GitHub/Netlify/Vercel:**
   - Sostituisci i file vecchi
   - Il sito si aggiornerà automaticamente

3. **Cancella la cache del browser:**
   - Premi Ctrl+Shift+Del (Windows) o Cmd+Shift+Del (Mac)
   - Seleziona "Cache" e "Cookie"
   - Ricarica il sito

4. **Verifica le nuove funzionalità:**
   - Clicca "Analizza Ora"
   - Controlla la variazione prezzo
   - Apri una scheda e scorri per vedere tutto

## 📞 Supporto

Se hai problemi:

1. Controlla la console del browser (F12 → Console)
2. Leggi i messaggi di errore
3. Verifica la connessione internet
4. Prova con un browser diverso
5. Cancella la cache e ricarica

## 🎉 Conclusione

La v2 del tuo AI Trading Bot è molto più potente e utile! Ora hai:

✅ Dati reali in tempo reale
✅ Analisi breve/medio termine
✅ Indicatori dettagliati
✅ Notizie aggiornate
✅ Visualizzazione migliorata

**Buon trading! 📈**

---

*Ricorda: Questo è uno strumento educativo. Non costituisce consulenza finanziaria.*

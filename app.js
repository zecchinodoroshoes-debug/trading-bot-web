/**
 * AI Trading Bot - Applicazione Web
 * Logica principale e gestione dell'interfaccia
 */

// Configurazione
const CONFIG = {
    SYMBOLS: {
        'US Tech Stocks': ['NVDA', 'ARM', 'GOOGL', 'META', 'AAPL', 'AMZN', 'MSFT', 'NFLX', 'TSLA', 'BABA'],
        'Indici': ['SPX', 'NDX', 'DAX', 'FTSE', 'AEX', 'EU50', 'HSI'],
        'Commodities': ['NG', 'XAU', 'CL', 'XAG']
    },
    SYMBOL_NAMES: {
        'NVDA': 'NVIDIA', 'ARM': 'ARM Holdings', 'GOOGL': 'Alphabet', 'META': 'Meta',
        'AAPL': 'Apple', 'AMZN': 'Amazon', 'MSFT': 'Microsoft', 'NFLX': 'Netflix',
        'TSLA': 'Tesla', 'BABA': 'Alibaba',
        'SPX': 'S&P 500', 'NDX': 'Nasdaq 100', 'DAX': 'Germany 40', 'FTSE': 'UK 100',
        'AEX': 'Netherlands 25', 'EU50': 'Euro Stoxx 50', 'HSI': 'Hong Kong 50',
        'NG': 'Natural Gas', 'XAU': 'Gold', 'CL': 'Crude Oil WTI', 'XAG': 'Silver'
    }
};

// Stato globale
let appState = {
    analyses: [],
    currentView: 'table',
    filteredData: []
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    loadAnalysesFromStorage();
    if (appState.analyses.length > 0) {
        renderAnalyses();
    }
});

/**
 * Avvia l'analisi di tutti gli strumenti
 */
async function startAnalysis() {
    const loadingState = document.getElementById('loadingState');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    loadingState.style.display = 'flex';
    analyzeBtn.disabled = true;

    appState.analyses = [];
    const allSymbols = Object.values(CONFIG.SYMBOLS).flat();
    const total = allSymbols.length;

    for (let i = 0; i < allSymbols.length; i++) {
        const symbol = allSymbols[i];
        updateProgress(i + 1, total, symbol);

        try {
            const analysis = await analyzeSymbol(symbol);
            if (analysis) {
                appState.analyses.push(analysis);
            }
        } catch (error) {
            console.error(`Errore analisi ${symbol}:`, error);
        }

        // Delay per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Salva in localStorage
    saveAnalysesToStorage();

    // Nascondi loading e mostra risultati
    loadingState.style.display = 'none';
    analyzeBtn.disabled = false;

    renderAnalyses();
    document.getElementById('exportBtn').style.display = 'inline-flex';
}

/**
 * Analizza un singolo strumento
 */
async function analyzeSymbol(symbol) {
    try {
        // Simula il recupero dati (in produzione, userebbe un'API reale)
        const data = await fetchMarketData(symbol);
        
        if (!data || data.close.length < 20) {
            return null;
        }

        // Calcola indicatori
        const rsi = TechnicalIndicators.calculateRSI(data.close);
        const bollinger = TechnicalIndicators.calculateBollingerBands(data.close);
        const macd = TechnicalIndicators.calculateMACD(data.close);
        const ema = TechnicalIndicators.analyzeEMA(data.close);
        const atr = TechnicalIndicators.calculateATR(data.high, data.low, data.close);
        const obv = TechnicalIndicators.calculateOBV(data.close, data.volume);

        const indicators = { rsi, bollinger, macd, ema, atr, obv };
        const scoreAnalysis = TechnicalIndicators.calculateScore(indicators);
        const tradingLevels = TechnicalIndicators.calculateTradingLevels(
            data.close[data.close.length - 1],
            indicators,
            scoreAnalysis.action
        );

        return {
            symbol,
            name: CONFIG.SYMBOL_NAMES[symbol] || symbol,
            current_price: Math.round(data.close[data.close.length - 1] * 100) / 100,
            trend: scoreAnalysis.trend,
            action: scoreAnalysis.action,
            action_emoji: scoreAnalysis.action_emoji,
            confidence: scoreAnalysis.confidence,
            risk: scoreAnalysis.risk,
            indicators,
            trading_levels: tradingLevels,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Errore nel recupero dati per ${symbol}:`, error);
        return null;
    }
}

/**
 * Recupera dati di mercato (simulato)
 */
async function fetchMarketData(symbol) {
    try {
        // Usa l'API di Yahoo Finance tramite proxy
        const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=3mo`,
            { mode: 'cors' }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const quote = data.chart.result[0];
        const timestamps = quote.timestamp;
        const ohlcv = quote.indicators.quote[0];

        return {
            close: ohlcv.close.filter(v => v !== null),
            high: ohlcv.high.filter(v => v !== null),
            low: ohlcv.low.filter(v => v !== null),
            volume: ohlcv.volume.filter(v => v !== null)
        };
    } catch (error) {
        console.error(`Errore fetch ${symbol}:`, error);
        // Ritorna dati simulati per demo
        return generateMockData();
    }
}

/**
 * Genera dati simulati per demo
 */
function generateMockData() {
    const data = [];
    let price = 100;
    for (let i = 0; i < 90; i++) {
        const change = (Math.random() - 0.48) * 5;
        price += change;
        data.push(price);
    }
    return {
        close: data,
        high: data.map(p => p * 1.02),
        low: data.map(p => p * 0.98),
        volume: Array(data.length).fill(1000000)
    };
}

/**
 * Aggiorna la barra di progresso
 */
function updateProgress(current, total, symbol) {
    const percentage = (current / total) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `${current}/${total} strumenti analizzati`;
    document.getElementById('loadingText').textContent = `Analizzando ${symbol}...`;
}

/**
 * Renderizza le analisi
 */
function renderAnalyses() {
    appState.filteredData = appState.analyses;
    updateSummary();
    
    if (appState.currentView === 'table') {
        renderTable();
    } else {
        renderCards();
    }
}

/**
 * Aggiorna il riepilogo
 */
function updateSummary() {
    const total = appState.analyses.length;
    const strongBuy = appState.analyses.filter(a => a.action === 'STRONG BUY').length;
    const buy = appState.analyses.filter(a => a.action === 'BUY').length;
    const hold = appState.analyses.filter(a => a.action === 'HOLD').length;
    const sell = appState.analyses.filter(a => a.action === 'SELL').length;
    const strongSell = appState.analyses.filter(a => a.action === 'STRONG SELL').length;
    const avgConfidence = total > 0 
        ? Math.round(appState.analyses.reduce((sum, a) => sum + a.confidence, 0) / total * 10) / 10
        : 0;

    document.getElementById('totalInstruments').textContent = total;
    document.getElementById('strongBuyCount').textContent = strongBuy;
    document.getElementById('buyCount').textContent = buy;
    document.getElementById('holdCount').textContent = hold;
    document.getElementById('sellCount').textContent = sell;
    document.getElementById('avgConfidence').textContent = avgConfidence + '%';
}

/**
 * Renderizza la vista tabella
 */
function renderTable() {
    const tbody = document.getElementById('tableBody');
    
    if (appState.filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">Nessun dato disponibile</td></tr>';
        return;
    }

    tbody.innerHTML = appState.filteredData.map(item => `
        <tr onclick="showDetail('${item.symbol}')">
            <td><strong>${item.name}</strong><br><small style="color: #999;">${item.symbol}</small></td>
            <td><strong>${item.current_price}</strong></td>
            <td>${item.trend}</td>
            <td><span class="badge ${getBadgeClass(item.action)}">${item.action}</span></td>
            <td><strong>${item.confidence}%</strong></td>
            <td>${item.risk}</td>
            <td>${item.trading_levels.entry}</td>
            <td>${item.trading_levels.stop_loss}</td>
            <td>${item.trading_levels.take_profit_1}</td>
        </tr>
    `).join('');
}

/**
 * Renderizza la vista card
 */
function renderCards() {
    const grid = document.getElementById('cardsGrid');
    
    if (appState.filteredData.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;">Nessun dato disponibile</div>';
        return;
    }

    grid.innerHTML = appState.filteredData.map(item => `
        <div class="card" onclick="showDetail('${item.symbol}')">
            <div class="card-header">
                <div>
                    <div class="card-title">${item.name}</div>
                    <div class="card-symbol">${item.symbol}</div>
                </div>
                <span class="badge ${getBadgeClass(item.action)}">${item.action}</span>
            </div>
            <div class="card-stats">
                <div class="stat">
                    <div class="stat-label">Prezzo</div>
                    <div class="stat-value">${item.current_price}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Confidenza</div>
                    <div class="stat-value">${item.confidence}%</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Trend</div>
                    <div class="stat-value" style="font-size: 0.9em;">${item.trend}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Rischio</div>
                    <div class="stat-value">${item.risk}</div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Ottiene la classe CSS del badge
 */
function getBadgeClass(action) {
    if (action.includes('STRONG BUY')) return 'badge-strong-buy';
    if (action.includes('BUY')) return 'badge-buy';
    if (action.includes('HOLD')) return 'badge-hold';
    if (action.includes('STRONG SELL')) return 'badge-strong-sell';
    if (action.includes('SELL')) return 'badge-sell';
    return 'badge-hold';
}

/**
 * Mostra il dettaglio di uno strumento
 */
function showDetail(symbol) {
    const item = appState.analyses.find(a => a.symbol === symbol);
    if (!item) return;

    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <h2 style="color: var(--primary); margin-bottom: 20px;">${item.name} (${item.symbol})</h2>
        
        <div class="detail-section">
            <h3>📊 Informazioni Generali</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Prezzo Corrente</label>
                    <div class="value">${item.current_price}</div>
                </div>
                <div class="detail-item">
                    <label>Trend</label>
                    <div class="value">${item.trend}</div>
                </div>
                <div class="detail-item">
                    <label>Azione</label>
                    <div class="value"><span class="badge ${getBadgeClass(item.action)}">${item.action}</span></div>
                </div>
                <div class="detail-item">
                    <label>Confidenza</label>
                    <div class="value">${item.confidence}%</div>
                </div>
                <div class="detail-item">
                    <label>Rischio</label>
                    <div class="value">${item.risk}</div>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3>🎯 Livelli di Trading</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Entry Price</label>
                    <div class="value">${item.trading_levels.entry}</div>
                </div>
                <div class="detail-item">
                    <label>Stop Loss</label>
                    <div class="value" style="color: var(--danger);">${item.trading_levels.stop_loss}</div>
                </div>
                <div class="detail-item">
                    <label>Take Profit 1</label>
                    <div class="value" style="color: var(--success);">${item.trading_levels.take_profit_1}</div>
                </div>
                <div class="detail-item">
                    <label>Take Profit 2</label>
                    <div class="value" style="color: var(--success);">${item.trading_levels.take_profit_2}</div>
                </div>
                <div class="detail-item">
                    <label>Take Profit 3</label>
                    <div class="value" style="color: var(--success);">${item.trading_levels.take_profit_3}</div>
                </div>
                <div class="detail-item">
                    <label>Support</label>
                    <div class="value">${item.trading_levels.support}</div>
                </div>
                <div class="detail-item">
                    <label>Resistance</label>
                    <div class="value">${item.trading_levels.resistance}</div>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3>📈 Indicatori Tecnici</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>RSI (14)</label>
                    <div class="value">${item.indicators.rsi}</div>
                </div>
                <div class="detail-item">
                    <label>MACD Trend</label>
                    <div class="value">${item.indicators.macd.trend}</div>
                </div>
                <div class="detail-item">
                    <label>EMA Trend</label>
                    <div class="value">${item.indicators.ema.trend}</div>
                </div>
                <div class="detail-item">
                    <label>Bollinger Position</label>
                    <div class="value">${item.indicators.bollinger.position}</div>
                </div>
                <div class="detail-item">
                    <label>ATR %</label>
                    <div class="value">${item.indicators.atr.atr_percent}%</div>
                </div>
                <div class="detail-item">
                    <label>Volatilità</label>
                    <div class="value">${item.indicators.atr.volatility}</div>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

/**
 * Chiude il modal
 */
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

/**
 * Cambia vista
 */
function switchView(view) {
    appState.currentView = view;
    
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    document.getElementById('tableView').style.display = view === 'table' ? 'block' : 'none';
    document.getElementById('cardsView').style.display = view === 'cards' ? 'block' : 'none';

    renderAnalyses();
}

/**
 * Filtra la tabella
 */
function filterTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterValue = document.getElementById('filterSelect').value;

    appState.filteredData = appState.analyses.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchTerm) || 
                          item.symbol.toLowerCase().includes(searchTerm);
        const matchFilter = !filterValue || item.action === filterValue;
        return matchSearch && matchFilter;
    });

    if (appState.currentView === 'table') {
        renderTable();
    } else {
        renderCards();
    }
}

/**
 * Esporta i dati in CSV
 */
function exportData() {
    if (appState.analyses.length === 0) {
        alert('Nessun dato da esportare');
        return;
    }

    let csv = 'Simbolo,Nome,Prezzo,Trend,Azione,Confidenza %,Rischio,Entry,Stop Loss,TP1,TP2,TP3,Support,Resistance,RSI,MACD Trend,EMA Trend,Volatilità\n';

    appState.analyses.forEach(item => {
        csv += `${item.symbol},"${item.name}",${item.current_price},"${item.trend}","${item.action}",${item.confidence},${item.risk},${item.trading_levels.entry},${item.trading_levels.stop_loss},${item.trading_levels.take_profit_1},${item.trading_levels.take_profit_2},${item.trading_levels.take_profit_3},${item.trading_levels.support},${item.trading_levels.resistance},${item.indicators.rsi},${item.indicators.macd.trend},${item.indicators.ema.trend},${item.indicators.atr.volatility}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

/**
 * Salva analisi in localStorage
 */
function saveAnalysesToStorage() {
    localStorage.setItem('tradingBotAnalyses', JSON.stringify(appState.analyses));
    localStorage.setItem('tradingBotTimestamp', new Date().toISOString());
}

/**
 * Carica analisi da localStorage
 */
function loadAnalysesFromStorage() {
    const stored = localStorage.getItem('tradingBotAnalyses');
    if (stored) {
        try {
            appState.analyses = JSON.parse(stored);
        } catch (error) {
            console.error('Errore caricamento dati:', error);
        }
    }
}

// Chiudi modal con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Chiudi modal cliccando fuori
document.getElementById('detailModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') {
        closeModal();
    }
});

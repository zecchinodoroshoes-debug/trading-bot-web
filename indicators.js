/**
 * Modulo Indicatori Tecnici
 * Implementa: RSI, Bollinger Bands, MACD, EMA, ATR, OBV
 */

class TechnicalIndicators {
    /**
     * Calcola RSI (Relative Strength Index)
     */
    static calculateRSI(data, period = 14) {
        if (data.length < period + 1) return 50;

        const deltas = [];
        for (let i = 1; i < data.length; i++) {
            deltas.push(data[i] - data[i - 1]);
        }

        const gains = deltas.slice(-period).filter(d => d > 0).reduce((a, b) => a + b, 0) / period;
        const losses = deltas.slice(-period).filter(d => d < 0).reduce((a, b) => a - b, 0) / period;

        if (losses === 0) return 100;

        const rs = gains / losses;
        const rsi = 100 - (100 / (1 + rs));

        return Math.round(rsi * 100) / 100;
    }

    /**
     * Calcola Bollinger Bands
     */
    static calculateBollingerBands(data, period = 20, stdDev = 2) {
        if (data.length < period) {
            const current = data[data.length - 1];
            return {
                upper: current * 1.02,
                middle: current,
                lower: current * 0.98,
                position: 'middle',
                bandwidth: 4
            };
        }

        const slice = data.slice(-period);
        const middle = slice.reduce((a, b) => a + b, 0) / period;
        const variance = slice.reduce((sum, val) => sum + Math.pow(val - middle, 2), 0) / period;
        const std = Math.sqrt(variance);

        const upper = middle + (stdDev * std);
        const lower = middle - (stdDev * std);
        const current = data[data.length - 1];

        let position = 'middle';
        if (current > upper) position = 'above_upper';
        else if (current < lower) position = 'below_lower';
        else if (current > middle) position = 'upper_half';
        else position = 'lower_half';

        const bandwidth = ((upper - lower) / middle) * 100;

        return {
            upper: Math.round(upper * 100) / 100,
            middle: Math.round(middle * 100) / 100,
            lower: Math.round(lower * 100) / 100,
            position,
            bandwidth: Math.round(bandwidth * 100) / 100
        };
    }

    /**
     * Calcola MACD
     */
    static calculateMACD(data, fast = 12, slow = 26, signal = 9) {
        if (data.length < slow + signal) {
            return {
                macd: 0,
                signal: 0,
                histogram: 0,
                trend: 'neutral'
            };
        }

        const emaFast = this.calculateEMA(data, fast);
        const emaSlow = this.calculateEMA(data, slow);

        const macdLine = [];
        for (let i = 0; i < emaFast.length; i++) {
            macdLine.push(emaFast[i] - emaSlow[i]);
        }

        const signalLine = this.calculateEMA(macdLine, signal);
        const histogram = [];
        for (let i = 0; i < macdLine.length; i++) {
            histogram.push(macdLine[i] - signalLine[i]);
        }

        const macdVal = macdLine[macdLine.length - 1];
        const signalVal = signalLine[signalLine.length - 1];
        const histVal = histogram[histogram.length - 1];

        let trend = 'neutral';
        if (macdVal > signalVal && histVal > 0) trend = 'bullish';
        else if (macdVal < signalVal && histVal < 0) trend = 'bearish';

        return {
            macd: Math.round(macdVal * 10000) / 10000,
            signal: Math.round(signalVal * 10000) / 10000,
            histogram: Math.round(histVal * 10000) / 10000,
            trend
        };
    }

    /**
     * Calcola EMA (Exponential Moving Average)
     */
    static calculateEMA(data, period) {
        if (data.length < period) return data;

        const k = 2 / (period + 1);
        const ema = [data.slice(0, period).reduce((a, b) => a + b, 0) / period];

        for (let i = period; i < data.length; i++) {
            ema.push(data[i] * k + ema[ema.length - 1] * (1 - k));
        }

        return ema;
    }

    /**
     * Calcola EMAs multiple e analizza trend
     */
    static analyzeEMA(data, periods = [20, 50, 200]) {
        const current = data[data.length - 1];
        const emas = {};

        for (const period of periods) {
            if (data.length >= period) {
                const emaValues = this.calculateEMA(data, period);
                emas[`ema_${period}`] = Math.round(emaValues[emaValues.length - 1] * 100) / 100;
            } else {
                emas[`ema_${period}`] = current;
            }
        }

        const above200 = current > emas.ema_200;
        const above50 = current > emas.ema_50;
        const above20 = current > emas.ema_20;

        let trend = 'neutral';
        if (above200 && above50 && above20) trend = 'strong_bullish';
        else if (above50 && above20) trend = 'bullish';
        else if (!above200 && !above50 && !above20) trend = 'strong_bearish';
        else if (!above50 && !above20) trend = 'bearish';

        return {
            ...emas,
            current_price: Math.round(current * 100) / 100,
            trend
        };
    }

    /**
     * Calcola ATR (Average True Range)
     */
    static calculateATR(high, low, close, period = 14) {
        if (high.length < period + 1) {
            return {
                atr: 0,
                atr_percent: 0,
                volatility: 'low'
            };
        }

        const trList = [];
        for (let i = 1; i < high.length; i++) {
            const hl = high[i] - low[i];
            const hc = Math.abs(high[i] - close[i - 1]);
            const lc = Math.abs(low[i] - close[i - 1]);
            trList.push(Math.max(hl, hc, lc));
        }

        const atr = trList.slice(-period).reduce((a, b) => a + b, 0) / period;
        const currentPrice = close[close.length - 1];
        const atrPercent = (atr / currentPrice) * 100;

        let volatility = 'low';
        if (atrPercent > 3) volatility = 'high';
        else if (atrPercent > 1) volatility = 'medium';

        return {
            atr: Math.round(atr * 100) / 100,
            atr_percent: Math.round(atrPercent * 100) / 100,
            volatility
        };
    }

    /**
     * Calcola OBV (On Balance Volume)
     */
    static calculateOBV(close, volume) {
        if (close.length < 2) {
            return { obv: 0, trend: 'neutral' };
        }

        const obv = [0];
        for (let i = 1; i < close.length; i++) {
            if (close[i] > close[i - 1]) {
                obv.push(obv[obv.length - 1] + volume[i]);
            } else if (close[i] < close[i - 1]) {
                obv.push(obv[obv.length - 1] - volume[i]);
            } else {
                obv.push(obv[obv.length - 1]);
            }
        }

        let trend = 'neutral';
        if (obv.length >= 10) {
            const recent = obv.slice(-10);
            if (recent[recent.length - 1] > recent[0]) trend = 'accumulation';
            else if (recent[recent.length - 1] < recent[0]) trend = 'distribution';
        }

        return {
            obv: Math.round(obv[obv.length - 1]),
            trend
        };
    }

    /**
     * Calcola score complessivo
     */
    static calculateScore(indicators) {
        let score = 0;
        const maxScore = 100;

        // RSI (20 punti)
        const rsi = indicators.rsi;
        if (rsi > 70) score += 5;
        else if (rsi > 50) score += 15;
        else if (rsi > 30) score += 10;
        else score += 18;

        // MACD (20 punti)
        const macd = indicators.macd;
        if (macd.trend === 'bullish') score += 20;
        else if (macd.trend === 'bearish') score += 5;
        else score += 12;

        // EMA (20 punti)
        const ema = indicators.ema;
        if (ema.trend === 'strong_bullish') score += 20;
        else if (ema.trend === 'bullish') score += 15;
        else if (ema.trend === 'strong_bearish') score += 5;
        else if (ema.trend === 'bearish') score += 8;
        else score += 12;

        // Bollinger (15 punti)
        const bb = indicators.bollinger;
        if (bb.position === 'below_lower') score += 15;
        else if (bb.position === 'upper_half') score += 12;
        else if (bb.position === 'above_upper') score += 5;
        else score += 10;

        // OBV (15 punti)
        const obv = indicators.obv;
        if (obv.trend === 'accumulation') score += 15;
        else if (obv.trend === 'distribution') score += 5;
        else score += 10;

        // ATR (10 punti)
        const atr = indicators.atr;
        if (atr.volatility === 'low') score += 10;
        else if (atr.volatility === 'medium') score += 7;
        else score += 4;

        const confidence = Math.round((score / maxScore) * 1000) / 10;

        let action = 'HOLD';
        let emoji = '🟡';
        if (confidence >= 75) {
            action = 'STRONG BUY';
            emoji = '🟢🟢';
        } else if (confidence >= 60) {
            action = 'BUY';
            emoji = '🟢';
        } else if (confidence >= 40) {
            action = 'HOLD';
            emoji = '🟡';
        } else if (confidence >= 25) {
            action = 'SELL';
            emoji = '🔹';
        } else {
            action = 'STRONG SELL';
            emoji = '🔴🔴';
        }

        let trend = '🟡 NEUTRALE';
        if (confidence >= 70) trend = '🟢 RIALZISTA FORTE';
        else if (confidence >= 55) trend = '🟢 RIALZISTA';
        else if (confidence >= 45) trend = '🟡 NEUTRALE';
        else if (confidence >= 30) trend = '🔴 RIBASSISTA';
        else trend = '🔴 RIBASSISTA FORTE';

        let risk = 'BASSO';
        if (atr.volatility === 'high') risk = 'ALTO';
        else if (atr.volatility === 'medium') risk = 'MEDIO';

        return {
            score,
            confidence,
            action,
            action_emoji: emoji,
            trend,
            risk
        };
    }

    /**
     * Calcola livelli di trading
     */
    static calculateTradingLevels(currentPrice, indicators, action) {
        const atr = indicators.atr.atr;
        const bb = indicators.bollinger;
        const ema = indicators.ema;

        let entry = currentPrice;
        if (action.includes('BUY')) {
            entry = currentPrice * 0.995;
        }

        let stopLoss;
        if (action.includes('BUY') || action === 'HOLD') {
            stopLoss = Math.max(
                currentPrice - (atr * 2),
                bb.lower,
                ema.ema_20 * 0.95
            );
        } else {
            stopLoss = Math.min(
                currentPrice + (atr * 2),
                bb.upper,
                ema.ema_20 * 1.05
            );
        }

        const risk = Math.abs(currentPrice - stopLoss);

        let tp1, tp2, tp3;
        if (action.includes('BUY')) {
            tp1 = currentPrice + (risk * 1.5);
            tp2 = currentPrice + (risk * 2.0);
            tp3 = currentPrice + (risk * 3.0);
        } else {
            tp1 = currentPrice - (risk * 1.5);
            tp2 = currentPrice - (risk * 2.0);
            tp3 = currentPrice - (risk * 3.0);
        }

        const support = Math.min(bb.lower, ema.ema_50 * 0.95);
        const resistance = Math.max(bb.upper, ema.ema_50 * 1.05);

        return {
            entry: Math.round(entry * 100) / 100,
            stop_loss: Math.round(stopLoss * 100) / 100,
            take_profit_1: Math.round(tp1 * 100) / 100,
            take_profit_2: Math.round(tp2 * 100) / 100,
            take_profit_3: Math.round(tp3 * 100) / 100,
            support: Math.round(support * 100) / 100,
            resistance: Math.round(resistance * 100) / 100
        };
    }
}

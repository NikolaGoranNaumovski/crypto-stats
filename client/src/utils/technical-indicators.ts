// Technical Analysis Indicators for Cryptocurrency Trading

export interface PriceData {
  date: string;
  price: number;
  volume?: number;
}

export interface IndicatorResult {
  name: string;
  value: number | string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  strength: number; // 0-100
}

export interface TechnicalAnalysisResult {
  oscillators: IndicatorResult[];
  movingAverages: IndicatorResult[];
  overallSignal: 'BUY' | 'SELL' | 'HOLD';
  buyCount: number;
  sellCount: number;
  holdCount: number;
}

// ==================== OSCILLATORS ====================

/**
 * RSI (Relative Strength Index)
 * Measures momentum on a scale of 0-100
 * < 30: Oversold (BUY signal)
 * > 70: Overbought (SELL signal)
 * 30-70: HOLD
 */
export function calculateRSI(data: PriceData[], period: number = 14): IndicatorResult {
  if (data.length < period + 1) {
    return { name: 'RSI', value: 'N/A', signal: 'HOLD', strength: 50 };
  }

  const prices = data.map(d => d.price);
  let gains = 0;
  let losses = 0;

  // Calculate initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Calculate RSI using smoothed averages
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
    }
  }

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let strength = 50;

  if (rsi < 30) {
    signal = 'BUY';
    strength = Math.round((30 - rsi) * 2.33 + 50); // 0-30 maps to 50-100
  } else if (rsi > 70) {
    signal = 'SELL';
    strength = Math.round((rsi - 70) * 1.67 + 50); // 70-100 maps to 50-100
  } else {
    strength = 50 - Math.abs(rsi - 50);
  }

  return {
    name: 'RSI',
    value: rsi.toFixed(2),
    signal,
    strength: Math.min(100, Math.max(0, strength))
  };
}

/**
 * MACD (Moving Average Convergence Divergence)
 * Trend-following momentum indicator
 */
export function calculateMACD(data: PriceData[]): IndicatorResult {
  if (data.length < 26) {
    return { name: 'MACD', value: 'N/A', signal: 'HOLD', strength: 50 };
  }

  const prices = data.map(d => d.price);
  
  // Calculate EMA12 and EMA26
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  
  const macdLine = ema12 - ema26;
  
  // Calculate signal line (9-period EMA of MACD)
  const macdHistory: number[] = [];
  for (let i = 26; i < prices.length; i++) {
    const e12 = calculateEMA(prices.slice(0, i + 1), 12);
    const e26 = calculateEMA(prices.slice(0, i + 1), 26);
    macdHistory.push(e12 - e26);
  }
  
  const signalLine = calculateEMA(macdHistory, 9);
  const histogram = macdLine - signalLine;
  
  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let strength = 50;
  
  if (histogram > 0 && macdLine > signalLine) {
    signal = 'BUY';
    strength = Math.min(100, 50 + Math.abs(histogram) * 10);
  } else if (histogram < 0 && macdLine < signalLine) {
    signal = 'SELL';
    strength = Math.min(100, 50 + Math.abs(histogram) * 10);
  }

  return {
    name: 'MACD',
    value: macdLine.toFixed(2),
    signal,
    strength
  };
}

/**
 * Stochastic Oscillator
 * Compares closing price to price range over a period
 * %K < 20: Oversold (BUY)
 * %K > 80: Overbought (SELL)
 */
export function calculateStochastic(data: PriceData[], period: number = 14): IndicatorResult {
  if (data.length < period) {
    return { name: 'Stochastic', value: 'N/A', signal: 'HOLD', strength: 50 };
  }

  const prices = data.map(d => d.price);
  const recentPrices = prices.slice(-period);
  const currentPrice = prices[prices.length - 1];
  const lowest = Math.min(...recentPrices);
  const highest = Math.max(...recentPrices);

  const percentK = highest === lowest ? 50 : ((currentPrice - lowest) / (highest - lowest)) * 100;

  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let strength = 50;

  if (percentK < 20) {
    signal = 'BUY';
    strength = Math.round((20 - percentK) * 2.5 + 50);
  } else if (percentK > 80) {
    signal = 'SELL';
    strength = Math.round((percentK - 80) * 2.5 + 50);
  } else {
    strength = 50 - Math.abs(percentK - 50) * 0.5;
  }

  return {
    name: 'Stochastic',
    value: percentK.toFixed(2),
    signal,
    strength: Math.min(100, Math.max(0, strength))
  };
}

/**
 * ADX (Average Directional Index)
 * Measures trend strength (not direction)
 * < 25: Weak trend
 * 25-50: Strong trend
 * > 50: Very strong trend
 */
export function calculateADX(data: PriceData[], period: number = 14): IndicatorResult {
  if (data.length < period + 1) {
    return { name: 'ADX', value: 'N/A', signal: 'HOLD', strength: 50 };
  }

  const prices = data.map(d => d.price);
  let plusDM = 0;
  let minusDM = 0;
  let tr = 0;

  for (let i = 1; i < Math.min(period + 1, prices.length); i++) {
    const high = Math.max(prices[i], prices[i - 1]);
    const low = Math.min(prices[i], prices[i - 1]);
    const trueRange = high - low;
    
    tr += trueRange;
    
    const upMove = prices[i] - prices[i - 1];
    const downMove = prices[i - 1] - prices[i];
    
    if (upMove > downMove && upMove > 0) plusDM += upMove;
    if (downMove > upMove && downMove > 0) minusDM += downMove;
  }

  const plusDI = (plusDM / tr) * 100;
  const minusDI = (minusDM / tr) * 100;
  const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
  
  // Simplified ADX calculation
  const adx = dx;

  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  const strength = Math.min(100, adx);

  if (adx > 25 && plusDI > minusDI) {
    signal = 'BUY';
  } else if (adx > 25 && minusDI > plusDI) {
    signal = 'SELL';
  }

  return {
    name: 'ADX',
    value: adx.toFixed(2),
    signal,
    strength
  };
}

/**
 * CCI (Commodity Channel Index)
 * Measures deviation from average price
 * > +100: Overbought (SELL)
 * < -100: Oversold (BUY)
 */
export function calculateCCI(data: PriceData[], period: number = 20): IndicatorResult {
  if (data.length < period) {
    return { name: 'CCI', value: 'N/A', signal: 'HOLD', strength: 50 };
  }

  const prices = data.map(d => d.price);
  const recentPrices = prices.slice(-period);
  const typicalPrice = prices[prices.length - 1]; // Simplified: using close price
  const sma = recentPrices.reduce((sum, p) => sum + p, 0) / period;
  
  const meanDeviation = recentPrices.reduce((sum, p) => sum + Math.abs(p - sma), 0) / period;
  const cci = (typicalPrice - sma) / (0.015 * meanDeviation);

  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let strength = 50;

  if (cci < -100) {
    signal = 'BUY';
    strength = Math.min(100, 50 + Math.abs(cci + 100) * 0.2);
  } else if (cci > 100) {
    signal = 'SELL';
    strength = Math.min(100, 50 + (cci - 100) * 0.2);
  } else {
    strength = 50 - Math.abs(cci) * 0.25;
  }

  return {
    name: 'CCI',
    value: cci.toFixed(2),
    signal,
    strength: Math.min(100, Math.max(0, strength))
  };
}

// ==================== MOVING AVERAGES ====================

/**
 * Helper function to calculate EMA
 */
function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];
  
  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((sum, p) => sum + p, 0) / period;
  
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  
  return ema;
}

/**
 * SMA (Simple Moving Average)
 */
export function calculateSMA(data: PriceData[], period: number = 20): IndicatorResult {
  if (data.length < period) {
    return { name: `SMA(${period})`, value: 'N/A', signal: 'HOLD', strength: 50 };
  }

  const prices = data.map(d => d.price);
  const sma = prices.slice(-period).reduce((sum, p) => sum + p, 0) / period;
  const currentPrice = prices[prices.length - 1];

  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  const deviation = ((currentPrice - sma) / sma) * 100;
  let strength = 50;

  if (currentPrice > sma) {
    signal = 'BUY';
    strength = Math.min(100, 50 + Math.abs(deviation) * 5);
  } else if (currentPrice < sma) {
    signal = 'SELL';
    strength = Math.min(100, 50 + Math.abs(deviation) * 5);
  }

  return {
    name: `SMA(${period})`,
    value: sma.toFixed(2),
    signal,
    strength
  };
}

/**
 * EMA (Exponential Moving Average)
 */
export function calculateEMAIndicator(data: PriceData[], period: number = 20): IndicatorResult {
  if (data.length < period) {
    return { name: `EMA(${period})`, value: 'N/A', signal: 'HOLD', strength: 50 };
  }

  const prices = data.map(d => d.price);
  const ema = calculateEMA(prices, period);
  const currentPrice = prices[prices.length - 1];

  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  const deviation = ((currentPrice - ema) / ema) * 100;
  let strength = 50;

  if (currentPrice > ema) {
    signal = 'BUY';
    strength = Math.min(100, 50 + Math.abs(deviation) * 5);
  } else if (currentPrice < ema) {
    signal = 'SELL';
    strength = Math.min(100, 50 + Math.abs(deviation) * 5);
  }

  return {
    name: `EMA(${period})`,
    value: ema.toFixed(2),
    signal,
    strength
  };
}

/**
 * WMA (Weighted Moving Average)
 */
export function calculateWMA(data: PriceData[], period: number = 20): IndicatorResult {
  if (data.length < period) {
    return { name: `WMA(${period})`, value: 'N/A', signal: 'HOLD', strength: 50 };
  }

  const prices = data.map(d => d.price);
  const recentPrices = prices.slice(-period);
  
  let weightedSum = 0;
  let weightSum = 0;
  
  for (let i = 0; i < recentPrices.length; i++) {
    const weight = i + 1;
    weightedSum += recentPrices[i] * weight;
    weightSum += weight;
  }
  
  const wma = weightedSum / weightSum;
  const currentPrice = prices[prices.length - 1];

  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  const deviation = ((currentPrice - wma) / wma) * 100;
  let strength = 50;

  if (currentPrice > wma) {
    signal = 'BUY';
    strength = Math.min(100, 50 + Math.abs(deviation) * 5);
  } else if (currentPrice < wma) {
    signal = 'SELL';
    strength = Math.min(100, 50 + Math.abs(deviation) * 5);
  }

  return {
    name: `WMA(${period})`,
    value: wma.toFixed(2),
    signal,
    strength
  };
}

/**
 * Bollinger Bands
 * Price channel with upper and lower bands
 */
export function calculateBollingerBands(data: PriceData[], period: number = 20, stdDev: number = 2): IndicatorResult {
  if (data.length < period) {
    return { name: 'Bollinger Bands', value: 'N/A', signal: 'HOLD', strength: 50 };
  }

  const prices = data.map(d => d.price);
  const recentPrices = prices.slice(-period);
  const sma = recentPrices.reduce((sum, p) => sum + p, 0) / period;
  
  const variance = recentPrices.reduce((sum, p) => sum + Math.pow(p - sma, 2), 0) / period;
  const standardDeviation = Math.sqrt(variance);
  
  const upperBand = sma + (stdDev * standardDeviation);
  const lowerBand = sma - (stdDev * standardDeviation);
  const currentPrice = prices[prices.length - 1];

  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let strength = 50;

  if (currentPrice <= lowerBand) {
    signal = 'BUY';
    strength = Math.min(100, 50 + ((lowerBand - currentPrice) / lowerBand) * 500);
  } else if (currentPrice >= upperBand) {
    signal = 'SELL';
    strength = Math.min(100, 50 + ((currentPrice - upperBand) / upperBand) * 500);
  } else {
    // Price between bands
    const bandWidth = upperBand - lowerBand;
    const position = (currentPrice - lowerBand) / bandWidth;
    if (position > 0.6) {
      signal = 'SELL';
      strength = Math.min(80, 50 + (position - 0.6) * 125);
    } else if (position < 0.4) {
      signal = 'BUY';
      strength = Math.min(80, 50 + (0.4 - position) * 125);
    }
  }

  return {
    name: 'Bollinger Bands',
    value: `${lowerBand.toFixed(2)} / ${upperBand.toFixed(2)}`,
    signal,
    strength
  };
}

/**
 * Volume Moving Average
 */
export function calculateVolumeMA(data: PriceData[], period: number = 20): IndicatorResult {
  if (data.length < period) {
    return { name: `Volume MA(${period})`, value: 'N/A', signal: 'HOLD', strength: 50 };
  }

  // Generate mock volume data based on price volatility
  const volumes = data.map((d, i) => {
    if (i === 0) return 1000000;
    const priceChange = Math.abs(d.price - data[i - 1].price) / data[i - 1].price;
    return 1000000 * (1 + priceChange * 10);
  });

  const recentVolumes = volumes.slice(-period);
  const volumeMA = recentVolumes.reduce((sum, v) => sum + v, 0) / period;
  const currentVolume = volumes[volumes.length - 1];

  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let strength = 50;

  const volumeRatio = currentVolume / volumeMA;
  
  if (volumeRatio > 1.5) {
    // High volume - check price trend
    const priceChange = data[data.length - 1].price - data[data.length - 2].price;
    signal = priceChange > 0 ? 'BUY' : 'SELL';
    strength = Math.min(100, 50 + (volumeRatio - 1) * 50);
  } else if (volumeRatio < 0.7) {
    signal = 'HOLD';
    strength = 30;
  }

  return {
    name: `Volume MA(${period})`,
    value: (currentVolume / 1000000).toFixed(2) + 'M',
    signal,
    strength
  };
}

// ==================== ANALYSIS AGGREGATION ====================

/**
 * Perform complete technical analysis
 */
export function performTechnicalAnalysis(data: PriceData[]): TechnicalAnalysisResult {
  // Calculate all oscillators
  const oscillators: IndicatorResult[] = [
    calculateRSI(data),
    calculateMACD(data),
    calculateStochastic(data),
    calculateADX(data),
    calculateCCI(data),
  ];

  // Calculate all moving averages
  const movingAverages: IndicatorResult[] = [
    calculateSMA(data, 20),
    calculateEMAIndicator(data, 20),
    calculateWMA(data, 20),
    calculateBollingerBands(data),
    calculateVolumeMA(data),
  ];

  // Count signals
  const allIndicators = [...oscillators, ...movingAverages];
  const buyCount = allIndicators.filter(i => i.signal === 'BUY').length;
  const sellCount = allIndicators.filter(i => i.signal === 'SELL').length;
  const holdCount = allIndicators.filter(i => i.signal === 'HOLD').length;

  // Determine overall signal
  let overallSignal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  if (buyCount > sellCount && buyCount > holdCount) {
    overallSignal = 'BUY';
  } else if (sellCount > buyCount && sellCount > holdCount) {
    overallSignal = 'SELL';
  }

  return {
    oscillators,
    movingAverages,
    overallSignal,
    buyCount,
    sellCount,
    holdCount,
  };
}

interface ChartDataPoint {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

type TimeRange = 'daily' | 'monthly' | 'quarterly' | 'yearly' | 'all';

const basePrice: Record<string, number> = {
  BTC: 43250.75,
  ETH: 2285.32,
  BNB: 312.45,
  ADA: 0.52,
  SOL: 64.89,
  XRP: 0.58,
  DOT: 7.23,
  DOGE: 0.089,
  AVAX: 21.45,
  LINK: 14.67,
  MATIC: 0.82,
  LTC: 73.21,
  UNI: 6.34,
  XLM: 0.13,
  ATOM: 9.87,
  XMR: 156.43,
  ALGO: 0.19,
  VET: 0.025,
  XTZ: 1.02,
  HBAR: 0.067,
};

export function generateChartData(symbol: string, timeRange: TimeRange): ChartDataPoint[] {
  const price = basePrice[symbol] || 100;
  let dataPoints = 0;
  let dateFormat: 'hour' | 'day' | 'month' = 'day';

  switch (timeRange) {
    case 'daily':
      dataPoints = 24; // hourly data
      dateFormat = 'hour';
      break;
    case 'monthly':
      dataPoints = 30; // daily data
      dateFormat = 'day';
      break;
    case 'quarterly':
      dataPoints = 90; // daily data
      dateFormat = 'day';
      break;
    case 'yearly':
      dataPoints = 365; // daily data
      dateFormat = 'day';
      break;
    case 'all':
      dataPoints = 60; // monthly data for 5 years
      dateFormat = 'month';
      break;
  }

  const data: ChartDataPoint[] = [];
  const now = new Date();
  let previousClose = price;

  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(now);
    let dateString = '';

    switch (dateFormat) {
      case 'hour':
        date.setHours(date.getHours() - i);
        dateString = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        break;
      case 'day':
        date.setDate(date.getDate() - i);
        dateString = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        break;
      case 'month':
        date.setMonth(date.getMonth() - i);
        dateString = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
        break;
    }

    // Generate price with some randomness but trending
    const volatility = 0.05; // 5% volatility
    const trend = timeRange === 'all' ? 0.001 : timeRange === 'yearly' ? 0.0005 : 0.0002;
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const trendChange = trend * (dataPoints - i);
    
    // Generate OHLC data
    const open = previousClose;
    const closeChange = randomChange + trendChange;
    const close = Math.max(price * (1 + closeChange), 0.01);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = 1000000 * (1 + Math.random() * 0.5);

    data.push({
      date: dateString,
      price: close,
      open,
      high,
      low,
      close,
      volume,
    });
    
    previousClose = close;
  }

  return data;
}
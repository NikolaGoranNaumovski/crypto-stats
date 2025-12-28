// types/coingecko-market-data.ts

export type OHLCVCoingeckoData = number[][];

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;

  current_price: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  total_volume: number;
  market_cap: number;

  circulating_supply: number | null;
  atl: number;
  ath: number;

  last_updated: string;

  liquidity_score?: number;

  image?: string;

  historicalOHLCV: OHLCVCoingeckoData;

  [key: string]: any;
}

export interface NormalizedMetadata {
  crypto: {
    coingecko_id: string;
    symbol: string;
    name: string;
    active: boolean;
    source: string;
  };
  raw: CoinGeckoMarket;
}

export interface OhlcvMapped extends NormalizedMetadata {
  ohlcv: {
    timeframe: 'daily' | 'weekly' | 'monthly';
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
    liquidity: number | null;
    source: string;
  }[];
}

export interface DbRecord {
  crypto: {
    coingecko_id: string;
    symbol: string;
    name: string;
    active: boolean;
    source: string;
  };

  candles: {
    crypto_id?: number;
    timeframe: 'daily' | 'weekly' | 'monthly';
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
    liquidity: number | null;
    source: string;
  }[];
}

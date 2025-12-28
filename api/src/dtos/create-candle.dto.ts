export class CreateCandleDto {
  crypto_id: string;
  timeframe: 'daily' | 'weekly' | 'monthly';
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap?: number;
  liquidity?: number;
  source?: string;
}

export class QueryCandlesDto {
  timeframe?: 'daily' | 'weekly' | 'monthly';
  start_date?: string;
  end_date?: string;
  limit?: number;
}

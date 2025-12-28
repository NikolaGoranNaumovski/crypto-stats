import { Injectable } from '@nestjs/common';
import { Http } from '../../utils/http';

import { CoinGeckoMarket } from 'src/types';
import { PipeFilter } from '../pipeline-service';

export class HistoricalDataFetcher {
  public static async fetchWithRetry<T>(url: string): Promise<T[]> {
    const retries = 5;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await Http.get(url);
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const status = err?.response?.status;

        if (status === 429) {
          const wait = 2000 * attempt; // exponential backoff: 2s, 4s, 6s, 8s, 10s
          console.warn(
            `⚠️ CoinGecko rate limit hit. Attempt ${attempt}/${retries}. Waiting ${wait}ms...`,
          );
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
      }
    }

    return [];
  }

  public static async fetchHistoricalData<T>(coinId: string): Promise<T[]> {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=365&precision=full`;

    return this.fetchWithRetry<T>(url);
  }
}

@Injectable()
export class FetchMarketDataFilter implements PipeFilter {
  async execute(): Promise<CoinGeckoMarket[]> {
    const results: CoinGeckoMarket[] = [];

    for (let page = 1; page <= 4; page++) {
      const url =
        `https://api.coingecko.com/api/v3/coins/markets` +
        `?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}`;

      // Optional small delay before each page (helps even more)
      await new Promise((r) => setTimeout(r, 1200));

      const data =
        await HistoricalDataFetcher.fetchWithRetry<CoinGeckoMarket>(url);
      results.push(...data);
    }

    let shouldSkipFutureCalls = false;

    for (let i = 0; i < results.length; ++i) {
      const coin = results[i];

      if (shouldSkipFutureCalls) {
        results[i].historicalOHLCV = [];
        continue;
      }

      const historicalOhlcvData =
        await HistoricalDataFetcher.fetchHistoricalData<number[]>(coin.id);

      if (!historicalOhlcvData.length) {
        shouldSkipFutureCalls = true;
      }

      results[i].historicalOHLCV = historicalOhlcvData;
    }

    return results;
  }
}

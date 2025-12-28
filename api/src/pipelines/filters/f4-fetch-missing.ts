// pipeline/filters/filter4-map-to-ohlcv.ts
import { Injectable } from '@nestjs/common';

import { PipeFilter } from '../pipeline-service';
import { NormalizedMetadata } from 'src/types';

@Injectable()
export class MapToOhlcvFilter implements PipeFilter {
  private formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(items: NormalizedMetadata[]) {
    return items.map((item) => {
      const ohlcv = item.raw.historicalOHLCV
        .map((data) => {
          const [timestamp, open, high, low, close] = data || [];

          if (!timestamp) return;

          const date = this.formatDate(timestamp);

          return {
            timeframe: 'daily',
            date,
            open,
            high,
            low,
            close,
            source: 'coingecko',
          };
        })
        .filter((item) => !!item);

      return {
        ...item,
        ohlcv,
      };
    });
  }
}

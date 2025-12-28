// pipeline/filters/filter2-normalize-metadata.ts
import { Injectable } from '@nestjs/common';

import { CoinGeckoMarket } from '../../types';
import { PipeFilter } from '../pipeline-service';

@Injectable()
export class NormalizeMetadataFilter implements PipeFilter {
  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(input: CoinGeckoMarket[]) {
    return input.map((coin) => ({
      crypto: {
        coingecko_id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        active: true,
        source: 'coingecko',
      },
      raw: coin,
    }));
  }
}

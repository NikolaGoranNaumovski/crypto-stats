import { Injectable } from '@nestjs/common';
import { PipeFilter } from '../pipeline-service';
import { OhlcvMapped } from 'src/types';

@Injectable()
export class DbFormatFilter implements PipeFilter {
  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(items: OhlcvMapped[]) {
    return items.map((item) => ({
      crypto: item.crypto,
      candles: item.ohlcv,
    }));
  }
}

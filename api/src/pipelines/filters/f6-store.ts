// pipeline/filters/filter6-store.ts
import { Injectable } from '@nestjs/common';
import { CryptoService } from '../../services/crypto.service';
import { CandlesService } from '../../services/candles.service';
import { PipeFilter } from '../pipeline-service';
import { DbRecord } from 'src/types';

@Injectable()
export class StoreFilter implements PipeFilter {
  constructor(
    private cryptoService: CryptoService,
    private candleService: CandlesService,
  ) {}

  async execute(records: DbRecord[]) {
    for (const rec of records) {
      let crypto = await this.cryptoService.findBySymbol(rec.crypto.symbol);

      if (!crypto) {
        crypto = await this.cryptoService.create(rec.crypto);
      }

      if (!crypto.id) continue;

      for (const ohlcv of rec.candles) {
        await this.candleService.upsert({
          ...ohlcv,
          liquidity: ohlcv.liquidity === null ? undefined : ohlcv.liquidity,
          crypto_id: crypto.id,
        });
      }
    }
    return true;
  }
}

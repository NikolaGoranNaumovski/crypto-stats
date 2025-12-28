// pipeline/pipeline.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cryptocurrency } from '../entities/crypto-currency.entity';
import { OhlcvCandle } from '../entities/ohlcv-candle.entity';

import { CryptoService } from '../services/crypto.service';
import { CandlesService } from '../services/candles.service';

import { FetchMarketDataFilter } from './filters/f1-fetch-symbols';
import { NormalizeMetadataFilter } from './filters/f2-validate-symbols';
import { ValidateMetadataFilter } from './filters/f3-last-date';
import { MapToOhlcvFilter } from './filters/f4-fetch-missing';
import { DbFormatFilter } from './filters/f5-format-data';
import { StoreFilter } from './filters/f6-store';

import { PipelineService } from './pipeline-service';
import { PipelineController } from 'src/controllers/pipeline.controller';

@Module({
  imports: [
    // FIX: Add TypeOrmModule.forFeature so repositories are available
    TypeOrmModule.forFeature([Cryptocurrency, OhlcvCandle]),
  ],

  providers: [
    CryptoService,
    CandlesService,

    FetchMarketDataFilter,
    NormalizeMetadataFilter,
    ValidateMetadataFilter,
    MapToOhlcvFilter,
    DbFormatFilter,
    StoreFilter,

    {
      provide: PipelineService,
      useFactory: (
        f1: FetchMarketDataFilter,
        f2: NormalizeMetadataFilter,
        f3: ValidateMetadataFilter,
        f4: MapToOhlcvFilter,
        f5: DbFormatFilter,
        f6: StoreFilter,
      ) => new PipelineService([f1, f2, f3, f4, f5, f6]),
      inject: [
        FetchMarketDataFilter,
        NormalizeMetadataFilter,
        ValidateMetadataFilter,
        MapToOhlcvFilter,
        DbFormatFilter,
        StoreFilter,
      ],
    },
  ],

  controllers: [PipelineController],

  exports: [PipelineService],
})
export class PipelineModule {}

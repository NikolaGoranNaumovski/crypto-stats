import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandlesController } from 'src/controllers/candles.controller';
import { CandlesService } from 'src/services/candles.service';
import { OhlcvCandle } from 'src/entities/ohlcv-candle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OhlcvCandle])],
  controllers: [CandlesController],
  providers: [CandlesService],
  exports: [CandlesService, TypeOrmModule],
})
export class CandlesModule {}

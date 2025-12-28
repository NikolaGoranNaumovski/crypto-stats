import { Controller, Get, Param, Query } from '@nestjs/common';
import { CandlesService } from '../services/candles.service';
import { QueryCandlesDto } from '../dtos/query-candles.dto';

@Controller('candles')
export class CandlesController {
  constructor(private candlesService: CandlesService) {}

  @Get(':crypto_id')
  getCandles(
    @Param('crypto_id') crypto_id: string,
    @Query() query: QueryCandlesDto,
  ) {
    return this.candlesService.getCandles(
      crypto_id,
      query.timeframe ?? 'daily',
    );
  }
}

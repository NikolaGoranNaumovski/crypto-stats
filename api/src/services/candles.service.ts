import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateCandleDto } from '../dtos/create-candle.dto';
import { OhlcvCandle } from 'src/entities/ohlcv-candle.entity';

@Injectable()
export class CandlesService {
  constructor(
    @InjectRepository(OhlcvCandle)
    private repo: Repository<OhlcvCandle>,
  ) {}

  async upsert(dto: CreateCandleDto) {
    return this.repo.upsert(dto, ['crypto_id', 'timeframe', 'date']);
  }

  getCandles(crypto_id: string, timeframe: 'daily' | 'weekly' | 'monthly') {
    return this.repo.find({
      where: { crypto_id, timeframe },
      order: { date: 'ASC' },
    });
  }

  getLastDate(crypto_id: string, timeframe: 'daily' | 'weekly' | 'monthly') {
    return this.repo.findOne({
      where: { crypto_id, timeframe },
      order: { date: 'DESC' },
    });
  }
}

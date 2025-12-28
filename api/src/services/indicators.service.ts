import { Injectable } from '@nestjs/common';
import {
  sma,
  ema,
  wma,
  rsi,
  macd,
  stochastic,
  adx,
  cci,
  bollingerbands,
} from 'fast-technical-indicators';

@Injectable()
export class TechnicalAnalysisService {
  calculateFastIndicators(
    close: number[],
    high: number[],
    low: number[],
    volume: number[],
  ) {
    return {
      SMA: sma({ period: 20, values: close }),
      EMA: ema({ period: 20, values: close }),
      WMA: wma({ period: 20, values: close }),
      RSI: rsi({ period: 14, values: close }),
      MACD: macd({
        values: close,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
      }),
      Stochastic: stochastic({ high, low, close, period: 14, signalPeriod: 3 }),
      ADX: adx({ high, low, close, period: 14 }),
      CCI: cci({ high, low, close, period: 20 }),
      BollingerBands: bollingerbands({ period: 20, values: close, stdDev: 2 }),
      VolumeMA: sma({ period: 14, values: volume }),
    };
  }
}

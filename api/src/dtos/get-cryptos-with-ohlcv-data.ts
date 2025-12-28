import { Cryptocurrency } from 'src/entities/crypto-currency.entity';
import { OhlcvCandle } from 'src/entities/ohlcv-candle.entity';
import { formatLargeNumber } from 'src/utils/common';

export class GetCryptosWithOhlcvDataDto {
  constructor(
    public id: string,
    public name: string,
    public symbol: string,
    public price: string,
    public dailyPriceChange: string,
    public marketCap: string,
    public volume: string,
  ) {}

  public static toModel(
    cryptocurrency: Cryptocurrency,
    ohlcvData?: OhlcvCandle,
  ): GetCryptosWithOhlcvDataDto {
    const open = Number(ohlcvData?.open ?? 0);
    const close = Number(ohlcvData?.close ?? 0);
    const marketCap = Number(ohlcvData?.market_cap ?? 0);
    const volume = Number(ohlcvData?.volume ?? 0);

    const dailyChange = open > 0 ? ((close - open) / open) * 100 : 0;

    return new GetCryptosWithOhlcvDataDto(
      cryptocurrency.id,
      cryptocurrency.name,
      cryptocurrency.symbol,
      close ? `$${close.toLocaleString()}` : '$0.00',
      `${dailyChange >= 0 ? '+' : ''}${dailyChange.toFixed(2)}%`,
      marketCap ? `$${formatLargeNumber(marketCap)}` : '$0',
      volume ? `$${formatLargeNumber(volume)}` : '$0',
    );
  }
}

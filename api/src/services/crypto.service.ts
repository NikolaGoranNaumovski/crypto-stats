import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cryptocurrency } from '../entities/crypto-currency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCryptoDto } from '../dtos/create-crypto.dto';
import { Pagination, Search } from 'src/types/common';
import { getPagination, getSearch } from 'src/utils/common';
import { OhlcvCandle } from 'src/entities/ohlcv-candle.entity';
import { HistoricalDataFetcher } from 'src/pipelines/filters/f1-fetch-symbols';
import { CreateCandleDto } from 'src/dtos/create-candle.dto';
import { GetCryptosWithOhlcvDataDto } from 'src/dtos/get-cryptos-with-ohlcv-data';
import { PaginatedResult } from 'src/dtos/paginated-result';

@Injectable()
export class CryptoService {
  constructor(
    @InjectRepository(Cryptocurrency)
    private cryptocurrencyRepository: Repository<Cryptocurrency>,

    @InjectRepository(OhlcvCandle)
    private ohlcvCandleRepository: Repository<OhlcvCandle>,
  ) {}

  create(dto: CreateCryptoDto) {
    const crypto = this.cryptocurrencyRepository.create(dto);
    return this.cryptocurrencyRepository.save(crypto);
  }

  private formatDate(timestamp: number): string {
    const date = new Date(timestamp);

    return date.toISOString().split('T')[0];
  }

  getCryptSignalsWithNoOhlcvData(
    cryptos: Cryptocurrency[],
    ohlcv: OhlcvCandle[],
  ) {
    const ohlcvCryptos = ohlcv.map((c) => c.crypto_id);

    const cryptosWithNoOhlcv = cryptos.filter(
      (c) => !ohlcvCryptos.includes(c.id),
    );

    return cryptosWithNoOhlcv.map((c) => ({
      id: c.id,
      symbol: c.symbol,
      coingecko_id: c.coingecko_id,
    }));
  }

  async fetchAndSaveHistoricalDataForCryptoSymbols(
    cryptos: {
      symbol: string;
      id: string;
      coingecko_id: string;
    }[],
  ) {
    for (let i = 0; i < cryptos.length; ++i) {
      const crypto = cryptos[i];
      const symbol = crypto.coingecko_id;

      const historicalData =
        await HistoricalDataFetcher.fetchHistoricalData<number[]>(symbol);

      for (let j = 0; j < historicalData.length; ++j) {
        const [timestamp, open, high, low, close] = historicalData[j] || [];

        if (!timestamp) {
          continue;
        }

        const date = this.formatDate(timestamp);

        const ohlcv = {
          timeframe: 'daily' as const,
          date,
          open,
          high,
          low,
          close,
          source: 'coingecko',
        };

        const dto: CreateCandleDto = {
          ...ohlcv,
          liquidity: undefined,
          crypto_id: crypto.id,
          volume: 0,
        };

        await this.ohlcvCandleRepository.upsert(dto, [
          'crypto_id',
          'timeframe',
          'date',
        ]);
      }
    }
  }

  async findAll(pagination: Pagination, search: Search) {
    const paginationParams = getPagination(pagination);
    const searchParams = getSearch(search);

    const [cryptocurrencies, totalCryptoCurrencies] =
      await this.cryptocurrencyRepository
        .createQueryBuilder('c')
        .where(searchParams)
        .skip(paginationParams.skip)
        .take(paginationParams.take)
        .getManyAndCount();

    const cryptocurrenyIds = cryptocurrencies.map((c) => c.id);

    let latestOhlcvCandleData = await this.ohlcvCandleRepository
      .createQueryBuilder('oc')
      .distinctOn(['oc.crypto_id'])
      .where('oc.crypto_id IN (:...crypto_ids)', {
        crypto_ids: cryptocurrenyIds,
      })
      .orderBy('oc.crypto_id', 'ASC')
      .addOrderBy('oc.date', 'DESC')
      .getMany();

    const cryptosWithNoOhlcv = this.getCryptSignalsWithNoOhlcvData(
      cryptocurrencies,
      latestOhlcvCandleData,
    );

    if (cryptosWithNoOhlcv.length > 0) {
      this.fetchAndSaveHistoricalDataForCryptoSymbols(cryptosWithNoOhlcv);
    }

    const data = cryptocurrencies.map((c) => {
      const ohlcv = latestOhlcvCandleData.find(
        (ohlcv) => ohlcv.crypto_id === c.id,
      );

      return GetCryptosWithOhlcvDataDto.toModel(c, ohlcv);
    });

    return PaginatedResult.createFromModel(
      data,
      totalCryptoCurrencies,
      pagination,
    );
  }

  findBySymbol(symbol: string) {
    return this.cryptocurrencyRepository.findOne({ where: { symbol } });
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { CryptoService } from '../services/crypto.service';
import { PaginationParams } from 'src/common/pagination';
import { type Search, type Pagination } from 'src/types/common';
import { SearchParams } from 'src/common/search-params';
import { GetCryptoDto } from 'src/dtos/get-crypto.dto';
import { nameof } from 'ts-simple-nameof';

@Controller('cryptos')
export class CryptoController {
  constructor(private cryptoService: CryptoService) {}

  @Get()
  getAll(
    @PaginationParams() pagination: Pagination,
    @SearchParams([nameof<GetCryptoDto>((e) => e.name)]) searchParams: Search,
  ) {
    return this.cryptoService.findAll(pagination, searchParams);
  }

  @Get(':symbol')
  getOne(@Param('symbol') symbol: string) {
    return this.cryptoService.findBySymbol(symbol);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cryptocurrency } from '../entities/crypto-currency.entity';
import { CryptoService } from '../services/crypto.service';
import { CryptoController } from '../controllers/crypto.controller';
import { CandlesModule } from './candles.modules';

@Module({
  imports: [TypeOrmModule.forFeature([Cryptocurrency]), CandlesModule],
  controllers: [CryptoController],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}

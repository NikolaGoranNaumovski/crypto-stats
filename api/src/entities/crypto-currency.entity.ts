import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OhlcvCandle } from './ohlcv-candle.entity';

@Entity('cryptocurrencies')
export class Cryptocurrency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  coingecko_id: string;

  @Column({ type: 'text', unique: true })
  symbol: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'text', nullable: true })
  source: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => OhlcvCandle, (candle) => candle.crypto)
  candles: OhlcvCandle[];
}

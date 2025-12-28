import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Cryptocurrency } from './crypto-currency.entity';

@Entity('ohlcv_candles')
@Index(['crypto_id', 'timeframe', 'date'], { unique: true })
export class OhlcvCandle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  crypto_id: string;

  @ManyToOne(() => Cryptocurrency, (crypto) => crypto.candles, {
    onDelete: 'CASCADE',
  })
  crypto: Cryptocurrency;

  @Column({ type: 'text' })
  @Index()
  timeframe: 'daily' | 'weekly' | 'monthly';

  @Column({ type: 'date' })
  @Index()
  date: string;

  @Column({ type: 'numeric', nullable: true })
  open: number;

  @Column({ type: 'numeric', nullable: true })
  high: number;

  @Column({ type: 'numeric', nullable: true })
  low: number;

  @Column({ type: 'numeric', nullable: true })
  close: number;

  @Column({ type: 'numeric', nullable: true })
  volume: number;

  @Column({ type: 'numeric', nullable: true })
  market_cap?: number;

  @Column({ type: 'numeric', nullable: true })
  liquidity?: number;

  @Column({ type: 'text', nullable: true })
  source?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  ingested_at: Date;
}

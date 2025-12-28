import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Cryptocurrency } from './entities/crypto-currency.entity';
import { OhlcvCandle } from './entities/ohlcv-candle.entity';
import { User } from './entities/user.entity';

config({ path: '.env' }); // Load environment variables

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Cryptocurrency, OhlcvCandle, User],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false, // Never true in production, use migrations
  logging: true,
});

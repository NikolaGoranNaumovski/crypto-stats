// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cryptocurrency } from './entities/crypto-currency.entity';
import { OhlcvCandle } from './entities/ohlcv-candle.entity';
import { CryptoModule } from './modules/crypto.module';
import { CandlesModule } from './modules/candles.modules';
import { PipelineModule } from './pipelines/pipeline.module';
import { AuthModule } from './modules/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Cryptocurrency, OhlcvCandle, User],
        cli: {
          migrationsDir: 'src/migrations',
        },
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    UserModule,
    AuthModule,
    CryptoModule,
    CandlesModule,
    PipelineModule,

    TypeOrmModule.forFeature([Cryptocurrency, OhlcvCandle]),
  ],
})
export class AppModule {}

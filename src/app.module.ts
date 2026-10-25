import {
  Module,
  OnModuleInit,
} from '@nestjs/common';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import {
  TypeOrmModule,
  InjectDataSource,
} from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { QuotationModule } from './quotation/quotation.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        type: 'postgres',

        url: configService.get<string>(
          'DATABASE_URL',
        ),

        autoLoadEntities: true,

        synchronize: false,
      }),
    }),

    QuotationModule,
  ],
})
export class AppModule
  implements OnModuleInit {

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {

    if (this.dataSource.isInitialized) {

      console.log(
        '=================================',
      );

      console.log(
        '✅ PostgreSQL Database Connected',
      );

      console.log(
        '✅ Vercel PostgreSQL Connection Success',
      );

      console.log(
        '=================================',
      );
    }
  }
}
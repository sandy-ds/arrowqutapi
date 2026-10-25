import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Quotation } from './quotation.entity';
import { QuotationItem } from './quotation-item.entity';

import { QuotationController } from './quotation.controller';
import { QuotationService } from './quotation.service';

@Module({

  imports: [
    TypeOrmModule.forFeature([
      Quotation,
      QuotationItem,
    ]),
  ],

  controllers: [
    QuotationController,
  ],

  providers: [
    QuotationService,
  ],

})
export class QuotationModule {}
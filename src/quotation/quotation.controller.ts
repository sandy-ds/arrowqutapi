import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { QuotationService } from './quotation.service';

@Controller('quotations')
export class QuotationController {

  constructor(
    private readonly quotationService: QuotationService,
  ) {}

  // CREATE
  @Post()
  async createQuotation(
    @Body() body: any,
  ) {
    return this.quotationService.createQuotation(body);
  }

  // GET ALL
  @Get()
  async findAll() {
    return this.quotationService.findAll();
  }

  // GET ONE
  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ) {
    return this.quotationService.findOne(Number(id));
  }

  // UPDATE
  @Put(':id')
  async updateQuotation(
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.quotationService.updateQuotation(
      Number(id),
      body,
    );
  }

  // DELETE
  @Delete(':id')
  async deleteQuotation(
    @Param('id') id: number,
  ) {
    return this.quotationService.deleteQuotation(
      Number(id),
    );
  }
}
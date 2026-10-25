import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';

import { Quotation } from './quotation.entity';
import { QuotationItem } from './quotation-item.entity';

@Injectable()
export class QuotationService {

  constructor(
    private readonly dataSource: DataSource,
  ) {}

  // =====================================================
  // CREATE
  // =====================================================

  async createQuotation(data: any) {

    const queryRunner =
      this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // Check quote number
      const existingQuotation =
        await queryRunner.manager.findOne(
          Quotation,
          {
            where: {
              quoteNo: data.quote_no,
            },
          },
        );

      if (existingQuotation) {
        throw new BadRequestException(
          `Quote number ${data.quote_no} already exists`,
        );
      }

      // Check items
      if (
        !data.items ||
        !Array.isArray(data.items) ||
        data.items.length === 0
      ) {
        throw new BadRequestException(
          'At least one quotation item is required',
        );
      }

      // Create quotation
      const quotation =
        queryRunner.manager.create(
          Quotation,
          {
            quoteNo: data.quote_no,
            quoteDate: data.quote_date,
            name: data.name,
            location: data.location,
            mobile: data.mobile,
          },
        );

      // Save quotation
      await queryRunner.manager.save(
        Quotation,
        quotation,
      );

      // Save items
      for (const itemData of data.items) {

        const quotationItem =
          queryRunner.manager.create(
            QuotationItem,
            {
              quoteNo: data.quote_no,
              item: itemData.item,
              qty: itemData.qty,
              price: itemData.price,
              gst18: itemData.gst18,
              amount: itemData.amount,
            },
          );

        await queryRunner.manager.save(
          QuotationItem,
          quotationItem,
        );
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Quotation created successfully',
        quote_no: data.quote_no,
      };

    } catch (error) {

      await queryRunner.rollbackTransaction();

      throw error;

    } finally {

      await queryRunner.release();
    }
  }


  // =====================================================
  // GET ALL QUOTATIONS
  // =====================================================

  async findAll() {

    const quotations =
      await this.dataSource
        .getRepository(Quotation)
        .createQueryBuilder('quotation')

        .leftJoinAndSelect(
          'quotation.items',
          'items',
        )

        .orderBy(
          'quotation.id',
          'DESC',
        )

        .getMany();

    return {
      success: true,
      count: quotations.length,
      data: quotations,
    };
  }


  // =====================================================
  // GET ONE QUOTATION
  // =====================================================

  async findOne(id: number) {

    const quotation =
      await this.dataSource
        .getRepository(Quotation)
        .createQueryBuilder('quotation')

        .leftJoinAndSelect(
          'quotation.items',
          'items',
        )

        .where(
          'quotation.id = :id',
          { id },
        )

        .getOne();

    if (!quotation) {

      throw new NotFoundException(
        `Quotation with ID ${id} not found`,
      );
    }

    return {
      success: true,
      data: quotation,
    };
  }


  // =====================================================
// UPDATE
// =====================================================

async updateQuotation(
  id: number,
  data: any,
) {

  const queryRunner =
    this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {

    // =====================================================
    // Find quotation
    // =====================================================

    const quotation =
      await queryRunner.manager.findOne(
        Quotation,
        {
          where: {
            id,
          },
        },
      );

    if (!quotation) {

      throw new NotFoundException(
        `Quotation with ID ${id} not found`,
      );
    }


    // =====================================================
    // Check duplicate quote number
    // =====================================================

    if (
      data.quote_no !== undefined &&
      Number(data.quote_no) !== Number(quotation.quoteNo)
    ) {

      const existingQuotation =
        await queryRunner.manager.findOne(
          Quotation,
          {
            where: {
              quoteNo: Number(data.quote_no),
            },
          },
        );

      if (existingQuotation) {

        throw new BadRequestException(
          `Quote number ${data.quote_no} already exists`,
        );
      }
    }


    // =====================================================
    // Store OLD quote number
    // =====================================================

    const oldQuoteNo = quotation.quoteNo;


    // =====================================================
    // Update quotation
    // =====================================================

    quotation.quoteNo =
      data.quote_no ?? quotation.quoteNo;

    quotation.quoteDate =
      data.quote_date ?? quotation.quoteDate;

    quotation.name =
      data.name ?? quotation.name;

    quotation.location =
      data.location ?? quotation.location;

    quotation.mobile =
      data.mobile ?? quotation.mobile;


    await queryRunner.manager.save(
      Quotation,
      quotation,
    );


    // =====================================================
    // If items are sent, replace old items
    // =====================================================

    if (Array.isArray(data.items)) {

      // Delete OLD items using OLD quote number
      await queryRunner.manager.delete(
        QuotationItem,
        {
          quoteNo: oldQuoteNo,
        },
      );


      // Insert NEW items
      for (
        const itemData of data.items
      ) {

        const quotationItem =
          queryRunner.manager.create(
            QuotationItem,
            {
              quoteNo: quotation.quoteNo,

              item: itemData.item,

              qty: itemData.qty,

              price: itemData.price,

              gst18: itemData.gst18,

              amount: itemData.amount,
            },
          );


        await queryRunner.manager.save(
          QuotationItem,
          quotationItem,
        );
      }
    }


    // =====================================================
    // Commit
    // =====================================================

    await queryRunner.commitTransaction();


    return {
      success: true,
      message: 'Quotation updated successfully',
      id,
    };


  } catch (error) {

    await queryRunner.rollbackTransaction();

    throw error;

  } finally {

    await queryRunner.release();
  }
}


  // =====================================================
  // DELETE
  // =====================================================

  async deleteQuotation(id: number) {

    const queryRunner =
      this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const quotation =
        await queryRunner.manager.findOne(
          Quotation,
          {
            where: {
              id,
            },
          },
        );

      if (!quotation) {

        throw new NotFoundException(
          `Quotation with ID ${id} not found`,
        );
      }


      // Delete quotation items first
      await queryRunner.manager.delete(
        QuotationItem,
        {
          quoteNo: quotation.quoteNo,
        },
      );


      // Delete quotation
      await queryRunner.manager.delete(
        Quotation,
        {
          id,
        },
      );


      await queryRunner.commitTransaction();


      return {
        success: true,
        message: 'Quotation deleted successfully',
        id,
      };

    } catch (error) {

      await queryRunner.rollbackTransaction();

      throw error;

    } finally {

      await queryRunner.release();
    }
  }
}
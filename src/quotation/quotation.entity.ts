import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { QuotationItem } from './quotation-item.entity';

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'quote_no', type: 'bigint', unique: true })
  quoteNo: number;

  @Column({ name: 'quote_date', type: 'date' })
  quoteDate: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ length: 15 })
  mobile: string;

  @OneToMany(
    () => QuotationItem,
    (item) => item.quotation,
  )
  items: QuotationItem[];
}
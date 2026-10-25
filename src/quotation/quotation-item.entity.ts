import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quotation } from './quotation.entity';

@Entity('quotation_items')
export class QuotationItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'quote_no', type: 'bigint' })
  quoteNo: number;

  @Column({ length: 250 })
  item: string;

  @Column({ type: 'integer' })
  qty: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @Column({ name: 'gst18', type: 'numeric', precision: 12, scale: 2, nullable: true })
  gst18: number | null;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @ManyToOne(
    () => Quotation,
    (quotation) => quotation.items,
  )
  @JoinColumn({
    name: 'quote_no',
    referencedColumnName: 'quoteNo',
  })
  quotation: Quotation;
}
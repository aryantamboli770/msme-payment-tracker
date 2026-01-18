import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PaymentMethod } from '../../../common/enums';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  paymentReference: string;

  @ManyToOne(() => PurchaseOrder, (po) => po.payments)
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @Column()
  purchaseOrderId: string;

  @Column('date')
  paymentDate: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  amountPaid: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}

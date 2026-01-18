import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseOrderStatus } from '../../../common/enums';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  poNumber: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.purchaseOrders)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column()
  vendorId: string;

  @Column('date')
  poDate: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @Column('date')
  dueDate: Date;

  @Column({ type: 'enum', enum: PurchaseOrderStatus, default: PurchaseOrderStatus.DRAFT })
  status: PurchaseOrderStatus;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, { cascade: true })
  items: PurchaseOrderItem[];

  @OneToMany(() => Payment, (payment) => payment.purchaseOrder)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

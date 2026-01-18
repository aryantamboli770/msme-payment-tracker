import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VendorStatus, PaymentTerms } from '../../../common/enums';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  vendorName: string;

  @Column()
  contactPerson: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'enum', enum: PaymentTerms, default: PaymentTerms.DAYS_30 })
  paymentTerms: PaymentTerms;

  @Column({ type: 'enum', enum: VendorStatus, default: VendorStatus.ACTIVE })
  status: VendorStatus;

  @OneToMany(() => PurchaseOrder, (po) => po.vendor)
  purchaseOrders: PurchaseOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../purchase-orders/entities/purchase-order.entity';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private poRepo: Repository<PurchaseOrder>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async getVendorOutstanding() {
    const data = await this.poRepo
      .createQueryBuilder('po')
      .leftJoin('po.vendor', 'vendor')
      .leftJoin('po.payments', 'payment')
      .select('vendor.id', 'vendorId')
      .addSelect('vendor.vendorName', 'vendorName')
      .addSelect('SUM(po.totalAmount)', 'totalAmount')
      .addSelect('COALESCE(SUM(payment.amountPaid), 0)', 'totalPaid')
      .addSelect('SUM(po.totalAmount) - COALESCE(SUM(payment.amountPaid), 0)', 'outstanding')
      .groupBy('vendor.id')
      .addGroupBy('vendor.vendorName')
      .getRawMany();

    return data.map(d => ({
      vendorId: d.vendorId,
      vendorName: d.vendorName,
      totalAmount: parseFloat(d.totalAmount),
      totalPaid: parseFloat(d.totalPaid),
      outstanding: parseFloat(d.outstanding),
    }));
  }

  async getPaymentAging() {
    const today = new Date();
    
    const pos = await this.poRepo.find({
      relations: ['vendor', 'payments'],
      where: { status: 'APPROVED' as any },
    });

    const aging = {
      '0-30': 0,
      '31-60': 0,
      '61-90': 0,
      '90+': 0,
    };

    for (const po of pos) {
      const totalPaid = po.payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);
      const outstanding = Number(po.totalAmount) - totalPaid;
      
      if (outstanding <= 0) continue;

      const daysPastDue = Math.floor((today.getTime() - new Date(po.dueDate).getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysPastDue <= 30) aging['0-30'] += outstanding;
      else if (daysPastDue <= 60) aging['31-60'] += outstanding;
      else if (daysPastDue <= 90) aging['61-90'] += outstanding;
      else aging['90+'] += outstanding;
    }

    return aging;
  }
}
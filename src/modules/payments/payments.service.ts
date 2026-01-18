import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private poService: PurchaseOrdersService,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const po = await this.poService.findOne(dto.purchaseOrderId);
    
    const totalPaid = await this.getTotalPaid(dto.purchaseOrderId);
    const outstanding = po.totalAmount - totalPaid;

    if (dto.amountPaid > outstanding) {
      throw new BadRequestException(`Payment amount exceeds outstanding balance of ${outstanding}`);
    }

    const paymentReference = await this.generatePaymentRef();
    
    const payment = this.paymentRepo.create({
      ...dto,
      paymentReference,
      paymentDate: new Date(dto.paymentDate),
    });

    const saved = await this.paymentRepo.save(payment);
    
    await this.poService.autoUpdateStatus(dto.purchaseOrderId, totalPaid + dto.amountPaid);

    return this.findOne(saved.id);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.find({
      relations: ['purchaseOrder', 'purchaseOrder.vendor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['purchaseOrder', 'purchaseOrder.vendor'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async getTotalPaid(poId: string): Promise<number> {
    const result = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('SUM(payment.amountPaid)', 'total')
      .where('payment.purchaseOrderId = :poId', { poId })
      .getRawOne();
    return parseFloat(result?.total || '0');
  }

  private async generatePaymentRef(): Promise<string> {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = await this.paymentRepo.count();
    return `PAY-${date}-${String(count + 1).padStart(3, '0')}`;
  }
}
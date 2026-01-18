import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePoStatusDto } from './dto/update-po-status.dto';
import { PurchaseOrderStatus } from '../../common/enums';
import { VendorsService } from '../vendors/vendors.service';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private poItemRepo: Repository<PurchaseOrderItem>,
    private vendorsService: VendorsService,
  ) {}

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    await this.vendorsService.checkActive(dto.vendorId);
    const vendor = await this.vendorsService.findOne(dto.vendorId);
    
    const totalAmount = dto.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const poDate = new Date();
    const dueDate = new Date(poDate);
    dueDate.setDate(dueDate.getDate() + vendor.paymentTerms);

    const poNumber = await this.generatePoNumber();
    
    const po = this.poRepo.create({
      poNumber,
      vendorId: dto.vendorId,
      poDate,
      totalAmount,
      dueDate,
      status: PurchaseOrderStatus.DRAFT,
    });

    const savedPo = await this.poRepo.save(po);

    const items = dto.items.map(item => 
      this.poItemRepo.create({
        ...item,
        lineTotal: item.quantity * item.unitPrice,
        purchaseOrderId: savedPo.id,
      })
    );
    await this.poItemRepo.save(items);

    return this.findOne(savedPo.id);
  }

  async findAll(vendorId?: string, status?: PurchaseOrderStatus): Promise<PurchaseOrder[]> {
    const query = this.poRepo.createQueryBuilder('po')
      .leftJoinAndSelect('po.vendor', 'vendor')
      .leftJoinAndSelect('po.items', 'items')
      .leftJoinAndSelect('po.payments', 'payments')
      .orderBy('po.createdAt', 'DESC');

    if (vendorId) query.andWhere('po.vendorId = :vendorId', { vendorId });
    if (status) query.andWhere('po.status = :status', { status });

    return query.getMany();
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const po = await this.poRepo.findOne({
      where: { id },
      relations: ['vendor', 'items', 'payments'],
    });
    if (!po) throw new NotFoundException('Purchase order not found');
    return po;
  }

  async updateStatus(id: string, dto: UpdatePoStatusDto): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    this.validateStatusTransition(po.status, dto.status);
    po.status = dto.status;
    await this.poRepo.save(po);
    return this.findOne(id);
  }

  async autoUpdateStatus(poId: string, totalPaid: number): Promise<void> {
    const po = await this.findOne(poId);
    let newStatus: PurchaseOrderStatus;

    if (totalPaid >= po.totalAmount) {
      newStatus = PurchaseOrderStatus.FULLY_PAID;
    } else if (totalPaid > 0) {
      newStatus = PurchaseOrderStatus.PARTIALLY_PAID;
    } else {
      return;
    }

    if (po.status !== newStatus) {
      po.status = newStatus;
      await this.poRepo.save(po);
    }
  }

  private validateStatusTransition(current: PurchaseOrderStatus, next: PurchaseOrderStatus): void {
    const validTransitions: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
      [PurchaseOrderStatus.DRAFT]: [PurchaseOrderStatus.APPROVED],
      [PurchaseOrderStatus.APPROVED]: [PurchaseOrderStatus.PARTIALLY_PAID, PurchaseOrderStatus.FULLY_PAID],
      [PurchaseOrderStatus.PARTIALLY_PAID]: [PurchaseOrderStatus.FULLY_PAID],
      [PurchaseOrderStatus.FULLY_PAID]: [],
    };

    if (!validTransitions[current]?.includes(next)) {
      throw new BadRequestException(`Invalid status transition from ${current} to ${next}`);
    }
  }

  private async generatePoNumber(): Promise<string> {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = await this.poRepo.count();
    return `PO-${date}-${String(count + 1).padStart(3, '0')}`;
  }
}
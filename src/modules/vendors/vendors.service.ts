import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorStatus } from '../../common/enums';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,
  ) {}

  async create(dto: CreateVendorDto): Promise<Vendor> {
    const existing = await this.vendorRepo.findOne({
      where: [{ vendorName: dto.vendorName }, { email: dto.email }],
    });
    if (existing) {
      throw new ConflictException('Vendor name or email already exists');
    }
    const vendor = this.vendorRepo.create(dto);
    return this.vendorRepo.save(vendor);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ['purchaseOrders', 'purchaseOrders.payments'],
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async update(id: string, dto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    if (dto.vendorName || dto.email) {
      const existing = await this.vendorRepo.findOne({
        where: [{ vendorName: dto.vendorName }, { email: dto.email }],
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Vendor name or email already exists');
      }
    }
    Object.assign(vendor, dto);
    return this.vendorRepo.save(vendor);
  }

  async checkActive(id: string): Promise<void> {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    if (vendor.status !== VendorStatus.ACTIVE) {
      throw new BadRequestException('Cannot create PO for inactive vendor');
    }
  }
}

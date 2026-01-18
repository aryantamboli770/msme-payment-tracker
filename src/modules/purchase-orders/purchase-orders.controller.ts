import { Controller, Get, Post, Body, Patch, Param, Query, ValidationPipe } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePoStatusDto } from './dto/update-po-status.dto';
import { PurchaseOrderStatus } from '../../common/enums';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly service: PurchaseOrdersService) {}

  @Post()
  create(@Body(ValidationPipe) dto: CreatePurchaseOrderDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('vendorId') vendorId?: string,
    @Query('status') status?: PurchaseOrderStatus,
  ) {
    return this.service.findAll(vendorId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body(ValidationPipe) dto: UpdatePoStatusDto) {
    return this.service.updateStatus(id, dto);
  }
}
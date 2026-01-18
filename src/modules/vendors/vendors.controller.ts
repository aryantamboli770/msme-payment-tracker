import { Controller, Get, Post, Body, Patch, Param, ValidationPipe } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly service: VendorsService) {}

  @Post()
  create(@Body(ValidationPipe) dto: CreateVendorDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateVendorDto) {
    return this.service.update(id, dto);
  }
}
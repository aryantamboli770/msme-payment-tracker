import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('vendor-outstanding')
  getVendorOutstanding() {
    return this.service.getVendorOutstanding();
  }

  @Get('payment-aging')
  getPaymentAging() {
    return this.service.getPaymentAging();
  }
}
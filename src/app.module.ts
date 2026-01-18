import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './modules/vendors/entities/vendor.entity';
import { PurchaseOrder } from './modules/purchase-orders/entities/purchase-order.entity';
import { PurchaseOrderItem } from './modules/purchase-orders/entities/purchase-order-item.entity';
import { Payment } from './modules/payments/entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Vendor, PurchaseOrder, PurchaseOrderItem, Payment],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
      logging: false,
    }),
  ],
})
export class AppModule {}

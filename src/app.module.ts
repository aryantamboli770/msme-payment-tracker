import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VendorsModule } from './modules/vendors/vendors.module';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

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

      entities: [
        Vendor,
        PurchaseOrder,
        PurchaseOrderItem,
        Payment,
      ],

      synchronize: true, // ⚠️ OK for assignment/demo; disable in real prod

      // 🔥 REQUIRED for Supabase Pooler SSL
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,

      // Cloud DB stability
      retryAttempts: 10,
      retryDelay: 3000,

      logging: false,
    }),

    VendorsModule,
    PurchaseOrdersModule,
    PaymentsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}

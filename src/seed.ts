// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VendorsService } from './modules/vendors/vendors.service';
import { PurchaseOrdersService } from './modules/purchase-orders/purchase-orders.service';
import { PaymentsService } from './modules/payments/payments.service';
import { VendorStatus, PaymentTerms, PaymentMethod } from './common/enums';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const vendorsService = app.get(VendorsService);
  const poService = app.get(PurchaseOrdersService);
  const paymentsService = app.get(PaymentsService);

  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Create Vendors
    console.log('📦 Creating vendors...');
    const vendor1 = await vendorsService.create({
      vendorName: 'Tech Solutions Ltd',
      contactPerson: 'Rajesh Kumar',
      email: 'rajesh@techsolutions.com',
      phoneNumber: '+91-9876543210',
      paymentTerms: PaymentTerms.DAYS_30,
      status: VendorStatus.ACTIVE,
    });
    console.log(`✅ Created: ${vendor1.vendorName}`);

    const vendor2 = await vendorsService.create({
      vendorName: 'Office Supplies Co',
      contactPerson: 'Priya Sharma',
      email: 'priya@officesupplies.com',
      phoneNumber: '+91-9876543211',
      paymentTerms: PaymentTerms.DAYS_15,
      status: VendorStatus.ACTIVE,
    });
    console.log(`✅ Created: ${vendor2.vendorName}`);

    const vendor3 = await vendorsService.create({
      vendorName: 'Manufacturing Parts Inc',
      contactPerson: 'Amit Patel',
      email: 'amit@mfgparts.com',
      phoneNumber: '+91-9876543212',
      paymentTerms: PaymentTerms.DAYS_45,
      status: VendorStatus.ACTIVE,
    });
    console.log(`✅ Created: ${vendor3.vendorName}\n`);

    // 2. Create Purchase Orders
    console.log('📝 Creating purchase orders...');
    
    const po1 = await poService.create({
      vendorId: vendor1.id,
      items: [
        { description: 'Laptop Dell XPS 15', quantity: 5, unitPrice: 85000 },
        { description: 'Wireless Mouse', quantity: 10, unitPrice: 1200 },
      ],
    });
    console.log(`✅ Created PO: ${po1.poNumber} - Total: ₹${po1.totalAmount}`);

    const po2 = await poService.create({
      vendorId: vendor2.id,
      items: [
        { description: 'A4 Paper Reams', quantity: 50, unitPrice: 250 },
        { description: 'Pens (Box of 100)', quantity: 20, unitPrice: 150 },
      ],
    });
    console.log(`✅ Created PO: ${po2.poNumber} - Total: ₹${po2.totalAmount}`);

    const po3 = await poService.create({
      vendorId: vendor3.id,
      items: [
        { description: 'Steel Rods (10mm)', quantity: 100, unitPrice: 500 },
        { description: 'Bolts & Nuts Set', quantity: 200, unitPrice: 50 },
      ],
    });
    console.log(`✅ Created PO: ${po3.poNumber} - Total: ₹${po3.totalAmount}\n`);

    // 3. Approve Purchase Orders
    console.log('✔️  Approving purchase orders...');
    await poService.updateStatus(po1.id, { status: 'APPROVED' as any });
    await poService.updateStatus(po2.id, { status: 'APPROVED' as any });
    await poService.updateStatus(po3.id, { status: 'APPROVED' as any });
    console.log('✅ All POs approved\n');

    // 4. Create Payments
    console.log('💰 Creating payments...');
    
    // Partial payment for PO1
    const payment1 = await paymentsService.create({
      purchaseOrderId: po1.id,
      paymentDate: new Date().toISOString(),
      amountPaid: 200000,
      paymentMethod: PaymentMethod.NEFT,
      notes: 'Partial payment - 50% advance',
    });
    console.log(`✅ Payment: ${payment1.paymentReference} - ₹${payment1.amountPaid}`);

    // Full payment for PO2
    const payment2 = await paymentsService.create({
      purchaseOrderId: po2.id,
      paymentDate: new Date().toISOString(),
      amountPaid: po2.totalAmount,
      paymentMethod: PaymentMethod.UPI,
      notes: 'Full payment',
    });
    console.log(`✅ Payment: ${payment2.paymentReference} - ₹${payment2.amountPaid}`);

    // Partial payment for PO3
    const payment3 = await paymentsService.create({
      purchaseOrderId: po3.id,
      paymentDate: new Date().toISOString(),
      amountPaid: 25000,
      paymentMethod: PaymentMethod.RTGS,
      notes: 'Initial payment',
    });
    console.log(`✅ Payment: ${payment3.paymentReference} - ₹${payment3.amountPaid}\n`);

    console.log('🎉 Seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Vendors: 3`);
    console.log(`   - Purchase Orders: 3`);
    console.log(`   - Payments: 3`);
    console.log('\n🚀 You can now test the API endpoints!\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap();
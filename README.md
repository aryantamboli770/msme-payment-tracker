# 🚀 MSME Payment Tracker - Backend

A professional NestJS-based payment tracking system for MSMEs with PostgreSQL (Supabase) database.

## ✨ Features

- ✅ **Vendor Management**: Create, update, and manage vendors with payment terms
- ✅ **Purchase Order System**: Auto-generated PO numbers, multi-item orders, status tracking
- ✅ **Payment Processing**: Multiple payment methods, auto status updates, balance validation
- ✅ **Analytics Dashboard**: Vendor outstanding reports, payment aging analysis
- ✅ **Data Validation**: Class-validator for robust input validation
- ✅ **TypeORM**: Powerful ORM with entity relationships
- ✅ **Production Ready**: CORS, global pipes, error handling

---

## 🛠️ Tech Stack

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL (Supabase)
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Language**: TypeScript

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase account)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/aryantamboli770/msme-payment-tracker.git
cd msme-payment-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Create .env file from example
cp .env.example .env

# Update .env with your Supabase connection string
# DATABASE_URL=postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres
```

4. **Run the application** (database tables will be created automatically)
```bash
npm run start:dev
```

5. **Seed database** (optional - adds sample data)
```bash
npm run seed
```

---

## 🚀 Usage

### Development Mode
```bash
npm run start:dev
```
Server runs on: `http://localhost:3000/api`

### Production Build
```bash
npm run build
npm run start:prod
```

### Seed Database
```bash
# Development
npm run seed

# Production
npm run seed:prod
```

---

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Quick Examples

**Create Vendor:**
```bash
POST /api/vendors
{
  "vendorName": "Tech Corp",
  "contactPerson": "John Doe",
  "email": "john@techcorp.com",
  "phoneNumber": "+91-9876543210",
  "paymentTerms": 30,
  "status": "ACTIVE"
}
```

**Create Purchase Order:**
```bash
POST /api/purchase-orders
{
  "vendorId": "vendor-uuid",
  "items": [
    {"description": "Laptop", "quantity": 5, "unitPrice": 50000}
  ]
}
```

**Create Payment:**
```bash
POST /api/payments
{
  "purchaseOrderId": "po-uuid",
  "paymentDate": "2026-01-18",
  "amountPaid": 50000,
  "paymentMethod": "NEFT"
}
```

**Get Analytics:**
```bash
GET /api/analytics/vendor-outstanding
GET /api/analytics/payment-aging
```

---

## 🗂️ Project Structure
```
src/
├── common/
│   └── enums/
│       └── index.ts                 # Shared enums
├── modules/
│   ├── vendors/
│   │   ├── dto/                     # Data Transfer Objects
│   │   ├── entities/                # TypeORM entities
│   │   ├── vendors.controller.ts
│   │   ├── vendors.service.ts
│   │   └── vendors.module.ts
│   ├── purchase-orders/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── purchase-orders.controller.ts
│   │   ├── purchase-orders.service.ts
│   │   └── purchase-orders.module.ts
│   ├── payments/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── payments.module.ts
│   └── analytics/
│       ├── analytics.controller.ts
│       ├── analytics.service.ts
│       └── analytics.module.ts
├── app.module.ts
├── main.ts
└── seed.ts                          # Database seeding
```

---

## 🔒 Environment Variables

Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres

# Application Configuration
PORT=3000
NODE_ENV=development
```

---

## 🧪 Testing

### Test Endpoints with PowerShell (Windows)
```powershell
# Get all vendors
Invoke-WebRequest -Uri "http://localhost:3000/api/vendors" -Method GET

# Get analytics
Invoke-WebRequest -Uri "http://localhost:3000/api/analytics/vendor-outstanding" -Method GET
```

### Test with cURL (Mac/Linux)
```bash
# Get all vendors
curl http://localhost:3000/api/vendors

# Create vendor
curl -X POST http://localhost:3000/api/vendors \
  -H "Content-Type: application/json" \
  -d '{"vendorName":"Test Vendor","contactPerson":"John","email":"test@vendor.com","phoneNumber":"1234567890","paymentTerms":30,"status":"ACTIVE"}'
```

---

## 📊 Database Schema

### Vendors
- `id` (UUID), `vendorName`, `contactPerson`, `email`, `phoneNumber`
- `paymentTerms` (7/15/30/45/60 days)
- `status` (ACTIVE/INACTIVE)
- Timestamps: `createdAt`, `updatedAt`

### Purchase Orders
- `id` (UUID), `poNumber`, `vendorId`, `poDate`, `totalAmount`, `dueDate`
- `status` (DRAFT/APPROVED/PARTIALLY_PAID/FULLY_PAID)
- Timestamps: `createdAt`, `updatedAt`

### Purchase Order Items
- `id` (UUID), `purchaseOrderId`, `description`, `quantity`, `unitPrice`, `lineTotal`

### Payments
- `id` (UUID), `paymentReference`, `purchaseOrderId`, `paymentDate`
- `amountPaid`, `paymentMethod`, `notes`
- Timestamp: `createdAt`

---

## 🎯 Available Scripts
```bash
# Development
npm run start:dev          # Start in development mode with hot-reload

# Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Database
npm run seed               # Seed database with sample data
npm run seed:prod          # Seed production database

# Code Quality
npm run lint               # Lint and fix code
npm run format             # Format code with Prettier

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Aryan Tamboli**
- GitHub: [@aryantamboli770](https://github.com/aryantamboli770)
- Email: 1181hema@gmail.com

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [TypeORM](https://typeorm.io/) - Amazing ORM for TypeScript

---

## 📧 Support

For issues and questions:
- Open an issue on [GitHub Issues](https://github.com/aryantamboli770/msme-payment-tracker/issues)
- Contact: 1181hema@gmail.com

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using NestJS and TypeScript**
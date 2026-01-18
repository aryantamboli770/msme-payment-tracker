# MSME Payment Tracker - API Documentation

Base URL: `http://localhost:3000/api`

## 📦 Vendors API

### 1. Create Vendor
**POST** `/vendors`
``json
{
  "vendorName": "ABC Corp",
  "contactPerson": "John Doe",
  "email": "john@abccorp.com",
  "phoneNumber": "+91-9876543210",
  "paymentTerms": 30,
  "status": "ACTIVE"
}
``

**Response:** `201 Created`

---

### 2. Get All Vendors
**GET** `/vendors`

**Response:** `200 OK`
``json
[
  {
    "id": "uuid",
    "vendorName": "ABC Corp",
    "contactPerson": "John Doe",
    "email": "john@abccorp.com",
    "phoneNumber": "+91-9876543210",
    "paymentTerms": 30,
    "status": "ACTIVE",
    "createdAt": "2026-01-18T10:00:00.000Z",
    "updatedAt": "2026-01-18T10:00:00.000Z"
  }
]
``

---

### 3. Get Single Vendor
**GET** `/vendors/:id`

**Response:** `200 OK` (includes purchaseOrders and payments)

---

### 4. Update Vendor
**PATCH** `/vendors/:id`
``json
{
  "status": "INACTIVE"
}
``

**Response:** `200 OK`

---

## 📝 Purchase Orders API

### 1. Create Purchase Order
**POST** `/purchase-orders`
``json
{
  "vendorId": "vendor-uuid",
  "items": [
    {
      "description": "Laptop",
      "quantity": 5,
      "unitPrice": 50000
    },
    {
      "description": "Mouse",
      "quantity": 10,
      "unitPrice": 500
    }
  ]
}
``

**Response:** `201 Created`
- Auto-generates: `poNumber`, `poDate`, `totalAmount`, `dueDate`

---

### 2. Get All Purchase Orders
**GET** `/purchase-orders?vendorId=uuid&status=APPROVED`

Query Parameters:
- `vendorId` (optional): Filter by vendor
- `status` (optional): Filter by status (DRAFT, APPROVED, PARTIALLY_PAID, FULLY_PAID)

**Response:** `200 OK`

---

### 3. Get Single Purchase Order
**GET** `/purchase-orders/:id`

**Response:** `200 OK` (includes vendor, items, and payments)

---

### 4. Update PO Status
**PATCH** `/purchase-orders/:id/status`
``json
{
  "status": "APPROVED"
}
``

**Valid Transitions:**
- DRAFT → APPROVED
- APPROVED → PARTIALLY_PAID, FULLY_PAID
- PARTIALLY_PAID → FULLY_PAID

**Response:** `200 OK`

---

## 💰 Payments API

### 1. Create Payment
**POST** `/payments`
``json
{
  "purchaseOrderId": "po-uuid",
  "paymentDate": "2026-01-18",
  "amountPaid": 50000,
  "paymentMethod": "NEFT",
  "notes": "Partial payment"
}
``

**Payment Methods:** `CASH`, `CHEQUE`, `NEFT`, `RTGS`, `UPI`

**Response:** `201 Created`
- Auto-generates: `paymentReference`
- Auto-updates PO status based on total paid

**Validations:**
- Payment cannot exceed outstanding balance
- PO must exist and be approved

---

### 2. Get All Payments
**GET** `/payments`

**Response:** `200 OK` (includes purchaseOrder and vendor)

---

### 3. Get Single Payment
**GET** `/payments/:id`

**Response:** `200 OK`

---

## 📊 Analytics API

### 1. Vendor Outstanding Report
**GET** `/analytics/vendor-outstanding`

**Response:** `200 OK`
``json
[
  {
    "vendorId": "uuid",
    "vendorName": "Tech Solutions Ltd",
    "totalAmount": 437000,
    "totalPaid": 200000,
    "outstanding": 237000
  }
]
``

---

### 2. Payment Aging Report
**GET** `/analytics/payment-aging`

**Response:** `200 OK`
``json
{
  "0-30": 150000,
  "31-60": 50000,
  "61-90": 25000,
  "90+": 12000
}
``

---

## 🔐 Error Responses

### 400 Bad Request
``json
{
  "statusCode": 400,
  "message": "Payment amount exceeds outstanding balance of 237000",
  "error": "Bad Request"
}
``

### 404 Not Found
``json
{
  "statusCode": 404,
  "message": "Vendor not found",
  "error": "Not Found"
}
``

### 409 Conflict
``json
{
  "statusCode": 409,
  "message": "Vendor name or email already exists",
  "error": "Conflict"
}
``

---

## 📝 Enums Reference

### VendorStatus
- `ACTIVE`
- `INACTIVE`

### PaymentTerms
- `7` (7 days)
- `15` (15 days)
- `30` (30 days)
- `45` (45 days)
- `60` (60 days)

### PurchaseOrderStatus
- `DRAFT`
- `APPROVED`
- `PARTIALLY_PAID`
- `FULLY_PAID`

### PaymentMethod
- `CASH`
- `CHEQUE`
- `NEFT`
- `RTGS`
- `UPI`

---

## 🧪 Testing with cURL
``bash
# Create vendor
curl -X POST http://localhost:3000/api/vendors \
  -H "Content-Type: application/json" \
  -d '{"vendorName":"Test Vendor","contactPerson":"John","email":"test@vendor.com","phoneNumber":"1234567890","paymentTerms":30,"status":"ACTIVE"}'

# Get all vendors
curl http://localhost:3000/api/vendors

# Create purchase order
curl -X POST http://localhost:3000/api/purchase-orders \
  -H "Content-Type: application/json" \
  -d '{"vendorId":"vendor-uuid","items":[{"description":"Product","quantity":10,"unitPrice":1000}]}'

# Get analytics
curl http://localhost:3000/api/analytics/vendor-outstanding
``

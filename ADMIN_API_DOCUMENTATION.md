# Admin API Documentation

## 🔐 Hệ thống Admin API

API quản trị cho Admin quản lý sản phẩm và đơn hàng.

## Base URL

```
http://localhost:3000/api/admin
```

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Products Management](#products-management)
3. [Orders Management](#orders-management)
4. [Statistics & Analytics](#statistics--analytics)

---

## 🔑 Authentication

### Admin Login

Đăng nhập với tài khoản admin.

**Endpoint:** `POST /api/admin/auth/login`

**Request Body:**

```json
{
  "email": "admin@zipit.com",
  "password": "admin123456"
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@zipit.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid credentials hoặc không phải admin

**Lưu ý:**

- Tài khoản admin mặc định được tạo bằng script: `npm run create-admin`
- Token có hiệu lực 7 ngày
- Sử dụng Bearer Token cho các request tiếp theo

---

## 📦 Products Management

### Headers cho tất cả request:

```
Authorization: Bearer <your_admin_token>
```

### 1. Get All Products (Admin)

Lấy danh sách tất cả sản phẩm với filters.

**Endpoint:** `GET /api/admin/products`

**Query Parameters:**

- `category` (optional): Lọc theo danh mục
- `search` (optional): Tìm kiếm theo tên hoặc mô tả
- `inStock` (optional): `true` | `false` - Lọc theo trạng thái còn hàng

**Example:**

```
GET /api/admin/products?category=Túi Tote&inStock=false
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Túi Tote Canvas",
        "slug": "tui-tote-canvas",
        "price": 150000,
        "priceFormatted": "150.000đ",
        "image": "https://...",
        "category": "Túi Tote",
        "stock": 0,
        "inStock": false,
        "sku": "SKU-001",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50
    }
  }
}
```

### 2. Get Product by ID

Lấy chi tiết một sản phẩm.

**Endpoint:** `GET /api/admin/products/:id`

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Túi Tote Canvas",
  "slug": "tui-tote-canvas",
  "price": 150000,
  "stock": 50,
  "inStock": true,
  "specifications": {
    "material": "Canvas",
    "size": "35x40cm"
  },
  "customizationOptions": [
    {
      "id": 1,
      "type": "text",
      "name": "In chữ",
      "price": 20000
    }
  ]
}
```

### 3. Create Product

Tạo sản phẩm mới với upload ảnh.

**Endpoint:** `POST /api/admin/products`

**Content-Type:** `multipart/form-data`

**Form Data Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Tên sản phẩm |
| price | number | Yes | Giá sản phẩm |
| category | string | Yes | Danh mục |
| stock | number | Yes | Số lượng tồn kho |
| description | string | No | Mô tả ngắn |
| detailedDescription | string | No | Mô tả chi tiết |
| tags | string | No | Tags (phân cách bằng dấu phẩy, ví dụ: "canvas,tote") |
| specifications | string | No | Thông số kỹ thuật (JSON string, ví dụ: '{"material":"Canvas","size":"35x40cm"}') |
| customizationOptions | string | No | Tùy chọn tùy chỉnh (JSON string, ví dụ: '[{"type":"text","name":"In chữ","price":20000}]') |
| relatedProducts | string | No | Sản phẩm liên quan (ID phân cách bằng dấu phẩy, ví dụ: "2,3,5") |
| rating | number | No | Đánh giá (0-5) |
| reviews | number | No | Số lượng đánh giá |
| images | file[] | No | Tối đa 5 ảnh (jpg, jpeg, png, gif, webp), mỗi file tối đa 5MB |

**Example using cURL:**

```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer <your_token>" \
  -F "name=Túi Tote Canvas Mới" \
  -F "price=150000" \
  -F "category=Túi Tote" \
  -F "description=Túi tote canvas thời trang" \
  -F "stock=100" \
  -F "tags=canvas,tote,fashion" \
  -F "specifications={\"material\":\"Canvas\",\"size\":\"35x40cm\",\"weight\":\"200g\"}" \
  -F "customizationOptions=[{\"type\":\"text\",\"name\":\"In chữ\",\"price\":20000}]" \
  -F "relatedProducts=2,3" \
  -F "rating=4.5" \
  -F "reviews=10" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

**Example using JavaScript/Fetch:**

```javascript
const formData = new FormData();
formData.append('name', 'Túi Tote Canvas Mới');
formData.append('price', '150000');
formData.append('category', 'Túi Tote');
formData.append('description', 'Túi tote canvas thời trang');
formData.append('stock', '100');
formData.append('tags', 'canvas,tote,fashion');
formData.append('specifications', JSON.stringify({
  material: 'Canvas',
  size: '35x40cm',
  weight: '200g'
}));
formData.append('customizationOptions', JSON.stringify([
  { type: 'text', name: 'In chữ', price: 20000 }
]));
formData.append('relatedProducts', '2,3');
formData.append('rating', '4.5');
formData.append('reviews', '10');

// Add images
const imageFile1 = document.getElementById('image1').files[0];
const imageFile2 = document.getElementById('image2').files[0];
formData.append('images', imageFile1);
formData.append('images', imageFile2);

fetch('http://localhost:3000/api/admin/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

**Response (201 Created):**

```json
{
  "id": 51,
  "name": "Túi Tote Canvas Mới",
  "slug": "tui-tote-canvas-moi",
  "sku": "SKU-1700000000000",
  "price": 150000,
  "priceFormatted": "150.000đ",
  "image": "http://localhost:3011/uploads/product-1700000000000-123456789.jpg",
  "images": [
    "http://localhost:3011/uploads/product-1700000000000-123456789.jpg",
    "http://localhost:3011/uploads/product-1700000000000-987654321.jpg"
  ],
  "category": "Túi Tote",
  "stock": 100,
  "inStock": true,
  "tags": ["canvas", "tote", "fashion"],
  "specifications": {
    "material": "Canvas",
    "size": "35x40cm",
    "weight": "200g"
  },
  "customizationOptions": [
    {
      "type": "text",
      "name": "In chữ",
      "price": 20000
    }
  ],
  "relatedProducts": [2, 3],
  "rating": 4.5,
  "reviews": 10,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: Thiếu thông tin bắt buộc hoặc format không hợp lệ
- `413 Payload Too Large`: File quá lớn (> 5MB)
- `415 Unsupported Media Type`: File không phải định dạng ảnh hợp lệ

**Lưu ý:**

- Chỉ chấp nhận file ảnh: jpg, jpeg, png, gif, webp
- Mỗi file tối đa 5MB
- Tối đa 5 ảnh cho mỗi sản phẩm
- Ảnh đầu tiên sẽ là ảnh chính (`image`)
- Tất cả ảnh được lưu trong mảng `images`
- URL ảnh có format: `http://localhost:3011/uploads/product-{timestamp}-{random}.{ext}`

### 4. Update Product

Cập nhật thông tin sản phẩm.

**Endpoint:** `PUT /api/admin/products/:id`

**Request Body:** (tất cả fields đều optional)

```json
{
  "name": "Túi Tote Canvas Updated",
  "price": 180000,
  "stock": 80,
  "inStock": true,
  "description": "Mô tả mới"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Túi Tote Canvas Updated",
  "slug": "tui-tote-canvas-updated",
  "price": 180000,
  "priceFormatted": "180.000đ",
  "stock": 80,
  "inStock": true,
  "updatedAt": "2025-01-02T00:00:00.000Z"
}
```

### 5. Update Product Stock

Cập nhật số lượng tồn kho.

**Endpoint:** `PUT /api/admin/products/:id/stock`

**Request Body:**

```json
{
  "stock": 50,
  "inStock": true
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Túi Tote Canvas",
  "stock": 50,
  "inStock": true,
  "updatedAt": "2025-01-02T00:00:00.000Z"
}
```

### 6. Delete Product

Xóa sản phẩm.

**Endpoint:** `DELETE /api/admin/products/:id`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 📦 Orders Management

### Headers cho tất cả request:

```
Authorization: Bearer <your_admin_token>
```

### 1. Get All Orders

Lấy danh sách tất cả đơn hàng với filters.

**Endpoint:** `GET /api/admin/orders`

**Query Parameters:**

- `status` (optional): `PENDING_PAYMENT` | `PAID` | `PROCESSING` | `SHIPPING` | `DELIVERED` | `CANCELLED`
- `paymentStatus` (optional): `PENDING` | `PAID` | `FAILED`
- `fromDate` (optional): Từ ngày (ISO 8601)
- `toDate` (optional): Đến ngày (ISO 8601)
- `search` (optional): Tìm theo order number, tên, email, phone

**Example:**

```
GET /api/admin/orders?status=PROCESSING&fromDate=2025-01-01
GET /api/admin/orders?search=Nguyen
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "orderNumber": "ZIP-1700000000000-ABC123",
    "customerName": "Nguyễn Văn A",
    "customerEmail": "a@example.com",
    "customerPhone": "0123456789",
    "totalPayment": 200000,
    "status": "PROCESSING",
    "paymentStatus": "PAID",
    "paymentMethod": "BANK_TRANSFER",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "productName": "Túi Tote Canvas",
        "quantity": 2,
        "price": 150000,
        "subtotal": 300000
      }
    ],
    "user": {
      "id": 5,
      "email": "user@example.com",
      "name": "Nguyễn Văn A"
    }
  }
]
```

### 2. Get Order Statistics

Lấy thống kê đơn hàng.

**Endpoint:** `GET /api/admin/orders/statistics`

**Response (200 OK):**

```json
{
  "totalOrders": 150,
  "paidOrders": 120,
  "totalRevenue": 45000000,
  "statusCounts": [
    { "status": "PENDING_PAYMENT", "count": 10 },
    { "status": "PAID", "count": 30 },
    { "status": "PROCESSING", "count": 40 },
    { "status": "SHIPPING", "count": 35 },
    { "status": "DELIVERED", "count": 30 },
    { "status": "CANCELLED", "count": 5 }
  ]
}
```

### 3. Get Order by ID

Lấy chi tiết một đơn hàng.

**Endpoint:** `GET /api/admin/orders/:id`

**Response (200 OK):**

```json
{
  "id": 1,
  "orderNumber": "ZIP-1700000000000-ABC123",
  "customerName": "Nguyễn Văn A",
  "customerEmail": "a@example.com",
  "customerPhone": "0123456789",
  "shippingAddress": {
    "address": "123 Đường ABC",
    "district": "Quận 1",
    "province": "TP.HCM"
  },
  "note": "Giao giờ hành chính",
  "subtotal": 300000,
  "shippingFee": 30000,
  "discount": 0,
  "totalPayment": 330000,
  "status": "PROCESSING",
  "paymentStatus": "PAID",
  "paymentMethod": "BANK_TRANSFER",
  "transactionId": "TXN-123456",
  "paidAt": "2025-01-01T10:00:00.000Z",
  "createdAt": "2025-01-01T09:00:00.000Z",
  "items": [
    {
      "id": 1,
      "productId": 5,
      "productName": "Túi Tote Canvas",
      "quantity": 2,
      "price": 150000,
      "subtotal": 300000,
      "customization": {
        "type": "text",
        "value": "My Name",
        "price": 20000
      },
      "product": {
        "id": 5,
        "name": "Túi Tote Canvas",
        "image": "https://..."
      }
    }
  ]
}
```

### 4. Update Order Status

Cập nhật trạng thái đơn hàng.

**Endpoint:** `PUT /api/admin/orders/:id/status`

**Request Body:**

```json
{
  "status": "SHIPPING",
  "note": "Đơn hàng đang được giao"
}
```

**Status Values:**

- `PENDING_PAYMENT`: Chờ thanh toán
- `PAID`: Đã thanh toán
- `PROCESSING`: Đang xử lý
- `SHIPPING`: Đang giao hàng
- `DELIVERED`: Đã giao hàng
- `CANCELLED`: Đã hủy

**Response (200 OK):**

```json
{
  "id": 1,
  "orderNumber": "ZIP-1700000000000-ABC123",
  "status": "SHIPPING",
  "note": "Đơn hàng đang được giao",
  "updatedAt": "2025-01-02T00:00:00.000Z"
}
```

### 5. Delete Order

Xóa đơn hàng (Admin only).

**Endpoint:** `DELETE /api/admin/orders/:id`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

---

## 🔒 Authorization

Tất cả các endpoint admin đều yêu cầu:

1. **JWT Token hợp lệ** trong header `Authorization: Bearer <token>`
2. **Role = "admin"** trong JWT payload

**Error Responses:**

- `401 Unauthorized`: Token không hợp lệ hoặc hết hạn
- `403 Forbidden`: User không có quyền admin

---

## 🛠️ Setup & Testing

### 1. Tạo Admin User

```bash
npm run create-admin
```

### 2. Login Admin

```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@zipit.com",
    "password": "admin123456"
  }'
```

### 3. Test Product API

```bash
# Get all products
curl -X GET http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer <your_token>"

# Create product
curl -X POST http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 100000,
    "image": "https://example.com/img.jpg",
    "category": "Test",
    "description": "Test description",
    "stock": 50
  }'
```

### 4. Test Order API

```bash
# Get all orders
curl -X GET http://localhost:3000/api/admin/orders \
  -H "Authorization: Bearer <your_token>"

# Update order status
curl -X PUT http://localhost:3000/api/admin/orders/1/status \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SHIPPING",
    "note": "Đang giao hàng"
  }'
```

---

## 📊 Statistics & Analytics

### Headers cho tất cả request

```http
Authorization: Bearer <your_admin_token>
```

### 1. Dashboard Overview

Lấy tổng quan thống kê cho admin dashboard.

**Endpoint:** `GET /api/admin/statistics/dashboard`

**Response (200 OK):**

```json
{
  "orders": {
    "totalOrders": 150,
    "paidOrders": 120,
    "totalRevenue": 45000000,
    "statusCounts": [
      { "status": "PENDING_PAYMENT", "count": 10 },
      { "status": "PAID", "count": 30 },
      { "status": "PROCESSING", "count": 40 },
      { "status": "SHIPPING", "count": 35 },
      { "status": "DELIVERED", "count": 30 },
      { "status": "CANCELLED", "count": 5 }
    ]
  },
  "products": {
    "totalProducts": 50,
    "inStockProducts": 45,
    "outOfStockProducts": 5,
    "categories": [
      { "category": "Túi Tote", "count": 20, "percentage": 40 },
      { "category": "Balo", "count": 15, "percentage": 30 },
      { "category": "Túi Xách", "count": 15, "percentage": 30 }
    ],
    "averagePrice": 175000
  },
  "users": {
    "totalUsers": 500,
    "usersByRole": [
      { "role": "user", "count": 495 },
      { "role": "admin", "count": 5 }
    ],
    "newUsersLast30Days": 45
  }
}
```

### 2. Revenue Analytics

Phân tích doanh thu theo thời gian và phương thức thanh toán.

**Endpoint:** `GET /api/admin/statistics/revenue`

**Query Parameters:**

- `period` (optional): `day` | `week` | `month` | `year` - Khoảng thời gian tính
- `fromDate` (optional): Từ ngày (ISO 8601) - Dùng cho custom range
- `toDate` (optional): Đến ngày (ISO 8601) - Dùng cho custom range

**Examples:**

```http
GET /api/admin/statistics/revenue?period=week
GET /api/admin/statistics/revenue?period=month
GET /api/admin/statistics/revenue?fromDate=2025-01-01&toDate=2025-01-31
```

**Response (200 OK):**

```json
{
  "totalRevenue": 15000000,
  "totalOrders": 50,
  "averageOrderValue": 300000,
  "period": {
    "type": "week",
    "fromDate": "2025-01-15T00:00:00.000Z",
    "toDate": "2025-01-22T00:00:00.000Z"
  },
  "revenueByPaymentMethod": [
    {
      "paymentMethod": "BANK_TRANSFER",
      "revenue": 8000000,
      "orderCount": 25,
      "percentage": 53.33
    },
    {
      "paymentMethod": "MOMO",
      "revenue": 5000000,
      "orderCount": 18,
      "percentage": 33.33
    },
    {
      "paymentMethod": "CREDIT_CARD",
      "revenue": 2000000,
      "orderCount": 7,
      "percentage": 13.33
    }
  ]
}
```

### 3. Product Statistics

Thống kê chi tiết về sản phẩm.

**Endpoint:** `GET /api/admin/statistics/products`

**Response (200 OK):**

```json
{
  "totalProducts": 50,
  "inStockProducts": 45,
  "outOfStockProducts": 5,
  "categories": [
    {
      "category": "Túi Tote",
      "count": 20,
      "percentage": 40
    },
    {
      "category": "Balo",
      "count": 15,
      "percentage": 30
    },
    {
      "category": "Túi Xách",
      "count": 15,
      "percentage": 30
    }
  ],
  "averagePrice": 175000,
  "priceRanges": [
    { "range": "< 100.000đ", "count": 10 },
    { "range": "100.000đ - 200.000đ", "count": 25 },
    { "range": "200.000đ - 300.000đ", "count": 10 },
    { "range": "> 300.000đ", "count": 5 }
  ],
  "topRatedProducts": [
    {
      "id": 5,
      "name": "Túi Tote Canvas Premium",
      "rating": 4.8,
      "reviews": 50,
      "price": 180000
    }
  ]
}
```

### 4. Order Analytics

Phân tích xu hướng đơn hàng.

**Endpoint:** `GET /api/admin/statistics/orders`

**Query Parameters:**

- `period` (optional): `day` | `week` | `month` | `year` - Khoảng thời gian phân tích

**Example:**

```http
GET /api/admin/statistics/orders?period=month
```

**Response (200 OK):**

```json
{
  "totalOrders": 150,
  "paidOrders": 120,
  "totalRevenue": 45000000,
  "statusCounts": [
    { "status": "PENDING_PAYMENT", "count": 10 },
    { "status": "PAID", "count": 30 },
    { "status": "PROCESSING", "count": 40 },
    { "status": "SHIPPING", "count": 35 },
    { "status": "DELIVERED", "count": 30 },
    { "status": "CANCELLED", "count": 5 }
  ],
  "ordersByDay": [
    { "date": "2025-01-01", "count": 5 },
    { "date": "2025-01-02", "count": 8 },
    { "date": "2025-01-03", "count": 6 }
  ],
  "averageProcessingTime": 2.5
}
```

**Note:** `averageProcessingTime` tính bằng ngày (từ khi tạo đơn đến khi giao hàng thành công).

### 5. Top Selling Products

Danh sách sản phẩm bán chạy nhất.

**Endpoint:** `GET /api/admin/statistics/top-products`

**Query Parameters:**

- `limit` (optional): Số lượng sản phẩm muốn lấy (default: 10)

**Example:**

```http
GET /api/admin/statistics/top-products?limit=5
```

**Response (200 OK):**

```json
[
  {
    "id": 5,
    "name": "Túi Tote Canvas Premium",
    "slug": "tui-tote-canvas-premium",
    "price": 180000,
    "priceFormatted": "180.000đ",
    "image": "https://...",
    "category": "Túi Tote",
    "rating": 4.8,
    "reviews": 50,
    "stock": 25
  },
  {
    "id": 8,
    "name": "Balo Du Lịch",
    "slug": "balo-du-lich",
    "price": 350000,
    "priceFormatted": "350.000đ",
    "image": "https://...",
    "category": "Balo",
    "rating": 4.7,
    "reviews": 42,
    "stock": 15
  }
]
```

**Note:** Sản phẩm được xếp hạng dựa trên số lượng reviews và rating trung bình.

### 6. Low Stock Alert

Danh sách sản phẩm sắp hết hàng.

**Endpoint:** `GET /api/admin/statistics/low-stock`

**Query Parameters:**

- `threshold` (optional): Ngưỡng tồn kho (default: 10)

**Example:**

```http
GET /api/admin/statistics/low-stock?threshold=5
```

**Response (200 OK):**

```json
[
  {
    "id": 12,
    "name": "Túi Xách Mini",
    "slug": "tui-xach-mini",
    "price": 120000,
    "priceFormatted": "120.000đ",
    "image": "https://...",
    "category": "Túi Xách",
    "stock": 3,
    "inStock": true
  },
  {
    "id": 7,
    "name": "Balo Laptop",
    "slug": "balo-laptop",
    "price": 280000,
    "priceFormatted": "280.000đ",
    "image": "https://...",
    "category": "Balo",
    "stock": 5,
    "inStock": true
  }
]
```

**Use Case:** Cảnh báo admin cần nhập thêm hàng cho các sản phẩm có tồn kho thấp.

# YÊU CẦU API CHO BACKEND - ZIP E-COMMERCE

## 📋 Mục lục
1. [Authentication APIs](#1-authentication-apis)
2. [Product APIs](#2-product-apis)
3. [Cart APIs](#3-cart-apis) (Optional - Frontend đang dùng localStorage)
4. [Order & Payment APIs](#4-order--payment-apis) ⚠️ **BẮT BUỘC**
5. [Voucher APIs](#5-voucher-apis)
6. [Customer APIs](#6-customer-apis)
7. [Review APIs](#7-review-apis)
8. [Service & Customization APIs](#8-service--customization-apis)

---

## 1. Authentication APIs

### 1.1. POST `/api/auth/register`
**Mô tả:** Đăng ký tài khoản mới

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "SecurePass123!",
  "name": "Nguyễn Văn A",
  "phone": "0912345678"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "userId": 1,
    "email": "customer@example.com",
    "name": "Nguyễn Văn A",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Email đã tồn tại",
  "errors": ["Email đã được đăng ký"]
}
```

---

### 1.2. POST `/api/auth/login`
**Mô tả:** Đăng nhập

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "SecurePass123!"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "userId": 1,
    "email": "customer@example.com",
    "name": "Nguyễn Văn A",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 1.3. POST `/api/auth/logout`
**Mô tả:** Đăng xuất

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

## 2. Product APIs

### 2.1. GET `/api/products`
**Mô tả:** Lấy danh sách sản phẩm (có pagination, filter, sort)

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 12)
- `category` (string, optional)
- `minPrice` (number, optional)
- `maxPrice` (number, optional)
- `sort` (string: "price_asc", "price_desc", "name_asc", "name_desc", "newest")
- `search` (string, optional)

**Example Request:**
```
GET /api/products?page=1&limit=12&category=túi-tote&sort=price_asc
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Túi Tote Canvas",
        "slug": "tui-tote-canvas",
        "description": "Túi tote canvas thân thiện với môi trường...",
        "price": 15000,
        "priceFormatted": "15.000đ",
        "image": "/products/tote-canvas.jpg",
        "images": ["/products/tote-1.jpg", "/products/tote-2.jpg"],
        "category": "Túi Tote",
        "tags": ["Eco-Friendly", "Canvas", "Handmade"],
        "rating": 5,
        "reviews": 128,
        "inStock": true,
        "stock": 50,
        "sku": "TOT-001"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 60,
      "itemsPerPage": 12,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 2.2. GET `/api/products/:id`
**Mô tả:** Lấy chi tiết 1 sản phẩm

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Túi Tote Canvas",
    "slug": "tui-tote-canvas",
    "description": "Túi tote canvas thân thiện với môi trường...",
    "detailedDescription": "Được chế tác từ vật liệu thân thiện với môi trường...",
    "price": 15000,
    "priceRange": "15.000đ - 20.000đ",
    "image": "/products/tote-canvas.jpg",
    "images": [
      "/products/tote-1.jpg",
      "/products/tote-2.jpg",
      "/products/tote-3.jpg"
    ],
    "category": "Túi Tote",
    "tags": ["Eco-Friendly", "Canvas", "Handmade"],
    "rating": 5,
    "reviews": 128,
    "inStock": true,
    "stock": 50,
    "sku": "TOT-001",
    "specifications": {
      "material": "Canvas cao cấp",
      "size": "40cm x 35cm x 10cm",
      "weight": "200g",
      "color": "Nhiều màu"
    },
    "customizationOptions": [
      {
        "id": 1,
        "type": "embroidery",
        "name": "Thêu tên",
        "price": 5000,
        "description": "Thêu tên hoặc chữ cái lên sản phẩm"
      },
      {
        "id": 2,
        "type": "print",
        "name": "In hình",
        "price": 3000,
        "description": "In hình ảnh hoặc logo"
      }
    ],
    "relatedProducts": [2, 3, 4, 5]
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy sản phẩm"
}
```

---

### 2.3. GET `/api/categories`
**Mô tả:** Lấy danh sách danh mục

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Túi Tote",
      "slug": "tui-tote",
      "productCount": 15,
      "image": "/categories/tote.jpg"
    },
    {
      "id": 2,
      "name": "Túi Đeo Chéo",
      "slug": "tui-deo-cheo",
      "productCount": 12,
      "image": "/categories/crossbody.jpg"
    }
  ]
}
```

---

## 3. Cart APIs

> **LƯU Ý:** Frontend hiện đang sử dụng localStorage để quản lý giỏ hàng. 
> Các API này là **OPTIONAL** nếu muốn sync cart lên server (cho multi-device).

### 3.1. GET `/api/cart`
**Mô tả:** Lấy giỏ hàng của user

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Túi Tote Canvas",
        "price": 15000,
        "quantity": 2,
        "customization": {
          "type": "embroidery",
          "text": "My Name",
          "price": 5000
        },
        "subtotal": 40000
      }
    ],
    "totalItems": 2,
    "totalPrice": 40000
  }
}
```

---

### 3.2. POST `/api/cart/add`
**Mô tả:** Thêm sản phẩm vào giỏ

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2,
  "customization": {
    "type": "embroidery",
    "text": "My Name",
    "price": 5000
  }
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đã thêm vào giỏ hàng",
  "data": {
    "cartItemId": 1,
    "totalItems": 3
  }
}
```

---

### 3.3. PUT `/api/cart/:itemId`
**Mô tả:** Cập nhật số lượng sản phẩm trong giỏ

**Request Body:**
```json
{
  "quantity": 5
}
```

---

### 3.4. DELETE `/api/cart/:itemId`
**Mô tả:** Xóa sản phẩm khỏi giỏ

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đã xóa khỏi giỏ hàng"
}
```

---

## 4. Order & Payment APIs

> ⚠️ **CỰC KỲ QUAN TRỌNG** - Đây là API chính cho luồng thanh toán PayOS

### 4.1. POST `/api/payment/create` ⭐ **BẮT BUỘC**

**Mô tả:** Tạo payment link PayOS cho đơn hàng

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token} (optional - nếu user đã đăng nhập)
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "name": "Túi Tote Canvas",
      "price": 15000,
      "quantity": 2,
      "customization": {
        "type": "embroidery",
        "text": "My Name",
        "price": 5000
      }
    },
    {
      "productId": 3,
      "name": "Túi Đeo Chéo Da",
      "price": 35000,
      "quantity": 1,
      "customization": null
    }
  ],
  "customerInfo": {
    "name": "Nguyễn Văn A",
    "phone": "0912345678",
    "email": "customer@example.com",
    "province": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "address": "123 Nguyễn Huệ, Phường Bến Nghé",
    "note": "Giao hàng buổi sáng"
  },
  "totalPrice": 70000,
  "shippingFee": 30000,
  "discount": 0,
  "finalTotal": 100000,
  "voucher": "SAVE10"
}
```

**Backend phải làm:**
1. Validate dữ liệu (kiểm tra products tồn tại, giá đúng, stock đủ)
2. Tạo order record trong database với status `PENDING_PAYMENT`
3. Sử dụng PayOS SDK để tạo payment link:
   ```javascript
   const paymentData = {
     orderCode: order.id,
     amount: finalTotal,
     description: `Thanh toan don hang #${order.id}`,
     cancelUrl: `${FRONTEND_URL}/payment/failed?orderCode=${order.id}`,
     returnUrl: `${FRONTEND_URL}/payment/success?orderCode=${order.id}`,
     webhookUrl: `${BACKEND_URL}/api/payment/webhook`
   };
   const paymentLink = await payOS.createPaymentLink(paymentData);
   ```
4. Lưu `paymentLinkId` và `paymentUrl` vào database
5. Trả về payment URL cho frontend

**Response Success (200):**
```json
{
  "success": true,
  "message": "Tạo liên kết thanh toán thành công",
  "data": {
    "orderCode": 12345,
    "paymentUrl": "https://pay.payos.vn/web/xxxxx",
    "qrCode": "https://api.payos.vn/qr/xxxxx.png",
    "amount": 100000
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Không thể tạo thanh toán",
  "errors": [
    "Sản phẩm ID 1 đã hết hàng",
    "Giá sản phẩm ID 3 không khớp"
  ]
}
```

---

### 4.2. POST `/api/payment/webhook` ⭐ **BẮT BUỘC**

**Mô tả:** Webhook để PayOS gọi về khi thanh toán hoàn tất

> **LƯU Ý:** Endpoint này phải public, không cần authentication. PayOS sẽ gọi từ server của họ.

**Request Body từ PayOS:**
```json
{
  "orderCode": 12345,
  "amount": 100000,
  "description": "Thanh toan don hang #12345",
  "accountNumber": "1234567890",
  "reference": "FT12345678",
  "transactionDateTime": "2025-11-12T10:30:00Z",
  "currency": "VND",
  "paymentLinkId": "xxxxx",
  "code": "00",
  "desc": "Thành công",
  "counterAccountBankId": "970422",
  "counterAccountBankName": "MB Bank",
  "counterAccountName": "NGUYEN VAN A",
  "counterAccountNumber": "0987654321",
  "virtualAccountName": "ZIP COMPANY",
  "virtualAccountNumber": "1234567890"
}
```

**Backend phải làm:**
1. **Verify webhook signature** từ PayOS (quan trọng!)
   ```javascript
   const isValid = payOS.verifyPaymentWebhookData(webhookData);
   if (!isValid) {
     return res.status(401).json({ success: false });
   }
   ```

2. Kiểm tra `orderCode` có tồn tại không

3. Kiểm tra `amount` có khớp với database không

4. Nếu `code === "00"` (thành công):
   - Cập nhật order status: `PENDING_PAYMENT` → `PAID`
   - Lưu `transactionId`, `paidAt`
   - Giảm stock của products
   - Gửi email xác nhận cho khách hàng
   - Tạo shipping label (nếu có tích hợp)

5. Nếu thất bại:
   - Cập nhật status: `PAYMENT_FAILED`
   - Log lý do

**Response (200):**
```json
{
  "success": true
}
```

**Cấu trúc Payment Status Codes từ PayOS:**
- `"00"` - Thành công
- `"01"` - Thất bại  
- `"02"` - Đang xử lý
- `"03"` - Đã hủy

---

### 4.3. GET `/api/payment/status/:orderCode`

**Mô tả:** Kiểm tra trạng thái thanh toán của đơn hàng

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "orderCode": 12345,
    "status": "PAID",
    "paymentStatus": "COMPLETED",
    "amount": 100000,
    "paidAt": "2025-11-12T10:30:00Z",
    "transactionId": "FT12345678"
  }
}
```

**Các Order Status:**
- `PENDING_PAYMENT` - Chờ thanh toán
- `PAID` - Đã thanh toán
- `CONFIRMED` - Đã xác nhận
- `PROCESSING` - Đang xử lý
- `SHIPPING` - Đang giao hàng
- `DELIVERED` - Đã giao hàng
- `COMPLETED` - Hoàn thành
- `CANCELLED` - Đã hủy
- `REFUNDED` - Đã hoàn tiền
- `PAYMENT_FAILED` - Thanh toán thất bại

---

### 4.4. GET `/api/orders`

**Mô tả:** Lấy danh sách đơn hàng của user

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional): filter theo status

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 12345,
        "orderCode": "ORD-12345",
        "status": "PAID",
        "totalAmount": 100000,
        "itemCount": 3,
        "createdAt": "2025-11-12T10:00:00Z",
        "paidAt": "2025-11-12T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

---

### 4.5. GET `/api/orders/:orderCode`

**Mô tả:** Lấy chi tiết 1 đơn hàng

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "orderCode": "ORD-12345",
    "status": "PAID",
    "paymentStatus": "COMPLETED",
    "items": [
      {
        "productId": 1,
        "productName": "Túi Tote Canvas",
        "price": 15000,
        "quantity": 2,
        "customization": {
          "type": "embroidery",
          "text": "My Name",
          "price": 5000
        },
        "subtotal": 40000,
        "image": "/products/tote-canvas.jpg"
      }
    ],
    "customer": {
      "name": "Nguyễn Văn A",
      "phone": "0912345678",
      "email": "customer@example.com"
    },
    "shippingAddress": {
      "address": "123 Nguyễn Huệ, Phường Bến Nghé",
      "district": "Quận 1",
      "province": "TP. Hồ Chí Minh"
    },
    "note": "Giao hàng buổi sáng",
    "totalPrice": 70000,
    "shippingFee": 30000,
    "discount": 0,
    "finalTotal": 100000,
    "transactionId": "FT12345678",
    "createdAt": "2025-11-12T10:00:00Z",
    "paidAt": "2025-11-12T10:30:00Z",
    "shippingAt": null,
    "deliveredAt": null
  }
}
```

---

### 4.6. POST `/api/orders/:orderCode/cancel`

**Mô tả:** Hủy đơn hàng (chỉ được hủy khi chưa xử lý)

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "reason": "Đặt nhầm sản phẩm"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đã hủy đơn hàng thành công"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Không thể hủy đơn hàng đã được xử lý"
}
```

---

## 5. Voucher APIs

### 5.1. GET `/api/vouchers`

**Mô tả:** Lấy danh sách voucher khả dụng

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "SAVE10",
      "description": "Giảm 10% tối đa 50.000đ",
      "discountType": "percentage",
      "discountValue": 10,
      "maxDiscount": 50000,
      "minOrderValue": 100000,
      "validFrom": "2025-11-01T00:00:00Z",
      "validTo": "2025-11-30T23:59:59Z",
      "usageLimit": 1000,
      "usedCount": 234,
      "isActive": true
    }
  ]
}
```

---

### 5.2. POST `/api/vouchers/validate`

**Mô tả:** Kiểm tra voucher có hợp lệ không

**Request Body:**
```json
{
  "code": "SAVE10",
  "orderTotal": 150000
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "discountAmount": 15000,
    "finalAmount": 135000,
    "message": "Áp dụng voucher thành công"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Voucher không hợp lệ",
  "errors": ["Đơn hàng chưa đủ điều kiện tối thiểu 100.000đ"]
}
```

---

## 6. Customer APIs

### 6.1. GET `/api/customer/profile`

**Mô tả:** Lấy thông tin profile

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "customer@example.com",
    "name": "Nguyễn Văn A",
    "phone": "0912345678",
    "avatar": "/avatars/1.jpg",
    "addresses": [
      {
        "id": 1,
        "name": "Nhà riêng",
        "address": "123 Nguyễn Huệ",
        "district": "Quận 1",
        "province": "TP. Hồ Chí Minh",
        "phone": "0912345678",
        "isDefault": true
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### 6.2. PUT `/api/customer/profile`

**Mô tả:** Cập nhật profile

**Request Body:**
```json
{
  "name": "Nguyễn Văn B",
  "phone": "0987654321",
  "avatar": "base64_image_string_or_url"
}
```

---

### 6.3. POST `/api/customer/addresses`

**Mô tả:** Thêm địa chỉ mới

**Request Body:**
```json
{
  "name": "Văn phòng",
  "address": "456 Lê Lợi",
  "district": "Quận 1",
  "province": "TP. Hồ Chí Minh",
  "phone": "0912345678",
  "isDefault": false
}
```

---

## 7. Review APIs

### 7.1. GET `/api/products/:productId/reviews`

**Mô tả:** Lấy đánh giá của sản phẩm

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `rating` (number 1-5, optional): filter theo số sao

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "userId": 123,
        "userName": "Nguyễn Văn A",
        "userAvatar": "/avatars/123.jpg",
        "rating": 5,
        "comment": "Sản phẩm rất tốt, chất lượng cao!",
        "images": ["/reviews/1-1.jpg", "/reviews/1-2.jpg"],
        "createdAt": "2025-11-10T10:00:00Z",
        "helpful": 15,
        "verified": true
      }
    ],
    "summary": {
      "averageRating": 4.8,
      "totalReviews": 128,
      "ratingDistribution": {
        "5": 100,
        "4": 20,
        "3": 5,
        "2": 2,
        "1": 1
      }
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 13,
      "totalItems": 128
    }
  }
}
```

---

### 7.2. POST `/api/products/:productId/reviews`

**Mô tả:** Viết đánh giá sản phẩm

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Sản phẩm rất tốt!",
  "images": ["base64_image_1", "base64_image_2"]
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Đánh giá của bạn đã được gửi",
  "data": {
    "reviewId": 1
  }
}
```

---

## 8. Service & Customization APIs

### 8.1. GET `/api/services`

**Mô tả:** Lấy danh sách dịch vụ (thêu, in, premium)

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "embroidery",
      "name": "Dịch Vụ Thêu",
      "description": "Thêu tên, chữ cái hoặc logo lên sản phẩm",
      "basePrice": 5000,
      "estimatedDays": 3,
      "options": [
        {
          "id": 1,
          "name": "Thêu tên (3-10 ký tự)",
          "price": 5000
        },
        {
          "id": 2,
          "name": "Thêu logo",
          "price": 10000
        }
      ],
      "isAvailable": true
    }
  ]
}
```

---

### 8.2. POST `/api/customization/quote`

**Mô tả:** Tính giá dịch vụ customize

**Request Body:**
```json
{
  "productId": 1,
  "serviceType": "embroidery",
  "text": "My Custom Text",
  "quantity": 2
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "servicePrice": 5000,
    "totalPrice": 10000,
    "estimatedDays": 3
  }
}
```

---

## 📊 Database Schema Requirements

Backend cần tạo các bảng sau (tối thiểu):

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(50) UNIQUE NOT NULL,
  user_id INT REFERENCES users(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  shipping_address TEXT NOT NULL,
  shipping_province VARCHAR(100),
  shipping_district VARCHAR(100),
  note TEXT,
  total_price INT NOT NULL,
  shipping_fee INT NOT NULL,
  discount INT DEFAULT 0,
  final_total INT NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING_PAYMENT',
  payment_status VARCHAR(50) DEFAULT 'PENDING',
  payment_link_id VARCHAR(255),
  payment_url TEXT,
  transaction_id VARCHAR(255),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_code (order_code),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  quantity INT NOT NULL,
  customization_type VARCHAR(50),
  customization_text TEXT,
  customization_price INT DEFAULT 0,
  subtotal INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  detailed_description TEXT,
  price INT NOT NULL,
  image VARCHAR(500),
  category_id INT REFERENCES categories(id),
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  stock INT DEFAULT 0,
  sku VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category_id)
);
```

---

## 🔐 Authentication & Security

### JWT Token Structure
```json
{
  "userId": 1,
  "email": "customer@example.com",
  "role": "customer",
  "iat": 1699776000,
  "exp": 1699862400
}
```

### Headers cho Protected Routes
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Rate Limiting
- `/api/auth/login`: 5 requests / 15 minutes / IP
- `/api/auth/register`: 3 requests / hour / IP
- `/api/payment/create`: 10 requests / minute / user
- Other routes: 100 requests / minute / user

---

## 📧 Email Templates Required

### 1. Order Confirmation Email
**Trigger:** Sau khi webhook confirm payment success

**Subject:** `Xác nhận đơn hàng #{{orderCode}} - ZIP`

**Content:**
```
Kính chào {{customerName}},

Cảm ơn bạn đã đặt hàng tại ZIP!

━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 THÔNG TIN ĐƠN HÀNG
━━━━━━━━━━━━━━━━━━━━━━━━━━

Mã đơn hàng: #{{orderCode}}
Ngày đặt: {{orderDate}}
Trạng thái: Đã thanh toán ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━
🛍️ SẢN PHẨM
━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each items}}
- {{name}} x{{quantity}}: {{subtotal}}đ
{{/each}}

Tạm tính: {{totalPrice}}đ
Phí vận chuyển: {{shippingFee}}đ
Giảm giá: -{{discount}}đ
━━━━━━━━━━━━━━━━━━━━━━━━━━
TỔNG CỘNG: {{finalTotal}}đ
━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 ĐỊA CHỈ GIAO HÀNG

{{customerName}}
{{phone}}
{{address}}, {{district}}, {{province}}

⏰ Đơn hàng sẽ được giao trong 3-5 ngày làm việc.

Mọi thắc mắc xin liên hệ:
📞 Hotline: 0945000334
📧 Email: support@zip.com

Trân trọng,
ZIP Team
```

### 2. Order Status Update Email
**Trigger:** Khi order status thay đổi

---

## 🧪 Testing & Validation

### Test Cases Backend Cần Cover

#### Payment Flow
- ✅ Tạo payment link thành công
- ✅ Tạo payment link thất bại (thiếu thông tin)
- ✅ Tạo payment link thất bại (sản phẩm hết hàng)
- ✅ Tạo payment link thất bại (giá không khớp)
- ✅ Webhook callback khi thanh toán thành công
- ✅ Webhook callback khi thanh toán thất bại
- ✅ Webhook signature không hợp lệ → reject
- ✅ Webhook với amount không khớp → reject
- ✅ Webhook với orderCode không tồn tại → reject
- ✅ Email confirmation được gửi sau payment success
- ✅ Stock được giảm đúng sau payment success
- ✅ Không giảm stock nếu payment failed

#### Order Management
- ✅ Lấy danh sách orders có pagination
- ✅ Lấy chi tiết order
- ✅ Cancel order khi status = PENDING_PAYMENT
- ✅ Không cho cancel order khi status = PROCESSING

---

## 🚀 Priority Implementation Order

### Phase 1: CRITICAL (Implement ngay)
1. ✅ POST `/api/payment/create`
2. ✅ POST `/api/payment/webhook`
3. ✅ GET `/api/payment/status/:orderCode`
4. ✅ GET `/api/products`
5. ✅ GET `/api/products/:id`
6. ✅ Database schema (orders, order_items, products)
7. ✅ Email service (order confirmation)

### Phase 2: HIGH (Implement sau)
8. Authentication APIs
9. GET `/api/orders`
10. GET `/api/orders/:orderCode`
11. POST `/api/orders/:orderCode/cancel`
12. Voucher validate API

### Phase 3: MEDIUM (Có thể implement sau)
13. Cart sync APIs (nếu cần multi-device)
14. Review APIs
15. Customer profile APIs
16. Service & customization APIs

---

## 📞 Contact & Support

**Frontend Developer Contact:**
- Đã implement xong toàn bộ frontend
- Đang chờ backend APIs để tích hợp

**PayOS Support:**
- Email: support@payos.vn
- Documentation: https://payos.vn/docs

**Critical Files to Read:**
- `PAYOS_BACKEND_INTEGRATION.md` - Chi tiết PayOS integration
- `CART_PAYMENT_IMPLEMENTATION.md` - Frontend đã implement gì

---

## ✅ Acceptance Criteria

Backend được coi là **hoàn thành** khi:

1. ✅ Frontend có thể gọi `/api/payment/create` và nhận được `paymentUrl`
2. ✅ User thanh toán trên PayOS và được redirect về `/payment/success`
3. ✅ Webhook từ PayOS được xử lý đúng
4. ✅ Order status được cập nhật trong database
5. ✅ Email confirmation được gửi cho customer
6. ✅ Stock được giảm sau thanh toán thành công
7. ✅ Frontend có thể query được order status
8. ✅ Có logs đầy đủ cho debugging
9. ✅ Có monitoring cho payment failures
10. ✅ Unit tests & integration tests pass

---

**Tạo bởi:** Frontend Team
**Ngày:** November 12, 2025
**Version:** 1.0.0

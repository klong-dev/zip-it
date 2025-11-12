# HƯỚNG DẪN TÍCH HỢP API - ZIP E-COMMERCE

## 📋 Tóm Tắt

Đã hoàn thành tích hợp API backend theo tài liệu `API_INTEGRATION_GUIDE.md`:

### ✅ Đã Hoàn Thành

1. **Cài đặt axios** (`npm install axios`)

2. **Tạo axios instance** (`src/lib/api.ts`):
   - Base URL: `http://localhost:3011/api`
   - Request interceptor: Tự động thêm JWT token vào headers
   - Response interceptor: Xử lý errors tập trung (401, 400, 404, 500)

3. **Tạo API Service Functions** (`src/lib/apiService.ts`):
   - ✅ **Auth APIs**: register, login
   - ✅ **Products APIs**: getAll (với filters/pagination), getById, getCategories
   - ✅ **Payment APIs**: create, getStatus ⭐ QUAN TRỌNG
   - ✅ **Orders APIs**: getAll, getById
   - ✅ **Cart APIs**: get, addItem, updateItem, deleteItem, clear (tùy chọn)
   - ✅ **User APIs**: getProfile

4. **Cập nhật Components sử dụng API thực**:

   **a. Checkout Page** (`src/app/checkout/page.tsx`):
   ```typescript
   // Gọi API tạo payment link
   const { paymentAPI } = await import("@/lib/apiService");
   const response = await paymentAPI.create(orderData);
   window.location.href = response.data.checkoutUrl;
   ```
   - ✅ Validate form đầy đủ (name, phone, address, province, district)
   - ✅ Gửi order data đúng format API
   - ✅ Handle errors từ backend
   - ✅ Redirect đến PayOS payment page

   **b. Payment Success Page** (`src/app/payment/success/page.tsx`):
   ```typescript
   // Check payment status từ backend
   const response = await paymentAPI.getStatus(orderCode);
   if (response.data.status === 'PAID') {
     clearCart();
     // Show success
   }
   ```
   - ✅ Polling payment status từ backend
   - ✅ Auto clear cart khi thanh toán thành công
   - ✅ Hiển thị orderNumber, amount, paidAt từ API
   - ✅ Loading state trong khi check status

   **c. Shop Page** (`src/app/shop/page.tsx`):
   ```typescript
   // Load products từ API
   const response = await productsAPI.getAll({
     page, limit, category, sort
   });
   setProducts(response.data.products);
   ```
   - ✅ Load products từ backend API
   - ✅ Filters: sort by (newest, price, name)
   - ✅ Pagination với totalPages
   - ✅ Fallback về dữ liệu local nếu API fail
   - ✅ Loading state & error handling

   **d. Product Detail Page** (`src/app/shop/[id]/page.tsx`):
   ```typescript
   // Load chi tiết sản phẩm
   const response = await productsAPI.getById(productId);
   setProduct(response.data);
   ```
   - ✅ Load product detail từ API
   - ✅ Hiển thị: stock status, specifications, rating, reviews
   - ✅ Fallback về local data nếu API fail
   - ✅ Loading spinner

---

## 🔧 Cấu Hình Backend

### Backend URL
```typescript
// src/lib/api.ts
baseURL: 'http://localhost:3011/api'
```

### Endpoints Được Sử Dụng

| Endpoint | Method | Mục đích | Component |
|----------|--------|----------|-----------|
| `/products` | GET | Lấy danh sách sản phẩm | Shop Page |
| `/products/:id` | GET | Chi tiết sản phẩm | Product Detail |
| `/payment/create` | POST | Tạo payment link PayOS | Checkout |
| `/payment/status/:orderCode` | GET | Check trạng thái thanh toán | Success Page |
| `/auth/register` | POST | Đăng ký tài khoản | (Chưa có UI) |
| `/auth/login` | POST | Đăng nhập | (Chưa có UI) |

---

## 🚀 Hướng Dẫn Sử Dụng

### 1. Start Backend Server
```bash
cd zip-backend
npm run start:dev
```
Backend chạy tại: `http://localhost:3011`

### 2. Start Frontend (Next.js)
```bash
cd zip
npm run dev
```
Frontend chạy tại: `http://localhost:3000`

### 3. Test Payment Flow

**Bước 1**: Thêm sản phẩm vào giỏ
- Vào `/shop` → Click sản phẩm → "THÊM VÀO GIỎ HÀNG"

**Bước 2**: Checkout
- Click icon giỏ hàng trên Header
- "TIẾN HÀNH THANH TOÁN"
- Điền form thông tin giao hàng
- Click "THANH TOÁN QUA PAYOS"

**Bước 3**: Backend xử lý
- Backend nhận request từ `POST /api/payment/create`
- Validate sản phẩm, giá, stock
- Tạo order trong database (status: PENDING_PAYMENT)
- Call PayOS API để tạo payment link
- Trả về `checkoutUrl` cho frontend

**Bước 4**: User thanh toán trên PayOS
- Frontend redirect user đến PayOS
- User nhập thông tin thẻ/chuyển khoản
- PayOS xử lý thanh toán

**Bước 5**: PayOS Webhook
- PayOS gọi `POST /api/payment/webhook`
- Backend verify signature
- Update order status: PAID
- Giảm stock
- Gửi email xác nhận

**Bước 6**: Redirect về Frontend
- PayOS redirect về `/payment/success?orderCode=xxx`
- Frontend gọi `GET /api/payment/status/:orderCode`
- Hiển thị thông tin đơn hàng
- Clear cart

---

## 🔍 API Request/Response Examples

### 1. Create Payment

**Request**:
```javascript
POST http://localhost:3011/api/payment/create
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "name": "Túi Tote Canvas",
      "price": 150000,
      "quantity": 2,
      "customization": null
    }
  ],
  "customerInfo": {
    "name": "Nguyễn Văn A",
    "email": "test@example.com",
    "phoneNumber": "0912345678",
    "province": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "address": "123 Nguyễn Huệ"
  },
  "totalPrice": 300000,
  "shippingFee": 30000,
  "discount": 0,
  "finalTotal": 330000
}
```

**Response Success**:
```json
{
  "success": true,
  "message": "Tạo liên kết thanh toán thành công",
  "data": {
    "checkoutUrl": "https://pay.payos.vn/web/xxxxx",
    "orderCode": "1234567890",
    "orderId": 1
  }
}
```

**Response Error**:
```json
{
  "success": false,
  "message": "Không thể tạo thanh toán",
  "errors": [
    "Sản phẩm ID 1 không khả dụng",
    "Sản phẩm ID 3 đã hết hàng"
  ]
}
```

### 2. Get Payment Status

**Request**:
```javascript
GET http://localhost:3011/api/payment/status/1234567890
```

**Response**:
```json
{
  "success": true,
  "data": {
    "orderCode": 1,
    "orderNumber": "ORD-1-1731427200000",
    "status": "PAID",
    "paymentStatus": "COMPLETED",
    "amount": 330000,
    "paidAt": "2025-11-12T10:30:00.000Z",
    "transactionId": "FT12345678"
  }
}
```

### 3. Get Products

**Request**:
```javascript
GET http://localhost:3011/api/products?category=Túi%20Tote&sort=price_asc&page=1&limit=12
```

**Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Túi Tote Canvas",
        "price": 150000,
        "priceFormatted": "150.000đ",
        "image": "/products/tote.jpg",
        "category": "Túi Tote",
        "inStock": true,
        "stock": 50,
        "rating": 4.8,
        "reviews": 128
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 30,
      "itemsPerPage": 12
    }
  }
}
```

---

## 🛠️ Error Handling

### Axios Interceptor xử lý tự động

```typescript
// 401 Unauthorized
- Xóa token
- Redirect đến /login (nếu cần)

// 400 Bad Request
- Log validation errors
- Toast notification

// 404 Not Found
- Log "Không tìm thấy dữ liệu"

// 500 Internal Server Error
- Toast "Lỗi server, vui lòng thử lại"

// Network Error
- Fallback về dữ liệu local
- Toast cảnh báo "Backend API chưa khả dụng"
```

### Fallback Strategy

Khi backend API không available:
1. Shop Page → Load từ `src/lib/products.ts`
2. Product Detail → Load từ `src/lib/products.ts`
3. Checkout → Không thể xử lý (cần backend bắt buộc)
4. Payment → Không thể xử lý (cần backend bắt buộc)

---

## 📝 Lưu Ý Quan Trọng

### 1. CORS Configuration
Backend phải enable CORS cho frontend:
```typescript
// Backend NestJS
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true
});
```

### 2. PayOS Credentials
**CHỈ LƯU Ở BACKEND** - KHÔNG BAO GIỜ để ở frontend!

Backend `.env`:
```env
PAYOS_CLIENT_ID=3349a31d-8110-4ea4-a227-f6c497b4ad81
PAYOS_API_KEY=718fe63b-f8fb-4685-80a9-7bb21c850c9c
PAYOS_CHECKSUM_KEY=c361d06de5d30ba08a7ebee9b6e9bdeb4ea7fdcc5b4c5e0164df93edee831ce4
```

### 3. Return URLs cho PayOS
Cấu hình trong PayOS Dashboard:
- **Success URL**: `http://localhost:3000/payment/success?orderCode={orderCode}`
- **Cancel URL**: `http://localhost:3000/payment/failed?orderCode={orderCode}`

### 4. Authentication (Tùy chọn)
Hiện tại chưa có UI login/register. Nếu cần:
- Tạo `/login` và `/register` pages
- Sử dụng `authAPI.login()` và `authAPI.register()`
- Lưu token vào localStorage
- Token sẽ tự động được thêm vào headers bởi axios interceptor

---

## 🧪 Testing

### Test với Postman/cURL

1. **Test API trực tiếp**:
   - Import collection từ `API_INTEGRATION_GUIDE.md`
   - Swagger docs: `http://localhost:3011/api/docs`

2. **Test frontend integration**:
   ```bash
   # Mở browser console (F12)
   # Xem network requests khi:
   - Load shop page
   - View product detail
   - Add to cart
   - Checkout
   ```

### Mock Payment Testing
PayOS có test mode với test cards:
- Card number: `9704 0000 0000 0018`
- Expiry: `03/07`
- CVV: `123`
- OTP: `123456`

---

## 📊 API Status Dashboard

| Feature | Frontend | Backend API | Status |
|---------|----------|-------------|--------|
| View Products | ✅ | ✅ | Ready |
| Product Detail | ✅ | ✅ | Ready |
| Add to Cart | ✅ | N/A | LocalStorage |
| Checkout Form | ✅ | ✅ | Ready |
| Payment Create | ✅ | ✅ | Ready |
| Payment Status | ✅ | ✅ | Ready |
| PayOS Webhook | N/A | ✅ | Ready |
| Order History | ❌ | ✅ | Cần UI |
| Auth (Login/Register) | ❌ | ✅ | Cần UI |

---

## 🔜 Next Steps

### Frontend Cần Bổ Sung
1. **Login/Register Pages**
2. **Order History Page** (`/orders`)
3. **User Profile Page** (`/profile`)
4. **Password Reset Flow**
5. **Product Search với filters nâng cao**

### Backend Đang Chờ
- ✅ Products API
- ✅ Payment API (POST /payment/create)
- ✅ Payment Webhook (POST /payment/webhook)
- ✅ Payment Status (GET /payment/status/:orderCode)
- ⏳ Orders API
- ⏳ Auth API
- ⏳ Reviews API
- ⏳ Vouchers API

---

## 📞 Liên Hệ Backend Team

Nếu cần support API:
1. Check Swagger docs: `http://localhost:3011/api/docs`
2. Xem file `API_INTEGRATION_GUIDE.md`
3. Check logs backend: `npm run start:dev`

---

**Version**: 1.0.0  
**Last Updated**: November 12, 2025  
**Status**: ✅ Core APIs Integrated - Payment Flow Ready

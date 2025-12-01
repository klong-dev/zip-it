# USER API DOCUMENTATION

Tài liệu này mô tả các API endpoints cần được backend thực hiện để hỗ trợ chức năng quản lý tài khoản người dùng (đăng nhập, đơn hàng, địa chỉ).

## Base URL
```
https://zip.klong.io.vn/api
```

---

## 1. XÁC THỰC NGƯỜI DÙNG (Authentication)

> **Lưu ý:** Frontend sử dụng Supabase Authentication, do đó việc xác thực user được thực hiện qua Supabase. Backend cần xác thực JWT token từ Supabase để xác định user.

### Header cần gửi kèm
```
Authorization: Bearer <supabase_access_token>
```

---

## 2. ĐƠN HÀNG CỦA NGƯỜI DÙNG (User Orders)

### 2.1. Lấy danh sách đơn hàng của người dùng

**Endpoint:** `GET /orders/my-orders`

**Mô tả:** Lấy tất cả đơn hàng của người dùng đang đăng nhập

**Headers:**
```
Authorization: Bearer <supabase_access_token>
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "order_code": "ORD-20250101-001",
        "status": "paid",
        "total_amount": 500000,
        "payment_method": "payos",
        "created_at": "2025-01-01T10:00:00Z",
        "updated_at": "2025-01-01T10:30:00Z",
        "items": [
          {
            "product_id": 1,
            "product_name": "Áo thun ZIP",
            "quantity": 2,
            "price": 200000,
            "image_url": "https://example.com/image.jpg"
          }
        ],
        "shipping_address": {
          "full_name": "Nguyễn Văn A",
          "phone": "0912345678",
          "address": "123 Đường ABC",
          "province": "Hồ Chí Minh",
          "district": "Quận 1",
          "ward": "Phường Bến Nghé"
        }
      }
    ]
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or expired token"
}
```

---

### 2.2. Hủy đơn hàng

**Endpoint:** `POST /orders/{orderId}/cancel`

**Mô tả:** Hủy đơn hàng. Chỉ cho phép hủy khi đơn hàng có trạng thái: `pending`, `awaiting_payment`, hoặc `paid`

**Headers:**
```
Authorization: Bearer <supabase_access_token>
```

**Path Parameters:**
| Parameter | Type | Mô tả |
|-----------|------|-------|
| orderId | number | ID của đơn hàng cần hủy |

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đơn hàng đã được hủy thành công"
}
```

**Response Error (400 - Không thể hủy):**
```json
{
  "success": false,
  "message": "Không thể hủy đơn hàng đang được xử lý hoặc đã giao"
}
```

**Response Error (403 - Không có quyền):**
```json
{
  "success": false,
  "message": "Bạn không có quyền hủy đơn hàng này"
}
```

**Response Error (404 - Không tìm thấy):**
```json
{
  "success": false,
  "message": "Không tìm thấy đơn hàng"
}
```

---

## 3. QUẢN LÝ ĐỊA CHỈ (Address Management)

### 3.1. Lấy danh sách địa chỉ

**Endpoint:** `GET /users/addresses`

**Mô tả:** Lấy tất cả địa chỉ giao hàng của người dùng đang đăng nhập

**Headers:**
```
Authorization: Bearer <supabase_access_token>
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": 1,
        "full_name": "Nguyễn Văn A",
        "phone": "0912345678",
        "address": "123 Đường ABC",
        "province": "Hồ Chí Minh",
        "province_code": "79",
        "district": "Quận 1",
        "district_code": "760",
        "ward": "Phường Bến Nghé",
        "ward_code": "26734",
        "is_default": true,
        "type": "home"
      },
      {
        "id": 2,
        "full_name": "Nguyễn Văn A",
        "phone": "0912345678",
        "address": "456 Đường XYZ",
        "province": "Hồ Chí Minh",
        "province_code": "79",
        "district": "Quận 3",
        "district_code": "770",
        "ward": "Phường 1",
        "ward_code": "27100",
        "is_default": false,
        "type": "office"
      }
    ]
  }
}
```

---

### 3.2. Thêm địa chỉ mới

**Endpoint:** `POST /users/addresses`

**Mô tả:** Thêm địa chỉ giao hàng mới

**Headers:**
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "Nguyễn Văn A",
  "phone": "0912345678",
  "address": "123 Đường ABC",
  "province": "Hồ Chí Minh",
  "province_code": "79",
  "district": "Quận 1",
  "district_code": "760",
  "ward": "Phường Bến Nghé",
  "ward_code": "26734",
  "is_default": false,
  "type": "home"
}
```

**Các giá trị hợp lệ cho `type`:**
- `home` - Nhà riêng
- `office` - Văn phòng
- `other` - Khác

**Response Success (201):**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "full_name": "Nguyễn Văn A",
    "phone": "0912345678",
    "address": "123 Đường ABC",
    "province": "Hồ Chí Minh",
    "province_code": "79",
    "district": "Quận 1",
    "district_code": "760",
    "ward": "Phường Bến Nghé",
    "ward_code": "26734",
    "is_default": false,
    "type": "home"
  }
}
```

**Response Error (400 - Validation):**
```json
{
  "success": false,
  "message": "Vui lòng nhập đầy đủ thông tin bắt buộc",
  "errors": {
    "full_name": "Họ và tên là bắt buộc",
    "phone": "Số điện thoại không hợp lệ",
    "province": "Vui lòng chọn tỉnh/thành phố"
  }
}
```

---

### 3.3. Cập nhật địa chỉ

**Endpoint:** `PUT /users/addresses/{addressId}`

**Mô tả:** Cập nhật thông tin địa chỉ

**Headers:**
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Mô tả |
|-----------|------|-------|
| addressId | number | ID của địa chỉ cần cập nhật |

**Request Body:** (Giống như thêm mới)
```json
{
  "full_name": "Nguyễn Văn A",
  "phone": "0912345678",
  "address": "789 Đường DEF",
  "province": "Hồ Chí Minh",
  "province_code": "79",
  "district": "Quận 7",
  "district_code": "778",
  "ward": "Phường Tân Phú",
  "ward_code": "27388",
  "is_default": false,
  "type": "home"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Nguyễn Văn A",
    "phone": "0912345678",
    "address": "789 Đường DEF",
    "province": "Hồ Chí Minh",
    "province_code": "79",
    "district": "Quận 7",
    "district_code": "778",
    "ward": "Phường Tân Phú",
    "ward_code": "27388",
    "is_default": false,
    "type": "home"
  }
}
```

---

### 3.4. Xóa địa chỉ

**Endpoint:** `DELETE /users/addresses/{addressId}`

**Mô tả:** Xóa địa chỉ giao hàng

**Headers:**
```
Authorization: Bearer <supabase_access_token>
```

**Path Parameters:**
| Parameter | Type | Mô tả |
|-----------|------|-------|
| addressId | number | ID của địa chỉ cần xóa |

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đã xóa địa chỉ thành công"
}
```

**Response Error (403):**
```json
{
  "success": false,
  "message": "Bạn không có quyền xóa địa chỉ này"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy địa chỉ"
}
```

---

### 3.5. Đặt địa chỉ mặc định

**Endpoint:** `PUT /users/addresses/{addressId}/default`

**Mô tả:** Đặt một địa chỉ làm địa chỉ mặc định. Các địa chỉ khác sẽ tự động bỏ trạng thái mặc định.

**Headers:**
```
Authorization: Bearer <supabase_access_token>
```

**Path Parameters:**
| Parameter | Type | Mô tả |
|-----------|------|-------|
| addressId | number | ID của địa chỉ cần đặt làm mặc định |

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đã đặt làm địa chỉ mặc định"
}
```

---

## 4. TRẠNG THÁI ĐƠN HÀNG (Order Status)

Các trạng thái đơn hàng được sử dụng trong hệ thống:

| Status | Mô tả tiếng Việt | Có thể hủy? |
|--------|------------------|-------------|
| `pending` | Chờ xác nhận | ✅ Có |
| `awaiting_payment` | Chờ thanh toán | ✅ Có |
| `paid` | Đã thanh toán | ✅ Có |
| `processing` | Đang xử lý | ❌ Không |
| `shipping` | Đang giao hàng | ❌ Không |
| `delivered` | Đã giao hàng | ❌ Không |
| `cancelled` | Đã hủy | ❌ Không |
| `refunded` | Đã hoàn tiền | ❌ Không |

---

## 5. XÁC THỰC SUPABASE JWT TOKEN

Backend cần xác thực JWT token từ Supabase để xác định user. Có thể sử dụng Supabase Admin SDK hoặc verify JWT manually.

### Cách lấy thông tin user từ token:

**Option 1: Sử dụng Supabase Admin SDK (Node.js)**
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Verify token và lấy user
const { data: { user }, error } = await supabase.auth.getUser(token);

if (error || !user) {
  // Token không hợp lệ
  return res.status(401).json({ message: 'Unauthorized' });
}

// user.id là Supabase user ID (UUID)
// user.email là email của user
```

**Option 2: Verify JWT manually**
```javascript
const jwt = require('jsonwebtoken');

const token = req.headers.authorization?.replace('Bearer ', '');
const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

// decoded.sub là Supabase user ID (UUID)
// decoded.email là email của user
```

---

## 6. CẤU TRÚC DATABASE ĐỀ XUẤT

### Bảng `user_addresses`
```sql
CREATE TABLE user_addresses (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  province VARCHAR(100) NOT NULL,
  province_code VARCHAR(10) NOT NULL,
  district VARCHAR(100) NOT NULL,
  district_code VARCHAR(10) NOT NULL,
  ward VARCHAR(100),
  ward_code VARCHAR(10),
  is_default BOOLEAN DEFAULT FALSE,
  type VARCHAR(20) DEFAULT 'home' CHECK (type IN ('home', 'office', 'other')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index để query nhanh theo user
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
```

### Cập nhật bảng `orders`
```sql
-- Thêm cột user_id nếu chưa có
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Thêm cột để lưu địa chỉ giao hàng dạng JSON
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Index để query đơn hàng theo user
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

---

## 7. LƯU Ý QUAN TRỌNG

1. **Bảo mật:** Luôn xác thực JWT token trước khi thực hiện bất kỳ thao tác nào
2. **Ownership:** Chỉ cho phép user thao tác với dữ liệu của chính họ
3. **Validation:** Validate tất cả input data từ client
4. **Rate Limiting:** Nên áp dụng rate limiting để tránh abuse
5. **Logging:** Log các thao tác quan trọng để debug và audit

---

## 8. LIÊN HỆ

Nếu có thắc mắc về API, vui lòng liên hệ team Frontend.

**Updated:** 2025-01-xx

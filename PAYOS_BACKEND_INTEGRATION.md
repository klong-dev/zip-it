# PAYOS PAYMENT INTEGRATION - BACKEND DOCUMENTATION

## 📋 Tổng quan

File này mô tả chi tiết cách backend cần implement PayOS payment gateway để xử lý thanh toán cho hệ thống e-commerce.

## 🔐 Thông tin PayOS (CHỈ SỬ DỤNG Ở BACKEND - BẢO MẬT)

**⚠️ QUAN TRỌNG: Các thông tin sau PHẢI được lưu trữ ở backend (environment variables), KHÔNG BAO GIỜ expose ra frontend!**

```env
PAYOS_CLIENT_ID=3349a31d-441a-4b90-a14d-329b0b7e0809
PAYOS_API_KEY=718fe63b-addf-43a7-b75f-7f98aa39791d
PAYOS_CHECKSUM_KEY=c361d06d284bdb844811c2c59c3c0b154e6ef5e56297b7f87fa928f2195f697d
```

## 📚 PayOS Documentation

- Website: https://payos.vn/
- API Documentation: https://payos.vn/docs/api
- SDK: https://github.com/payOSHQ/payos-node-sdk (for Node.js)

## 🔄 Luồng Thanh Toán (Payment Flow)

### 1. Frontend → Backend: Tạo Payment Link

**Frontend gửi request:**

```
POST /api/payment/create
Content-Type: application/json

Body:
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
    }
  ],
  "customerInfo": {
    "name": "Nguyễn Văn A",
    "phone": "0912345678",
    "email": "customer@example.com",
    "province": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "address": "123 Nguyễn Huệ",
    "note": "Giao hàng buổi sáng"
  },
  "totalPrice": 30000,
  "shippingFee": 30000,
  "discount": 0,
  "finalTotal": 60000
}
```

### 2. Backend: Xử lý và Tạo PayOS Payment Link

**Backend cần thực hiện:**

```javascript
// Pseudo code - NestJS example
import PayOS from '@payos/node';

@Post('/api/payment/create')
async createPayment(@Body() orderData) {
  // 1. Validate dữ liệu
  if (!orderData.items || orderData.items.length === 0) {
    throw new BadRequestException('Order must have items');
  }

  // 2. Lưu đơn hàng vào database với status: PENDING_PAYMENT
  const order = await this.orderService.create({
    customerId: orderData.customerInfo,
    items: orderData.items,
    totalAmount: orderData.finalTotal,
    shippingAddress: {
      name: orderData.customerInfo.name,
      phone: orderData.customerInfo.phone,
      address: orderData.customerInfo.address,
      province: orderData.customerInfo.province,
      district: orderData.customerInfo.district,
    },
    note: orderData.customerInfo.note,
    status: 'PENDING_PAYMENT'
  });

  // 3. Tạo PayOS payment link
  const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
  );

  const paymentData = {
    orderCode: order.id, // Mã đơn hàng unique (number)
    amount: orderData.finalTotal, // Số tiền (VND)
    description: `Thanh toan don hang #${order.id}`,
    cancelUrl: `${process.env.FRONTEND_URL}/payment/failed?orderCode=${order.id}`,
    returnUrl: `${process.env.FRONTEND_URL}/payment/success?orderCode=${order.id}`,
    // Webhook URL để PayOS gọi về khi thanh toán thành công
    webhookUrl: `${process.env.BACKEND_URL}/api/payment/webhook`
  };

  try {
    const paymentLink = await payOS.createPaymentLink(paymentData);
    
    // 4. Lưu payment link vào database
    await this.orderService.updatePaymentInfo(order.id, {
      paymentLinkId: paymentLink.id,
      paymentUrl: paymentLink.checkoutUrl
    });

    // 5. Trả về payment URL cho frontend
    return {
      success: true,
      paymentUrl: paymentLink.checkoutUrl,
      orderCode: order.id
    };
  } catch (error) {
    // Xử lý lỗi
    await this.orderService.updateStatus(order.id, 'PAYMENT_FAILED');
    throw new InternalServerErrorException('Cannot create payment link');
  }
}
```

### 3. PayOS Webhook: Xử lý Callback sau thanh toán

**PayOS sẽ gọi webhook khi thanh toán thành công/thất bại:**

```javascript
@Post('/api/payment/webhook')
async handlePaymentWebhook(@Body() webhookData, @Headers() headers) {
  // 1. Verify webhook signature (bảo mật)
  const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
  );

  const isValid = payOS.verifyPaymentWebhookData(webhookData);
  if (!isValid) {
    throw new UnauthorizedException('Invalid webhook signature');
  }

  // 2. Lấy thông tin thanh toán
  const { orderCode, amount, status, transactionId } = webhookData;

  // 3. Cập nhật database
  if (status === 'PAID' || status === 'COMPLETED') {
    await this.orderService.updateStatus(orderCode, 'PAID');
    await this.orderService.updatePaymentInfo(orderCode, {
      transactionId,
      paidAt: new Date(),
      paymentStatus: 'COMPLETED'
    });

    // 4. Gửi email xác nhận cho khách hàng
    const order = await this.orderService.findById(orderCode);
    await this.emailService.sendOrderConfirmation(order);

    // 5. Các xử lý khác: giảm inventory, tạo shipping label, etc.
    await this.inventoryService.decreaseStock(order.items);
    await this.shippingService.createLabel(order);

  } else if (status === 'CANCELLED' || status === 'FAILED') {
    await this.orderService.updateStatus(orderCode, 'PAYMENT_FAILED');
  }

  return { success: true };
}
```

### 4. API Kiểm tra trạng thái thanh toán

**Frontend có thể gọi để kiểm tra status:**

```javascript
@Get('/api/payment/status/:orderCode')
async getPaymentStatus(@Param('orderCode') orderCode: string) {
  const order = await this.orderService.findById(orderCode);
  
  return {
    orderCode: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    amount: order.totalAmount,
    paidAt: order.paidAt
  };
}
```

## 🔧 PayOS SDK Installation

```bash
# Node.js / NestJS
npm install @payos/node

# hoặc
yarn add @payos/node
```

## 📝 Các API Endpoints Cần Tạo

| Method | Endpoint | Mô tả | Request Body | Response |
|--------|----------|-------|--------------|----------|
| POST | `/api/payment/create` | Tạo payment link | Order data | `{ success: true, paymentUrl: string, orderCode: number }` |
| POST | `/api/payment/webhook` | Nhận webhook từ PayOS | Webhook data | `{ success: true }` |
| GET | `/api/payment/status/:orderCode` | Kiểm tra trạng thái | - | Order status |
| POST | `/api/payment/cancel/:orderCode` | Hủy thanh toán | - | `{ success: true }` |

## 🗄️ Database Schema Cần Có

### Orders Table

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  shipping_address TEXT NOT NULL,
  shipping_province VARCHAR(100),
  shipping_district VARCHAR(100),
  note TEXT,
  total_amount INT NOT NULL,
  shipping_fee INT DEFAULT 30000,
  discount INT DEFAULT 0,
  final_amount INT NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING_PAYMENT',
  payment_status VARCHAR(50) DEFAULT 'PENDING',
  payment_link_id VARCHAR(255),
  payment_url TEXT,
  transaction_id VARCHAR(255),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order_Items Table

```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  quantity INT NOT NULL,
  customization_type VARCHAR(50),
  customization_text TEXT,
  customization_price INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Order Status Flow

```
PENDING_PAYMENT (Chờ thanh toán)
    ↓ (User thanh toán thành công)
PAID (Đã thanh toán)
    ↓ (Admin xác nhận)
CONFIRMED (Đã xác nhận)
    ↓ (Chuẩn bị hàng)
PROCESSING (Đang xử lý)
    ↓ (Giao cho shipper)
SHIPPING (Đang giao hàng)
    ↓ (Giao thành công)
DELIVERED (Đã giao hàng)
    ↓ (Khách xác nhận)
COMPLETED (Hoàn thành)

Các status đặc biệt:
- PAYMENT_FAILED (Thanh toán thất bại)
- CANCELLED (Đã hủy)
- REFUNDED (Đã hoàn tiền)
```

## 🔒 Bảo mật (Security)

### 1. Không để lộ thông tin nhạy cảm

```javascript
// ✅ ĐÚNG: Lưu ở backend environment
PAYOS_CLIENT_ID=xxx
PAYOS_API_KEY=xxx
PAYOS_CHECKSUM_KEY=xxx

// ❌ SAI: Không bao giờ làm như này
// const PAYOS_API_KEY = "718fe63b-addf-43a7-b75f-7f98aa39791d"; // trong frontend
```

### 2. Verify webhook signature

```javascript
// Luôn verify mọi webhook từ PayOS
const isValid = payOS.verifyPaymentWebhookData(webhookData);
if (!isValid) {
  throw new UnauthorizedException();
}
```

### 3. Validate số tiền

```javascript
// So sánh số tiền trong webhook với số tiền trong database
const order = await this.orderService.findById(orderCode);
if (webhookData.amount !== order.finalAmount) {
  // Log lại để investigate
  this.logger.error(`Amount mismatch for order ${orderCode}`);
  throw new BadRequestException('Amount mismatch');
}
```

## 📧 Email Templates Cần Có

### 1. Order Confirmation Email (sau khi thanh toán thành công)

```html
Subject: Xác nhận đơn hàng #{{orderCode}}

Kính chào {{customerName}},

Cảm ơn bạn đã đặt hàng tại ZIP!

Mã đơn hàng: #{{orderCode}}
Tổng tiền: {{finalAmount}}đ
Trạng thái: Đã thanh toán

Chi tiết đơn hàng:
{{#each items}}
- {{name}} x{{quantity}}: {{price}}đ
{{/each}}

Địa chỉ giao hàng:
{{shippingAddress}}

Đơn hàng sẽ được giao trong 3-5 ngày làm việc.

Trân trọng,
ZIP Team
```

## 🧪 Testing

### Test Cases Cần Kiểm Tra

1. ✅ Tạo payment link thành công
2. ✅ Tạo payment link thất bại (thiếu thông tin)
3. ✅ Webhook callback khi thanh toán thành công
4. ✅ Webhook callback khi thanh toán thất bại
5. ✅ Webhook signature không hợp lệ
6. ✅ Số tiền không khớp
7. ✅ Order code không tồn tại
8. ✅ Email confirmation được gửi
9. ✅ Inventory được cập nhật sau thanh toán

## 📊 Monitoring & Logging

### Cần log những gì:

```javascript
// 1. Khi tạo payment link
logger.info('Payment link created', {
  orderCode,
  amount,
  customerId,
  timestamp: new Date()
});

// 2. Khi nhận webhook
logger.info('Payment webhook received', {
  orderCode,
  status,
  transactionId,
  timestamp: new Date()
});

// 3. Khi có lỗi
logger.error('Payment failed', {
  orderCode,
  error: error.message,
  stack: error.stack
});
```

## 🚀 Deployment Checklist

- [ ] Environment variables được set đúng
- [ ] Webhook URL accessible từ internet (PayOS cần gọi được)
- [ ] Database schema đã được tạo
- [ ] Email service đã được cấu hình
- [ ] SSL certificate đã được cài đặt (HTTPS required)
- [ ] Rate limiting đã được setup
- [ ] Monitoring/logging đã được enable
- [ ] Backup database strategy đã có

## 📞 Support

- PayOS Support: support@payos.vn
- PayOS Hotline: (số hotline của PayOS)
- Documentation: https://payos.vn/docs

---

**Lưu ý cuối cùng:** File này là hướng dẫn cho backend developer. Frontend chỉ cần call API `/api/payment/create` và nhận `paymentUrl` để redirect user. Tất cả logic xử lý thanh toán, bảo mật, và database updates đều được thực hiện ở backend.

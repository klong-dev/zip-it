# API INTEGRATION GUIDE - ZIP E-COMMERCE BACKEND

**Base URL**: `http://localhost:3011/api`  
**Swagger Documentation**: `http://localhost:3011/api/docs`  
**Last Updated**: November 12, 2025

---

## 📋 Table of Contents

1. [Authentication](#1-authentication)
2. [Products](#2-products)
3. [Cart](#3-cart)
4. [Payment & Orders](#4-payment--orders)
5. [Users](#5-users)
6. [Error Handling](#6-error-handling)
7. [Testing Examples](#7-testing-examples)

---

## 1. Authentication

### 1.1. Register User

**Endpoint**: `POST /api/auth/register`  
**Authentication**: Not required

**Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "SecurePass123!",
  "name": "Nguyễn Văn A",
  "phone": "0912345678"
}
```

**Success Response** (201 Created):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "customer@example.com",
    "name": "Nguyễn Văn A"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3011/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "0912345678"
  }'
```

**Frontend (Axios) Example**:
```javascript
const response = await axios.post('http://localhost:3011/api/auth/register', {
  email: 'customer@example.com',
  password: 'SecurePass123!',
  name: 'Nguyễn Văn A',
  phone: '0912345678'
});

// Store token
localStorage.setItem('token', response.data.access_token);
```

---

### 1.2. Login User

**Endpoint**: `POST /api/auth/login`  
**Authentication**: Not required

**Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "SecurePass123!"
}
```

**Success Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "customer@example.com",
    "name": "Nguyễn Văn A"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3011/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Frontend (Axios) Example**:
```javascript
const response = await axios.post('http://localhost:3011/api/auth/login', {
  email: 'customer@example.com',
  password: 'SecurePass123!'
});

// Store token
localStorage.setItem('token', response.data.access_token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

---

## 2. Products

### 2.1. Get All Products (with Filters & Pagination)

**Endpoint**: `GET /api/products`  
**Authentication**: Not required

**Query Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `page` | number | No | Page number (default: 1) | `1` |
| `limit` | number | No | Items per page (default: 12) | `12` |
| `category` | string | No | Filter by category | `Túi Tote` |
| `minPrice` | number | No | Minimum price in VND | `100000` |
| `maxPrice` | number | No | Maximum price in VND | `500000` |
| `search` | string | No | Search in name, description, tags | `canvas` |
| `sort` | string | No | Sort method | `price_asc`, `price_desc`, `name_asc`, `name_desc`, `newest` |

**Success Response** (200 OK):
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
        "priceRange": "150.000đ - 200.000đ",
        "image": "/products/tote-canvas.jpg",
        "images": [
          "/products/tote-1.jpg",
          "/products/tote-2.jpg",
          "/products/tote-3.jpg"
        ],
        "category": "Túi Tote",
        "description": "Túi tote canvas thân thiện với môi trường",
        "detailedDescription": "Được chế tác từ vật liệu canvas cao cấp...",
        "rating": 4.8,
        "reviews": 128,
        "inStock": true,
        "stock": 50,
        "sku": "TOT-001",
        "tags": ["Eco-Friendly", "Canvas", "Handmade"],
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
            "price": 50000,
            "description": "Thêu tên hoặc chữ cái lên sản phẩm"
          },
          {
            "id": 2,
            "type": "print",
            "name": "In hình",
            "price": 30000,
            "description": "In hình ảnh hoặc logo"
          }
        ],
        "relatedProducts": [2, 3, 4],
        "createdAt": "2025-11-12T10:00:00.000Z",
        "updatedAt": "2025-11-12T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 30,
      "itemsPerPage": 12,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**cURL Examples**:

```bash
# Get all products (default pagination)
curl http://localhost:3011/api/products

# Get products with filters
curl "http://localhost:3011/api/products?category=Túi%20Tote&sort=price_asc&page=1&limit=12"

# Search products
curl "http://localhost:3011/api/products?search=canvas"

# Price range filter
curl "http://localhost:3011/api/products?minPrice=100000&maxPrice=300000"
```

**Frontend (Axios) Examples**:

```javascript
// Basic usage
const response = await axios.get('http://localhost:3011/api/products');
const products = response.data.data.products;

// With filters
const response = await axios.get('http://localhost:3011/api/products', {
  params: {
    category: 'Túi Tote',
    sort: 'price_asc',
    page: 1,
    limit: 12,
    minPrice: 100000,
    maxPrice: 500000
  }
});

// Search
const response = await axios.get('http://localhost:3011/api/products', {
  params: {
    search: 'canvas',
    page: 1
  }
});
```

**React Hook Example**:
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3011/api/products', {
          params: filters
        });
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, pagination, loading, error };
}

// Usage in component
function ProductList() {
  const { products, pagination, loading } = useProducts({
    category: 'Túi Tote',
    sort: 'price_asc',
    page: 1,
    limit: 12
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      <Pagination {...pagination} />
    </div>
  );
}
```

---

### 2.2. Get Product by ID

**Endpoint**: `GET /api/products/:id`  
**Authentication**: Not required

**URL Parameters**:
- `id` (number, required): Product ID

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Túi Tote Canvas",
    "slug": "tui-tote-canvas",
    "price": 150000,
    "priceFormatted": "150.000đ",
    "priceRange": "150.000đ - 200.000đ",
    "image": "/products/tote-canvas.jpg",
    "images": [
      "/products/tote-1.jpg",
      "/products/tote-2.jpg",
      "/products/tote-3.jpg"
    ],
    "category": "Túi Tote",
    "description": "Túi tote canvas thân thiện với môi trường",
    "detailedDescription": "Được chế tác từ vật liệu canvas cao cấp, thân thiện với môi trường. Thiết kế rộng rãi, phù hợp cho nhiều mục đích sử dụng.",
    "rating": 4.8,
    "reviews": 128,
    "inStock": true,
    "stock": 50,
    "sku": "TOT-001",
    "tags": ["Eco-Friendly", "Canvas", "Handmade"],
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
        "price": 50000,
        "description": "Thêu tên hoặc chữ cái lên sản phẩm"
      },
      {
        "id": 2,
        "type": "print",
        "name": "In hình",
        "price": 30000,
        "description": "In hình ảnh hoặc logo"
      }
    ],
    "relatedProducts": [2, 3, 4],
    "createdAt": "2025-11-12T10:00:00.000Z",
    "updatedAt": "2025-11-12T10:00:00.000Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "statusCode": 404,
  "message": "Không tìm thấy sản phẩm"
}
```

**cURL Example**:
```bash
curl http://localhost:3011/api/products/1
```

**Frontend (Axios) Example**:
```javascript
const response = await axios.get(`http://localhost:3011/api/products/${productId}`);
const product = response.data.data;

console.log(product.name); // "Túi Tote Canvas"
console.log(product.priceFormatted); // "150.000đ"
console.log(product.inStock); // true
```

**React Component Example**:
```javascript
function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3011/api/products/${productId}`)
      .then(res => {
        setProduct(res.data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p className="price">{product.priceFormatted}</p>
      <p className="stock">{product.inStock ? 'Còn hàng' : 'Hết hàng'}</p>
      <div className="description">{product.detailedDescription}</div>
      
      {/* Customization Options */}
      {product.customizationOptions?.map(option => (
        <div key={option.id}>
          <h3>{option.name}</h3>
          <p>{option.description}</p>
          <p>+{option.price.toLocaleString('vi-VN')}đ</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 2.3. Get Product Categories

**Endpoint**: `GET /api/products/categories`  
**Authentication**: Not required

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Túi Tote",
      "slug": "tui-tote",
      "productCount": 2,
      "image": "/products/tote-canvas.jpg"
    },
    {
      "id": 2,
      "name": "Túi Đeo Chéo",
      "slug": "tui-deo-cheo",
      "productCount": 1,
      "image": "/products/crossbody-leather.jpg"
    }
  ]
}
```

**cURL Example**:
```bash
curl http://localhost:3011/api/products/categories
```

**Frontend (Axios) Example**:
```javascript
const response = await axios.get('http://localhost:3011/api/products/categories');
const categories = response.data.data;

// Use in category filter
categories.forEach(cat => {
  console.log(`${cat.name} (${cat.productCount} sản phẩm)`);
});
```

---

## 3. Cart

### 3.1. Get Cart

**Endpoint**: `GET /api/cart`  
**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {access_token}
```

**Success Response** (200 OK):
```json
{
  "items": [
    {
      "id": 1,
      "productId": 1,
      "name": "Túi Tote Canvas",
      "price": 150000,
      "quantity": 2,
      "image": "/products/tote-canvas.jpg"
    }
  ],
  "totalItems": 2,
  "totalPrice": 300000
}
```

**Error Response** (401 Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**cURL Example**:
```bash
curl http://localhost:3011/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Frontend (Axios) Example**:
```javascript
const token = localStorage.getItem('token');

const response = await axios.get('http://localhost:3011/api/cart', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const cart = response.data;
console.log(`Total items: ${cart.totalItems}`);
console.log(`Total price: ${cart.totalPrice.toLocaleString('vi-VN')}đ`);
```

---

### 3.2. Add Item to Cart

**Endpoint**: `POST /api/cart/items`  
**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "productId": 1,
  "quantity": 2,
  "customization": {
    "type": "embroidery",
    "text": "My Name",
    "price": 50000
  }
}
```

**Success Response** (201 Created):
```json
{
  "message": "Added to cart",
  "item": {
    "id": 1,
    "productId": 1,
    "name": "Túi Tote Canvas",
    "price": 150000,
    "quantity": 2,
    "customization": {
      "type": "embroidery",
      "text": "My Name",
      "price": 50000
    }
  }
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3011/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

**Frontend (Axios) Example**:
```javascript
const token = localStorage.getItem('token');

const response = await axios.post('http://localhost:3011/api/cart/items', {
  productId: 1,
  quantity: 2,
  customization: {
    type: 'embroidery',
    text: 'My Name',
    price: 50000
  }
}, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Show success message
alert('Đã thêm vào giỏ hàng!');
```

---

### 3.3. Update Cart Item

**Endpoint**: `PATCH /api/cart/items/:id`  
**Authentication**: Required (Bearer Token)

**URL Parameters**:
- `id` (number, required): Cart item ID

**Request Body**:
```json
{
  "quantity": 5
}
```

**Success Response** (200 OK):
```json
{
  "message": "Cart item updated"
}
```

**cURL Example**:
```bash
curl -X PATCH http://localhost:3011/api/cart/items/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

---

### 3.4. Delete Cart Item

**Endpoint**: `DELETE /api/cart/items/:id`  
**Authentication**: Required (Bearer Token)

**URL Parameters**:
- `id` (number, required): Cart item ID

**Success Response** (200 OK):
```json
{
  "message": "Item removed from cart"
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost:3011/api/cart/items/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3.5. Clear Cart

**Endpoint**: `DELETE /api/cart`  
**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "message": "Cart cleared"
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost:3011/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 4. Payment & Orders

### 4.1. Create Payment Link ⭐ **MOST IMPORTANT**

**Endpoint**: `POST /api/payment/create`  
**Authentication**: Optional (works for both guest & logged-in users)

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {access_token}  // Optional
```

**Request Body**:
```json
{
  "items": [
    {
      "productId": 1,
      "name": "Túi Tote Canvas",
      "price": 150000,
      "quantity": 2,
      "customization": {
        "size": "L",
        "color": "Red"
      }
    },
    {
      "productId": 2,
      "name": "Túi Đeo Chéo Da",
      "price": 350000,
      "quantity": 1,
      "customization": null
    }
  ],
  "customerInfo": {
    "name": "Nguyễn Văn A",
    "email": "customer@example.com",
    "phoneNumber": "0912345678",
    "province": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "address": "123 Nguyễn Huệ, Phường Bến Nghé"
  },
  "note": "Giao hàng buổi sáng",
  "voucherCode": "SAVE10",
  "totalPrice": 650000,
  "shippingFee": 30000,
  "discount": 0,
  "finalTotal": 680000
}
```

**Validation Rules**:
- ✅ `items`: Array, required, min 1 item
- ✅ `items[].productId`: Number, required
- ✅ `items[].name`: String, required
- ✅ `items[].price`: Number, required, min 0
- ✅ `items[].quantity`: Number, required, min 1
- ✅ `customerInfo.name`: String, required
- ✅ `customerInfo.email`: Email format, required
- ✅ `customerInfo.phoneNumber`: String, required
- ✅ `customerInfo.province`: String, required
- ✅ `customerInfo.district`: String, required
- ✅ `customerInfo.address`: String, required

**Success Response** (201 Created):
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

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Không thể tạo thanh toán",
  "errors": [
    "Sản phẩm ID 1 không khả dụng hoặc giá không khớp",
    "Sản phẩm ID 3 đã hết hàng"
  ]
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3011/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": 1,
        "name": "Túi Tote Canvas",
        "price": 150000,
        "quantity": 2
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
  }'
```

**Frontend (Axios) Example**:
```javascript
// Prepare order data from cart
const orderData = {
  items: cart.items.map(item => ({
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    customization: item.customization || null
  })),
  customerInfo: {
    name: form.name,
    email: form.email,
    phoneNumber: form.phone,
    province: form.province,
    district: form.district,
    address: form.address
  },
  note: form.note || '',
  voucherCode: voucher?.code || '',
  totalPrice: cart.totalPrice,
  shippingFee: 30000,
  discount: voucher?.discount || 0,
  finalTotal: cart.totalPrice + 30000 - (voucher?.discount || 0)
};

try {
  const response = await axios.post(
    'http://localhost:3011/api/payment/create',
    orderData
  );

  const { checkoutUrl, orderCode } = response.data.data;

  // Redirect to PayOS payment page
  window.location.href = checkoutUrl;

  // Or open in new tab
  // window.open(checkoutUrl, '_blank');

  // Store order code for tracking
  localStorage.setItem('pendingOrderCode', orderCode);

} catch (error) {
  if (error.response?.data?.errors) {
    // Show validation errors
    error.response.data.errors.forEach(err => {
      alert(err);
    });
  } else {
    alert('Có lỗi xảy ra khi tạo thanh toán');
  }
}
```

**React Component Example**:
```javascript
function CheckoutForm() {
  const [cart] = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    province: '',
    district: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3011/api/payment/create', {
        items: cart.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          customization: item.customization
        })),
        customerInfo,
        totalPrice: cart.totalPrice,
        shippingFee: 30000,
        discount: 0,
        finalTotal: cart.totalPrice + 30000
      });

      // Redirect to PayOS
      window.location.href = response.data.data.checkoutUrl;

    } catch (error) {
      console.error('Payment creation failed:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheckout}>
      <input
        type="text"
        placeholder="Họ và tên"
        value={customerInfo.name}
        onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={customerInfo.email}
        onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
        required
      />
      {/* More fields... */}
      <button type="submit" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Thanh toán'}
      </button>
    </form>
  );
}
```

**Payment Flow**:
1. User fills checkout form
2. Frontend sends POST to `/api/payment/create`
3. Backend validates products, prices, stock
4. Backend creates order in database (status: PENDING_PAYMENT)
5. Backend calls PayOS API to create payment link
6. Backend returns `checkoutUrl` to frontend
7. Frontend redirects user to PayOS payment page
8. User completes payment on PayOS
9. PayOS sends webhook to backend
10. Backend updates order status, decreases stock, sends email
11. PayOS redirects user back to frontend (success/cancel URL)

---

### 4.2. Payment Webhook (Internal - Called by PayOS)

**Endpoint**: `POST /api/payment/webhook`  
**Authentication**: Not required (public endpoint for PayOS)

⚠️ **Note**: This endpoint is called by PayOS servers, not by your frontend.

**Request Body** (from PayOS):
```json
{
  "orderCode": "1234567890",
  "amount": 680000,
  "description": "Thanh toan don hang #1",
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

**Payment Status Codes**:
- `"00"` - Thành công (Payment successful)
- `"01"` - Thất bại (Payment failed)
- `"02"` - Đang xử lý (Processing)
- `"03"` - Đã hủy (Cancelled)

**What Backend Does**:
1. ✅ Verify webhook signature
2. ✅ Check order exists
3. ✅ Verify amount matches
4. ✅ If code === "00" (success):
   - Update order status: PENDING_PAYMENT → PAID
   - Decrease product stock
   - Send confirmation email to customer
5. ✅ If code !== "00" (failed):
   - Update order status: PAYMENT_FAILED
   - Do NOT decrease stock

**Success Response** (200 OK):
```json
{
  "success": true
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Invalid webhook signature"
}
```

---

### 4.3. Get Payment Status

**Endpoint**: `GET /api/payment/status/:orderCode`  
**Authentication**: Not required

**URL Parameters**:
- `orderCode` (string, required): Order code from PayOS

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "orderCode": 1,
    "orderNumber": "ORD-1-1731427200000",
    "status": "PAID",
    "paymentStatus": "COMPLETED",
    "amount": 680000,
    "paidAt": "2025-11-12T10:30:00.000Z",
    "transactionId": "FT12345678"
  }
}
```

**Order Status Values**:
- `PENDING_PAYMENT` - Chờ thanh toán
- `PAID` - Đã thanh toán
- `CONFIRMED` - Đã xác nhận
- `PROCESSING` - Đang xử lý
- `SHIPPING` - Đang giao hàng
- `DELIVERED` - Đã giao hàng
- `COMPLETED` - Hoàn thành
- `CANCELLED` - Đã hủy
- `PAYMENT_FAILED` - Thanh toán thất bại

**Payment Status Values**:
- `PENDING` - Đang chờ
- `COMPLETED` - Hoàn thành
- `FAILED` - Thất bại

**Error Response** (400 Bad Request):
```json
{
  "statusCode": 400,
  "message": "Order not found"
}
```

**cURL Example**:
```bash
curl http://localhost:3011/api/payment/status/1234567890
```

**Frontend (Axios) Example**:
```javascript
// Check payment status after redirect from PayOS
const urlParams = new URLSearchParams(window.location.search);
const orderCode = urlParams.get('orderCode');

if (orderCode) {
  const response = await axios.get(
    `http://localhost:3011/api/payment/status/${orderCode}`
  );

  const paymentInfo = response.data.data;

  if (paymentInfo.status === 'PAID') {
    // Show success page
    console.log('Thanh toán thành công!');
    console.log(`Order: ${paymentInfo.orderNumber}`);
    console.log(`Amount: ${paymentInfo.amount.toLocaleString('vi-VN')}đ`);
  } else {
    // Show failed page
    console.log('Thanh toán thất bại!');
  }
}
```

**React Payment Success Page Example**:
```javascript
function PaymentSuccessPage() {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderCode = new URLSearchParams(window.location.search).get('orderCode');

  useEffect(() => {
    if (!orderCode) {
      window.location.href = '/';
      return;
    }

    // Poll payment status
    const checkStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3011/api/payment/status/${orderCode}`
        );
        
        const data = response.data.data;
        setPaymentInfo(data);

        if (data.status === 'PAID') {
          setLoading(false);
          // Clear cart
          localStorage.removeItem('cart');
        } else if (data.status === 'PENDING_PAYMENT') {
          // Still processing, check again after 2 seconds
          setTimeout(checkStatus, 2000);
        } else {
          // Failed
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    checkStatus();
  }, [orderCode]);

  if (loading) {
    return <div>Đang xử lý thanh toán...</div>;
  }

  if (paymentInfo?.status === 'PAID') {
    return (
      <div className="success-page">
        <h1>✅ Thanh toán thành công!</h1>
        <p>Mã đơn hàng: {paymentInfo.orderNumber}</p>
        <p>Số tiền: {paymentInfo.amount.toLocaleString('vi-VN')}đ</p>
        <p>Email xác nhận đã được gửi đến hộp thư của bạn.</p>
        <button onClick={() => window.location.href = '/'}>
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="failed-page">
      <h1>❌ Thanh toán thất bại</h1>
      <p>Vui lòng thử lại sau.</p>
    </div>
  );
}
```

---

### 4.4. Get All Orders

**Endpoint**: `GET /api/orders`  
**Authentication**: Required (Bearer Token)

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10) |

**Success Response** (200 OK):
```json
{
  "orders": [
    {
      "id": 1,
      "orderNumber": "ORD-1-1731427200000",
      "status": "PAID",
      "totalPayment": 680000,
      "items": [
        {
          "productId": 1,
          "name": "Túi Tote Canvas",
          "quantity": 2
        }
      ],
      "createdAt": "2025-11-12T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

**cURL Example**:
```bash
curl http://localhost:3011/api/orders?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Frontend (Axios) Example**:
```javascript
const token = localStorage.getItem('token');

const response = await axios.get('http://localhost:3011/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  params: {
    page: 1,
    limit: 10
  }
});

const orders = response.data.orders;
```

---

### 4.5. Get Order by ID

**Endpoint**: `GET /api/orders/:id`  
**Authentication**: Required (Bearer Token)

**URL Parameters**:
- `id` (number, required): Order ID

**Success Response** (200 OK):
```json
{
  "id": 1,
  "orderNumber": "ORD-1-1731427200000",
  "status": "PAID",
  "paymentStatus": "COMPLETED",
  "items": [
    {
      "productId": 1,
      "name": "Túi Tote Canvas",
      "price": 150000,
      "quantity": 2,
      "subtotal": 300000,
      "customization": {
        "type": "embroidery",
        "text": "My Name"
      }
    }
  ],
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0912345678",
  "customerEmail": "customer@example.com",
  "shippingAddress": {
    "address": "123 Nguyễn Huệ",
    "district": "Quận 1",
    "province": "TP. Hồ Chí Minh"
  },
  "note": "Giao hàng buổi sáng",
  "subtotal": 300000,
  "shippingFee": 30000,
  "discount": 0,
  "totalPayment": 330000,
  "transactionId": "FT12345678",
  "paidAt": "2025-11-12T10:30:00.000Z",
  "createdAt": "2025-11-12T10:00:00.000Z"
}
```

**cURL Example**:
```bash
curl http://localhost:3011/api/orders/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 5. Users

### 5.1. Get User Profile

**Endpoint**: `GET /api/users/profile`  
**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "email": "customer@example.com",
  "name": "Nguyễn Văn A"
}
```

**cURL Example**:
```bash
curl http://localhost:3011/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Frontend (Axios) Example**:
```javascript
const token = localStorage.getItem('token');

const response = await axios.get('http://localhost:3011/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const user = response.data;
console.log(`Welcome, ${user.name}!`);
```

---

## 6. Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password is required"],
  "error": "Bad Request"
}
```

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Không tìm thấy sản phẩm"
}
```

#### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

### Frontend Error Handling Pattern

```javascript
import axios from 'axios';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: 'http://localhost:3011/api'
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;

        case 400:
          // Bad request - show validation errors
          if (Array.isArray(data.message)) {
            alert(data.message.join('\n'));
          } else {
            alert(data.message);
          }
          break;

        case 404:
          // Not found
          alert(data.message || 'Không tìm thấy dữ liệu');
          break;

        case 500:
          // Server error
          alert('Lỗi server, vui lòng thử lại sau');
          break;

        default:
          alert('Có lỗi xảy ra');
      }
    } else if (error.request) {
      // No response from server
      alert('Không thể kết nối đến server');
    }

    return Promise.reject(error);
  }
);

export default api;
```

**Usage**:
```javascript
import api from './api';

// No need to manually add token or handle errors
const products = await api.get('/products');
const order = await api.post('/payment/create', orderData);
```

---

## 7. Testing Examples

### Postman Collection

Create a new collection with these requests:

**1. Register User**
```
POST http://localhost:3011/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "phone": "0912345678"
}
```

**2. Login**
```
POST http://localhost:3011/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

// Save token from response
```

**3. Get Products**
```
GET http://localhost:3011/api/products?category=Túi Tote&sort=price_asc
```

**4. Get Product Detail**
```
GET http://localhost:3011/api/products/1
```

**5. Create Payment**
```
POST http://localhost:3011/api/payment/create
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "name": "Túi Tote Canvas",
      "price": 150000,
      "quantity": 2
    }
  ],
  "customerInfo": {
    "name": "Test User",
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

**6. Check Payment Status**
```
GET http://localhost:3011/api/payment/status/1
```

**7. Get Orders**
```
GET http://localhost:3011/api/orders
Authorization: Bearer {token}
```

### Complete React Shopping Flow Example

```javascript
import { useState, useEffect } from 'react';
import api from './api'; // Axios instance from section 6

function ShoppingFlow() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // 1. Load products
  useEffect(() => {
    api.get('/products', {
      params: {
        category: 'Túi Tote',
        sort: 'price_asc',
        page: 1,
        limit: 12
      }
    }).then(res => {
      setProducts(res.data.data.products);
    });
  }, []);

  // 2. Add to cart
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        customization: null
      }]);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  // 3. Checkout with PayOS
  const checkout = async (customerInfo) => {
    setIsCheckingOut(true);

    try {
      const totalPrice = cart.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      const response = await api.post('/payment/create', {
        items: cart,
        customerInfo,
        totalPrice,
        shippingFee: 30000,
        discount: 0,
        finalTotal: totalPrice + 30000
      });

      // Redirect to PayOS
      window.location.href = response.data.data.checkoutUrl;

    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Không thể tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div>
      {/* Product List */}
      <div className="products">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">{product.priceFormatted}</p>
            <button onClick={() => addToCart(product)}>
              Thêm vào giỏ
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="cart">
        <h2>Giỏ hàng ({cart.length})</h2>
        {cart.map(item => (
          <div key={item.productId}>
            {item.name} x{item.quantity} = {(item.price * item.quantity).toLocaleString('vi-VN')}đ
          </div>
        ))}
        <button 
          onClick={() => {
            const customerInfo = {
              name: 'Test User',
              email: 'test@example.com',
              phoneNumber: '0912345678',
              province: 'TP. Hồ Chí Minh',
              district: 'Quận 1',
              address: '123 Nguyễn Huệ'
            };
            checkout(customerInfo);
          }}
          disabled={isCheckingOut || cart.length === 0}
        >
          {isCheckingOut ? 'Đang xử lý...' : 'Thanh toán'}
        </button>
      </div>
    </div>
  );
}
```

---

## 📝 Additional Notes

### CORS Configuration
If you're running frontend on a different port (e.g., React on port 3000), backend already has CORS enabled for `http://localhost:3000`.

### Environment Variables
Make sure to update `.env` file:
```env
PORT=3011
PAYOS_CLIENT_ID=3349a31d-8110-4ea4-a227-f6c497b4ad81
PAYOS_API_KEY=718fe63b-f8fb-4685-80a9-7bb21c850c9c
PAYOS_CHECKSUM_KEY=c361d06de5d30ba08a7ebee9b6e9bdeb4ea7fdcc5b4c5e0164df93edee831ce4
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Payment Return URLs
Configure in your PayOS dashboard:
- Success URL: `http://localhost:3000/payment/success?orderCode={orderCode}`
- Cancel URL: `http://localhost:3000/payment/failed?orderCode={orderCode}`

### Stock Management
- ✅ Products are validated before payment creation
- ✅ Stock is automatically decreased after successful payment (via webhook)
- ✅ Stock is NOT decreased if payment fails
- ✅ Real-time stock status in product response (`inStock`, `stock`)

### Email Notifications
Customers receive order confirmation email automatically after successful payment containing:
- Order details with item list
- Shipping address
- Total amount
- Order number for tracking

---

## 🚀 Quick Start Guide

### 1. Start Backend Server
```bash
cd zip
npm install
npm run start:dev
```

Server runs on: http://localhost:3011

### 2. Test API with Swagger
Open: http://localhost:3011/api/docs

### 3. Test Payment Flow
```javascript
// 1. Get products
const products = await fetch('http://localhost:3011/api/products').then(r => r.json());

// 2. Create payment
const payment = await fetch('http://localhost:3011/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [{
      productId: 1,
      name: 'Túi Tote Canvas',
      price: 150000,
      quantity: 1
    }],
    customerInfo: {
      name: 'Test',
      email: 'test@test.com',
      phoneNumber: '0912345678',
      province: 'HCM',
      district: 'Q1',
      address: '123 ABC'
    },
    totalPrice: 150000,
    shippingFee: 30000,
    discount: 0,
    finalTotal: 180000
  })
}).then(r => r.json());

// 3. Redirect to payment
window.location.href = payment.data.checkoutUrl;
```

---

## 📞 Support

**Backend Developer**: Available for API questions  
**Swagger Docs**: http://localhost:3011/api/docs  
**PayOS Documentation**: https://payos.vn/docs

---

**Version**: 1.0.0  
**Last Updated**: November 12, 2025  
**Status**: ✅ All Phase 1 Critical APIs Implemented

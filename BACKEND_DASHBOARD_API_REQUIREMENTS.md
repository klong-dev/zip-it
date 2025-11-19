# 🚨 Backend Dashboard API - Data Missing Requirements

## Vấn đề hiện tại

Dashboard frontend KHÔNG nhận được đủ dữ liệu từ backend. Cụ thể:

1. ❌ **Tổng doanh thu** (totalRevenue) không hiển thị
2. ❌ **Phân loại sản phẩm** (categories) không hiển thị trong PieChart

---

## API Endpoint cần fix

### `GET /api/admin/statistics/dashboard`

**Headers:**
```http
Authorization: Bearer <admin_token>
```

---

## ✅ Cấu trúc Response PHẢI TRẢ VỀ

```json
{
  "orders": {
    "totalOrders": 150,
    "paidOrders": 120,
    "totalRevenue": 45000000,  // ⚠️ QUAN TRỌNG: Phải có field này!
    "statusCounts": [
      { "status": "PENDING_PAYMENT", "count": 10 },
      { "status": "COMPLETED", "count": 30 },
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
    "categories": [  // ⚠️ QUAN TRỌNG: Phải có array này với đầy đủ 3 fields!
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

---

## 🔍 Chi tiết từng field bị thiếu

### 1. `orders.totalRevenue` (Number)

**Mô tả:** Tổng doanh thu từ TẤT CẢ đơn hàng đã hoàn thành (`status = 'COMPLETED'`)

**Cách tính:**
```typescript
// Pseudo code
const completedOrders = orders.filter(order => order.status === 'COMPLETED');
const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPayment, 0);
```

**Ví dụ:**
- Đơn hàng #1: COMPLETED, totalPayment = 200,000đ
- Đơn hàng #2: COMPLETED, totalPayment = 350,000đ
- Đơn hàng #3: PENDING_PAYMENT, totalPayment = 150,000đ
- **→ totalRevenue = 550,000đ** (chỉ tính 2 đơn COMPLETED)

**Frontend sử dụng tại:**
- `src/app/admin/dashboard/page.tsx` - Line 165
- Card "Tổng doanh thu" (màu đỏ với icon DollarSign)
- Hiển thị: `formatCurrency(stats?.orders.totalRevenue || 0)`

---

### 2. `products.categories` (Array)

**Mô tả:** Danh sách tất cả categories của sản phẩm với số lượng và phần trăm

**Cấu trúc mỗi item:**
```typescript
{
  category: string,     // Tên category (ví dụ: "Túi Tote", "Balo", "Túi Xách")
  count: number,        // Số lượng sản phẩm trong category này
  percentage: number    // Phần trăm so với tổng (ví dụ: 40 = 40%)
}
```

**Cách tính:**
```typescript
// Pseudo code
const categories = {};
products.forEach(product => {
  if (!categories[product.category]) {
    categories[product.category] = 0;
  }
  categories[product.category]++;
});

const totalProducts = products.length;
const result = Object.keys(categories).map(category => ({
  category: category,
  count: categories[category],
  percentage: Math.round((categories[category] / totalProducts) * 100)
}));
```

**Ví dụ:**
- Tổng 50 sản phẩm:
  - 20 sản phẩm "Túi Tote" → count: 20, percentage: 40
  - 15 sản phẩm "Balo" → count: 15, percentage: 30
  - 15 sản phẩm "Túi Xách" → count: 15, percentage: 30

**Frontend sử dụng tại:**
- `src/app/admin/dashboard/page.tsx` - Line 199-207
- PieChart "Phân loại sản phẩm"
- Hiển thị: `<Pie data={stats?.products.categories} dataKey="count" nameKey="category" .../>`
- Label: `{entry.category}: {entry.percentage}%`

**⚠️ LƯU Ý:** PieChart cần cả 3 fields:
- `category` → để hiển thị tên
- `count` → để vẽ size của pie slice
- `percentage` → để hiển thị % trong label

---

## 📊 Database Queries (Gợi ý)

### Query 1: Tính totalRevenue

```sql
-- SQL example (NestJS TypeORM)
SELECT SUM(total_payment) as totalRevenue
FROM orders
WHERE status = 'COMPLETED';
```

```typescript
// NestJS TypeORM example
const totalRevenue = await this.orderRepository
  .createQueryBuilder('order')
  .select('SUM(order.totalPayment)', 'totalRevenue')
  .where('order.status = :status', { status: 'COMPLETED' })
  .getRawOne();

return totalRevenue?.totalRevenue || 0;
```

---

### Query 2: Tính categories statistics

```sql
-- SQL example
SELECT 
  category,
  COUNT(*) as count,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM products)), 2) as percentage
FROM products
GROUP BY category
ORDER BY count DESC;
```

```typescript
// NestJS TypeORM example
const totalProducts = await this.productRepository.count();

const categories = await this.productRepository
  .createQueryBuilder('product')
  .select('product.category', 'category')
  .addSelect('COUNT(product.id)', 'count')
  .groupBy('product.category')
  .orderBy('count', 'DESC')
  .getRawMany();

return categories.map(cat => ({
  category: cat.category,
  count: parseInt(cat.count),
  percentage: Math.round((parseInt(cat.count) / totalProducts) * 100)
}));
```

---

## 🧪 Testing

### Cách test API sau khi fix:

```bash
# 1. Login admin để lấy token
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@zipit.com",
    "password": "admin123456"
  }'

# Response sẽ có accessToken
# Copy token đó

# 2. Test dashboard API
curl -X GET http://localhost:3000/api/admin/statistics/dashboard \
  -H "Authorization: Bearer <your_token_here>"

# 3. Kiểm tra response PHẢI có:
# ✅ orders.totalRevenue (là số, không phải null/undefined)
# ✅ products.categories (là array, không rỗng)
# ✅ Mỗi category item có đủ: category, count, percentage
```

---

## ✅ Checklist cho Backend Developer

- [ ] `GET /api/admin/statistics/dashboard` trả về field `orders.totalRevenue` (kiểu Number)
- [ ] `totalRevenue` được tính bằng SUM của `totalPayment` từ orders có `status = 'COMPLETED'`
- [ ] `GET /api/admin/statistics/dashboard` trả về field `products.categories` (kiểu Array)
- [ ] Mỗi item trong `categories` có đủ 3 fields: `category`, `count`, `percentage`
- [ ] `count` là số lượng sản phẩm trong category đó
- [ ] `percentage` là phần trăm so với tổng số sản phẩm (làm tròn)
- [ ] Test API với curl/Postman và verify response structure
- [ ] Console.log response để đảm bảo data đúng format

---

## 📝 Reference

- **API Documentation:** `ADMIN_API_DOCUMENTATION.md` - Section "Statistics & Analytics"
- **Frontend Code:** `src/app/admin/dashboard/page.tsx`
- **TypeScript Interface:** `src/lib/apiService.ts` - Interface `DashboardStats`

---

## 🎯 Expected Result

Sau khi fix xong, Dashboard sẽ hiển thị:

1. ✅ Card "Tổng doanh thu" có số tiền (ví dụ: "45.000.000đ")
2. ✅ PieChart "Phân loại sản phẩm" có các pie slices với label (ví dụ: "Túi Tote: 40%")

---

## 📞 Contact

Nếu có vấn đề khi implement, hãy kiểm tra:

1. Database có đơn hàng với `status = 'COMPLETED'` chưa?
2. Database có sản phẩm với `category` khác nhau chưa?
3. Response có đúng format JSON như trong doc không?
4. Console.log từng bước để debug data flow

---

**Last Updated:** 2025-11-19
**Priority:** 🔴 HIGH (Dashboard không hoạt động đầy đủ)

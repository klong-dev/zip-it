# Tài liệu Cấu trúc Project - ZIP E-commerce

## 📋 Tổng quan các thay đổi

### 1. **Components được tách riêng (Reusable)**

#### **Header Component** (`src/components/Header.tsx`)
- Chứa top icon bar và navigation bar
- Được sử dụng trong tất cả các trang
- Có link navigation đến: Home, Shop, Services, Cart
- Responsive design cho mobile và desktop

#### **Footer Component** (`src/components/Footer.tsx`)
- Chứa thông tin liên hệ, giờ làm việc, social media
- Được sử dụng trong tất cả các trang
- Responsive design với grid layout

#### **ProductCard Component** (`src/components/ProductCard.tsx`)
- Component hiển thị thông tin sản phẩm dạng card
- Tự động link đến trang detail khi click
- Có hover effect và rating stars
- Có thể tái sử dụng ở nhiều nơi

### 2. **Data Management** (`src/lib/products.ts`)
- Tập trung quản lý dữ liệu sản phẩm
- Interface `Product` định nghĩa cấu trúc dữ liệu
- Dễ dàng thêm/sửa/xóa sản phẩm
- Có thể mở rộng để kết nối với API/Database

### 3. **Dynamic Routing - Shop Detail**

#### **Route cũ**: `/shop/detail` (static, không phân biệt sản phẩm)
#### **Route mới**: `/shop/[id]` (dynamic, mỗi sản phẩm có URL riêng)

**Ví dụ URLs:**
- `/shop/1` - Cup Holder PreMade
- `/shop/5` - Canvas Tote White
- `/shop/9` - Cosmetic Bag White

**Tính năng:**
- Tự động lấy dữ liệu sản phẩm theo ID
- Hiển thị thông tin chi tiết từ database
- Return 404 page nếu sản phẩm không tồn tại
- SEO friendly với unique URLs

### 4. **Pages được refactor**

#### **Home Page** (`src/app/page.tsx`)
- Sử dụng Header và Footer component
- Giảm code từ ~399 lines xuống còn ~350 lines

#### **Shop Page** (`src/app/shop/page.tsx`)
- Sử dụng Header, Footer và ProductCard component
- Hiển thị danh sách sản phẩm từ `products.ts`
- Mỗi card link đến detail page với ID tương ứng

#### **Cart Page** (`src/app/cart/page.tsx`)
- Sử dụng Header và Footer component
- Giữ nguyên logic giỏ hàng

#### **Services Page** (`src/app/services/page.tsx`)
- Sử dụng Header và Footer component
- Giữ nguyên nội dung services

## 🗂️ Cấu trúc thư mục mới

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── cart/
│   │   └── page.tsx          # Cart page
│   ├── services/
│   │   └── page.tsx          # Services page
│   └── shop/
│       ├── page.tsx          # Shop listing page
│       └── [id]/
│           └── page.tsx      # Dynamic product detail page
│
├── components/
│   ├── Header.tsx            # ✨ NEW - Reusable header
│   ├── Footer.tsx            # ✨ NEW - Reusable footer
│   ├── ProductCard.tsx       # ✨ NEW - Reusable product card
│   └── ui/                   # Existing UI components
│
└── lib/
    ├── products.ts           # ✨ NEW - Product data management
    └── utils.ts              # Existing utilities
```

## 🔗 Linking giữa các pages

### Navigation Links (trong Header):
- **HOME** → `/`
- **PRODUCTS** → `/shop`
- **SERVICES** → `/services`
- **CART** → `/cart`

### Product Links (trong Shop page):
- Click vào bất kỳ ProductCard nào → `/shop/{product.id}`

## 🎯 Lợi ích của việc refactor

### 1. **Code Reusability**
- Header và Footer chỉ viết 1 lần, dùng ở mọi nơi
- Thay đổi header/footer chỉ cần sửa 1 file
- ProductCard có thể dùng cho homepage, shop page, related products

### 2. **Maintainability**
- Code ngắn gọn, dễ đọc hơn
- Logic tách biệt, dễ debug
- Dữ liệu tập trung, dễ quản lý

### 3. **Scalability**
- Dễ dàng thêm sản phẩm mới vào `products.ts`
- Có thể dễ dàng chuyển sang fetch data từ API
- Dynamic routing hỗ trợ unlimited products

### 4. **SEO & User Experience**
- Mỗi sản phẩm có URL riêng biệt
- Có thể share direct link đến sản phẩm
- Browser back/forward hoạt động tốt hơn

## 📝 Hướng dẫn sử dụng

### Thêm sản phẩm mới:
```typescript
// Trong src/lib/products.ts
{
  id: 14,
  name: "New Product Name",
  price: "$XX.XX",
  priceRange: "$XX.XX - $YY.YY",
  image: "/path-to-image.jpg",
  category: "Category Name",
  description: "Short description",
  rating: 5,
  reviews: 0,
  sku: "PROD-XXX-14",
  tags: ["Tag1", "Tag2"],
  detailedDescription: "Long detailed description..."
}
```

### Sử dụng components:
```tsx
// Trong bất kỳ page nào
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function YourPage() {
  return (
    <div>
      <Header />
      {/* Your content here */}
      <Footer />
    </div>
  );
}
```

## 🚀 Next Steps (Tương lai có thể mở rộng)

1. **Backend Integration**
   - Kết nối với database (MongoDB, PostgreSQL, etc.)
   - Tạo API endpoints cho products
   - Implement authentication

2. **Shopping Cart Logic**
   - Add to cart functionality
   - Local storage hoặc state management (Redux, Zustand)
   - Cart persistence

3. **Search & Filter**
   - Search products by name
   - Filter by category, price range
   - Sort options

4. **User Features**
   - User authentication
   - Order history
   - Wishlist
   - Product reviews

5. **Admin Panel**
   - Product management (CRUD)
   - Order management
   - User management

## 📞 Support

Nếu có câu hỏi về cấu trúc mới hoặc cần hỗ trợ, vui lòng liên hệ development team.

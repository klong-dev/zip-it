# ZIP IT YOUR WAY - API Documentation for NestJS Backend

## Overview
This document provides comprehensive API specifications for the ZIP e-commerce platform backend. All endpoints should be implemented in NestJS with proper validation, error handling, and authentication where required.

**Base URL**: `http://localhost:3000/api` (development)

**Authentication**: JWT Bearer Token (where applicable)

---

## Table of Contents
1. [Products API](#1-products-api)
2. [Cart API](#2-cart-api)
3. [Orders API](#3-orders-api)
4. [Services API](#4-services-api)
5. [Reviews API](#5-reviews-api)
6. [Customization API](#6-customization-api)
7. [Vouchers API](#7-vouchers-api)
8. [User API](#8-user-api)

---

## 1. Products API

### 1.1 Get All Products
**Endpoint**: `GET /products`

**Description**: Retrieve all products with optional filtering, sorting, and pagination.

**Query Parameters**:
```typescript
{
  category?: string;           // Filter by category: "Cup Holder" | "Canvas Tote" | "Cosmetic Bag" | "Pen Case"
  minPrice?: number;           // Minimum price filter
  maxPrice?: number;           // Maximum price filter
  tags?: string[];             // Filter by tags (comma-separated)
  search?: string;             // Search in product name and description
  sortBy?: string;             // "price" | "rating" | "name" | "reviews"
  sortOrder?: string;          // "asc" | "desc"
  page?: number;               // Page number (default: 1)
  limit?: number;              // Items per page (default: 20)
}
```

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    products: [
      {
        id: number;
        name: string;
        price: string;               // e.g., "$15.00"
        priceRange: string;          // e.g., "$15.00 - $25.00"
        image: string;               // URL to product image
        category: string;
        description: string;
        rating: number;              // 1-5
        reviews: number;             // Count of reviews
        sku: string;
        tags: string[];
        detailedDescription: string;
        createdAt: string;           // ISO 8601
        updatedAt: string;           // ISO 8601
      }
    ],
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }
}
```

**Error Response**: `400 Bad Request` | `500 Internal Server Error`

---

### 1.2 Get Product by ID
**Endpoint**: `GET /products/:id`

**Description**: Retrieve detailed information about a specific product.

**Path Parameters**:
- `id` (number, required): Product ID

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    id: number;
    name: string;
    price: string;
    priceRange: string;
    image: string;
    category: string;
    description: string;
    rating: number;
    reviews: number;
    sku: string;
    tags: string[];
    detailedDescription: string;
    additionalInfo: {
      material: string;            // e.g., "Premium Fabric"
      careInstructions: string;    // e.g., "Hand wash or machine wash on gentle cycle"
      ecoFriendly: boolean;
      customizable: boolean;
    };
    images: string[];              // Array of image URLs (main + gallery)
    stock: number;                 // Available quantity
    createdAt: string;
    updatedAt: string;
  }
}
```

**Error Response**: `404 Not Found` | `500 Internal Server Error`

---

### 1.3 Get Product Categories
**Endpoint**: `GET /products/categories`

**Description**: Get list of all available product categories.

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    categories: [
      {
        id: number;
        name: string;              // e.g., "Cup Holder"
        slug: string;              // e.g., "cup-holder"
        productCount: number;      // Number of products in category
        image: string;             // Category thumbnail
      }
    ]
  }
}
```

---

### 1.4 Create Product (Admin Only)
**Endpoint**: `POST /products`

**Authentication**: Required (Admin role)

**Request Body**:
```typescript
{
  name: string;                    // Required
  price: string;                   // Required, e.g., "$15.00"
  priceRange: string;              // Optional, e.g., "$15.00 - $25.00"
  image: string;                   // Required, image URL
  category: string;                // Required
  description: string;             // Required
  rating: number;                  // Optional, default: 5
  sku: string;                     // Required, unique
  tags: string[];                  // Optional
  detailedDescription: string;     // Optional
  additionalInfo: {
    material: string;
    careInstructions: string;
    ecoFriendly: boolean;
    customizable: boolean;
  };
  stock: number;                   // Required
}
```

**Response**: `201 Created`
```typescript
{
  success: true,
  data: {
    id: number;
    // ... all product fields
  }
}
```

**Error Response**: `400 Bad Request` | `401 Unauthorized` | `403 Forbidden`

---

## 2. Cart API

### 2.1 Get User Cart
**Endpoint**: `GET /cart`

**Authentication**: Required

**Description**: Retrieve current user's shopping cart.

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    id: number;
    userId: number;
    items: [
      {
        id: number;                  // Cart item ID
        productId: number;
        product: {
          id: number;
          name: string;
          price: string;
          image: string;
          priceRange: string;
        };
        quantity: number;
        customization: {
          type: "embroidery" | "print" | "premade";
          details: string;           // Custom text, design file URL, etc.
        } | null;
        subtotal: string;            // Calculated price for this item
      }
    ],
    totalItems: number;
    subtotal: string;
    shippingFee: string;
    discount: string;
    totalPayment: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

---

### 2.2 Add Item to Cart
**Endpoint**: `POST /cart/items`

**Authentication**: Required

**Request Body**:
```typescript
{
  productId: number;               // Required
  quantity: number;                // Required, min: 1
  customization?: {
    type: "embroidery" | "print" | "premade";
    details: string;               // Custom text, uploaded design URL
  };
}
```

**Response**: `201 Created`
```typescript
{
  success: true,
  data: {
    id: number;
    productId: number;
    quantity: number;
    customization: object | null;
    subtotal: string;
  },
  message: "Item added to cart successfully"
}
```

**Error Response**: `400 Bad Request` | `401 Unauthorized` | `404 Not Found`

---

### 2.3 Update Cart Item
**Endpoint**: `PATCH /cart/items/:itemId`

**Authentication**: Required

**Path Parameters**:
- `itemId` (number, required): Cart item ID

**Request Body**:
```typescript
{
  quantity?: number;               // Optional, min: 1
  customization?: {
    type: "embroidery" | "print" | "premade";
    details: string;
  };
}
```

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    id: number;
    quantity: number;
    customization: object | null;
    subtotal: string;
  },
  message: "Cart item updated successfully"
}
```

---

### 2.4 Delete Cart Item
**Endpoint**: `DELETE /cart/items/:itemId`

**Authentication**: Required

**Path Parameters**:
- `itemId` (number, required): Cart item ID

**Response**: `200 OK`
```typescript
{
  success: true,
  message: "Item removed from cart successfully"
}
```

---

### 2.5 Clear Cart
**Endpoint**: `DELETE /cart`

**Authentication**: Required

**Response**: `200 OK`
```typescript
{
  success: true,
  message: "Cart cleared successfully"
}
```

---

## 3. Orders API

### 3.1 Create Order
**Endpoint**: `POST /orders`

**Authentication**: Required

**Description**: Create order from current cart items.

**Request Body**:
```typescript
{
  shippingAddress: {
    receiver: string;              // Required
    phoneNumber: string;           // Required
    province: string;              // Required
    district: string;              // Required
    address: string;               // Required (detailed address)
  };
  note?: string;                   // Optional order note
  voucherCode?: string;            // Optional voucher code
  paymentMethod: "cod" | "bank_transfer" | "e_wallet";  // Required
}
```

**Response**: `201 Created`
```typescript
{
  success: true,
  data: {
    id: number;
    orderNumber: string;           // e.g., "ZIP-2025-001234"
    userId: number;
    items: [
      {
        productId: number;
        productName: string;
        productImage: string;
        quantity: number;
        price: string;
        customization: object | null;
        subtotal: string;
      }
    ];
    shippingAddress: {
      receiver: string;
      phoneNumber: string;
      province: string;
      district: string;
      address: string;
    };
    note: string;
    subtotal: string;
    shippingFee: string;
    discount: string;
    voucherCode: string | null;
    totalPayment: string;
    paymentMethod: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
    updatedAt: string;
  },
  message: "Order created successfully"
}
```

**Error Response**: `400 Bad Request` | `401 Unauthorized`

---

### 3.2 Get User Orders
**Endpoint**: `GET /orders`

**Authentication**: Required

**Query Parameters**:
```typescript
{
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  page?: number;
  limit?: number;
}
```

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    orders: [
      {
        id: number;
        orderNumber: string;
        totalPayment: string;
        status: string;
        itemsCount: number;
        createdAt: string;
      }
    ],
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }
}
```

---

### 3.3 Get Order Details
**Endpoint**: `GET /orders/:id`

**Authentication**: Required

**Path Parameters**:
- `id` (number, required): Order ID

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    id: number;
    orderNumber: string;
    userId: number;
    items: [
      {
        id: number;
        productId: number;
        productName: string;
        productImage: string;
        quantity: number;
        price: string;
        customization: object | null;
        subtotal: string;
      }
    ];
    shippingAddress: {
      receiver: string;
      phoneNumber: string;
      province: string;
      district: string;
      address: string;
    };
    note: string;
    subtotal: string;
    shippingFee: string;
    discount: string;
    voucherCode: string | null;
    totalPayment: string;
    paymentMethod: string;
    status: string;
    statusHistory: [
      {
        status: string;
        timestamp: string;
        note: string;
      }
    ];
    createdAt: string;
    updatedAt: string;
  }
}
```

---

### 3.4 Cancel Order
**Endpoint**: `PATCH /orders/:id/cancel`

**Authentication**: Required

**Path Parameters**:
- `id` (number, required): Order ID

**Request Body**:
```typescript
{
  reason: string;                  // Required
}
```

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    id: number;
    status: "cancelled";
    cancelReason: string;
  },
  message: "Order cancelled successfully"
}
```

---

## 4. Services API

### 4.1 Get All Services
**Endpoint**: `GET /services`

**Description**: Get list of services offered (embroidery, printing, design).

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    services: [
      {
        id: number;
        title: string;               // e.g., "EMBROIDERY SERVICE"
        slug: string;                // e.g., "embroidery-service"
        description: string;
        image: string;
        icon: string;
        features: string[];
        pricing: {
          basePrice: string;
          unit: string;              // e.g., "per item", "per design"
          priceRanges: [
            {
              quantity: string;      // e.g., "1-10 items"
              price: string;
            }
          ];
        };
        turnaroundTime: string;      // e.g., "3-5 business days"
        comments: number;
        createdAt: string;
        updatedAt: string;
      }
    ]
  }
}
```

---

### 4.2 Get Service by Slug
**Endpoint**: `GET /services/:slug`

**Path Parameters**:
- `slug` (string, required): Service slug

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    id: number;
    title: string;
    slug: string;
    description: string;
    detailedDescription: string;
    image: string;
    gallery: string[];             // Array of image URLs
    icon: string;
    features: string[];
    pricing: object;
    turnaroundTime: string;
    requirements: string[];        // e.g., ["Minimum order: 10 items", "Vector file required"]
    faq: [
      {
        question: string;
        answer: string;
      }
    ];
    comments: number;
    createdAt: string;
    updatedAt: string;
  }
}
```

---

### 4.3 Request Service Quote
**Endpoint**: `POST /services/quote`

**Authentication**: Optional

**Request Body**:
```typescript
{
  serviceType: "embroidery" | "printing" | "design";  // Required
  productType: string;               // e.g., "Cup Holder", "Canvas Tote"
  quantity: number;                  // Required
  customizationDetails: string;      // Required, description of requirements
  designFile?: string;               // Optional, URL to uploaded design
  contactInfo: {
    name: string;                    // Required
    email: string;                   // Required
    phone: string;                   // Required
  };
}
```

**Response**: `201 Created`
```typescript
{
  success: true,
  data: {
    quoteId: string;                 // e.g., "QUOTE-2025-001234"
    estimatedPrice: string;
    estimatedDelivery: string;
    status: "pending" | "reviewed" | "quoted" | "accepted" | "rejected";
  },
  message: "Quote request submitted successfully. We'll contact you within 24 hours."
}
```

---

## 5. Reviews API

### 5.1 Get Product Reviews
**Endpoint**: `GET /products/:productId/reviews`

**Path Parameters**:
- `productId` (number, required): Product ID

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;
  sortBy?: "rating" | "date";      // default: "date"
  sortOrder?: "asc" | "desc";      // default: "desc"
}
```

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    reviews: [
      {
        id: number;
        productId: number;
        userId: number;
        userName: string;            // e.g., "Customer" or actual name
        rating: number;              // 1-5
        title: string;               // e.g., "Great product!"
        comment: string;
        images: string[];            // Optional review images
        verified: boolean;           // Verified purchase
        createdAt: string;
        updatedAt: string;
      }
    ],
    summary: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
      };
    };
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }
}
```

---

### 5.2 Create Product Review
**Endpoint**: `POST /products/:productId/reviews`

**Authentication**: Required

**Path Parameters**:
- `productId` (number, required): Product ID

**Request Body**:
```typescript
{
  rating: number;                    // Required, 1-5
  title: string;                     // Required
  comment: string;                   // Required
  images?: string[];                 // Optional, URLs to review images
}
```

**Response**: `201 Created`
```typescript
{
  success: true,
  data: {
    id: number;
    productId: number;
    rating: number;
    title: string;
    comment: string;
    images: string[];
    createdAt: string;
  },
  message: "Review submitted successfully"
}
```

**Error Response**: `400 Bad Request` | `401 Unauthorized` | `403 Forbidden` (if user hasn't purchased product)

---

### 5.3 Update Review
**Endpoint**: `PATCH /reviews/:reviewId`

**Authentication**: Required (must be review owner)

**Path Parameters**:
- `reviewId` (number, required): Review ID

**Request Body**:
```typescript
{
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}
```

**Response**: `200 OK`

---

### 5.4 Delete Review
**Endpoint**: `DELETE /reviews/:reviewId`

**Authentication**: Required (must be review owner or admin)

**Response**: `200 OK`

---

## 6. Customization API

### 6.1 Upload Customization Design
**Endpoint**: `POST /customization/upload`

**Authentication**: Required

**Description**: Upload design file for customization (embroidery/printing).

**Content-Type**: `multipart/form-data`

**Request Body**:
```typescript
{
  file: File;                        // Required, image file (PNG, JPG, SVG)
  type: "embroidery" | "print";      // Required
}
```

**Response**: `201 Created`
```typescript
{
  success: true,
  data: {
    fileUrl: string;                 // URL to uploaded file
    fileId: string;                  // Unique file identifier
    thumbnail: string;               // Thumbnail URL
    validationStatus: "valid" | "needs_review" | "invalid";
    validationMessage: string;       // e.g., "Image resolution too low for printing"
  }
}
```

---

### 6.2 Get Customization Options
**Endpoint**: `GET /customization/options`

**Description**: Get available customization options for products.

**Query Parameters**:
```typescript
{
  productCategory?: string;          // Filter by product category
}
```

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    embroidery: {
      fonts: string[];               // Available font names
      colors: string[];              // Available thread colors
      maxCharacters: number;
      pricing: {
        perCharacter: string;
        basePrice: string;
      };
    };
    printing: {
      methods: ["screen-print", "heat-transfer", "sublimation"];
      colors: string[];
      maxDesignSize: {
        width: number;
        height: number;
        unit: "cm" | "inch";
      };
      pricing: {
        perItem: string;
        colorSurcharge: string;       // Per additional color
      };
    };
  }
}
```

---

## 7. Vouchers API

### 7.1 Validate Voucher
**Endpoint**: `POST /vouchers/validate`

**Authentication**: Required

**Request Body**:
```typescript
{
  code: string;                      // Required, voucher code
  cartTotal: string;                 // Required, current cart total
}
```

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    code: string;
    valid: boolean;
    discount: string;                // Discount amount
    discountType: "percentage" | "fixed";
    discountValue: number;           // e.g., 10 for 10% or $10
    minimumOrderValue: string;
    expiresAt: string;
    message: string;                 // e.g., "Voucher applied successfully"
  }
}
```

**Error Response**: `400 Bad Request` (invalid or expired voucher)
```typescript
{
  success: false,
  error: {
    code: "VOUCHER_INVALID" | "VOUCHER_EXPIRED" | "MINIMUM_NOT_MET";
    message: string;
  }
}
```

---

### 7.2 Get User Vouchers
**Endpoint**: `GET /vouchers`

**Authentication**: Required

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    vouchers: [
      {
        id: number;
        code: string;
        description: string;
        discountType: "percentage" | "fixed";
        discountValue: number;
        minimumOrderValue: string;
        maxUses: number;
        usedCount: number;
        expiresAt: string;
        isActive: boolean;
      }
    ]
  }
}
```

---

## 8. User API

### 8.1 Register
**Endpoint**: `POST /auth/register`

**Request Body**:
```typescript
{
  email: string;                     // Required, unique
  password: string;                  // Required, min 8 characters
  name: string;                      // Required
  phone?: string;                    // Optional
}
```

**Response**: `201 Created`
```typescript
{
  success: true,
  data: {
    user: {
      id: number;
      email: string;
      name: string;
      phone: string;
      createdAt: string;
    };
    accessToken: string;
    refreshToken: string;
  }
}
```

---

### 8.2 Login
**Endpoint**: `POST /auth/login`

**Request Body**:
```typescript
{
  email: string;                     // Required
  password: string;                  // Required
}
```

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    user: {
      id: number;
      email: string;
      name: string;
      phone: string;
      role: "customer" | "admin";
    };
    accessToken: string;
    refreshToken: string;
  }
}
```

---

### 8.3 Get User Profile
**Endpoint**: `GET /users/profile`

**Authentication**: Required

**Response**: `200 OK`
```typescript
{
  success: true,
  data: {
    id: number;
    email: string;
    name: string;
    phone: string;
    avatar: string;
    addresses: [
      {
        id: number;
        receiver: string;
        phoneNumber: string;
        province: string;
        district: string;
        address: string;
        isDefault: boolean;
      }
    ];
    createdAt: string;
    updatedAt: string;
  }
}
```

---

### 8.4 Update User Profile
**Endpoint**: `PATCH /users/profile`

**Authentication**: Required

**Request Body**:
```typescript
{
  name?: string;
  phone?: string;
  avatar?: string;                   // URL to uploaded avatar
}
```

**Response**: `200 OK`

---

### 8.5 Add Address
**Endpoint**: `POST /users/addresses`

**Authentication**: Required

**Request Body**:
```typescript
{
  receiver: string;                  // Required
  phoneNumber: string;               // Required
  province: string;                  // Required
  district: string;                  // Required
  address: string;                   // Required
  isDefault: boolean;                // Optional, default: false
}
```

**Response**: `201 Created`

---

### 8.6 Update Address
**Endpoint**: `PATCH /users/addresses/:addressId`

**Authentication**: Required

**Response**: `200 OK`

---

### 8.7 Delete Address
**Endpoint**: `DELETE /users/addresses/:addressId`

**Authentication**: Required

**Response**: `200 OK`

---

## Common Error Response Format

All error responses follow this structure:

```typescript
{
  success: false,
  error: {
    code: string;                    // e.g., "VALIDATION_ERROR", "NOT_FOUND"
    message: string;                 // Human-readable error message
    details?: any;                   // Additional error details (validation errors, etc.)
  }
}
```

**HTTP Status Codes**:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity (validation errors)
- `500` - Internal Server Error

---

## Additional Notes

### Image Upload
For all image uploads (products, customization, reviews, avatars), implement a separate endpoint:

**Endpoint**: `POST /upload/image`

**Content-Type**: `multipart/form-data`

**Request**:
```typescript
{
  file: File;                        // Required
  type: "product" | "customization" | "review" | "avatar";
}
```

**Response**: `201 Created`
```typescript
{
  success: true,
  data: {
    url: string;                     // Public URL to uploaded image
    thumbnail: string;               // Thumbnail URL
  }
}
```

### Pagination
Default pagination values:
- `page`: 1
- `limit`: 20
- `maxLimit`: 100

### Rate Limiting
Recommended rate limits:
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour
- Admin users: Unlimited

### CORS
Configure CORS to allow requests from Next.js frontend domain.

### WebSocket (Optional)
For real-time order status updates:
- **Namespace**: `/orders`
- **Events**: `order:updated`, `order:shipped`, `order:delivered`

---

## Database Schema Recommendations

### Products Table
```sql
- id (PK)
- name
- price
- price_range
- image_url
- category
- description
- detailed_description
- rating (computed from reviews)
- review_count
- sku (unique)
- tags (JSON or separate table)
- stock
- created_at
- updated_at
```

### Cart Table
```sql
- id (PK)
- user_id (FK)
- created_at
- updated_at
```

### CartItems Table
```sql
- id (PK)
- cart_id (FK)
- product_id (FK)
- quantity
- customization (JSON)
- created_at
- updated_at
```

### Orders Table
```sql
- id (PK)
- order_number (unique)
- user_id (FK)
- shipping_address (JSON)
- note
- subtotal
- shipping_fee
- discount
- voucher_code
- total_payment
- payment_method
- status (enum)
- created_at
- updated_at
```

### OrderItems Table
```sql
- id (PK)
- order_id (FK)
- product_id (FK)
- product_snapshot (JSON - product data at time of order)
- quantity
- price
- customization (JSON)
- created_at
```

### Reviews Table
```sql
- id (PK)
- product_id (FK)
- user_id (FK)
- order_id (FK) - for verified purchases
- rating
- title
- comment
- images (JSON)
- verified
- created_at
- updated_at
```

### Users Table
```sql
- id (PK)
- email (unique)
- password_hash
- name
- phone
- avatar
- role (enum: customer, admin)
- created_at
- updated_at
```

### Addresses Table
```sql
- id (PK)
- user_id (FK)
- receiver
- phone_number
- province
- district
- address
- is_default
- created_at
- updated_at
```

### Vouchers Table
```sql
- id (PK)
- code (unique)
- description
- discount_type (enum: percentage, fixed)
- discount_value
- minimum_order_value
- max_uses
- used_count
- expires_at
- is_active
- created_at
- updated_at
```

---

## Implementation Priority

**Phase 1 - Core E-commerce** (Must Have):
1. Products API (GET all, GET by ID, categories)
2. Cart API (all endpoints)
3. User API (register, login, profile)
4. Orders API (create, get user orders, get details)

**Phase 2 - Enhanced Features** (Should Have):
5. Reviews API
6. Vouchers API
7. Addresses management
8. Product search and filtering

**Phase 3 - Customization** (Could Have):
9. Customization API
10. Services API
11. Quote requests
12. Advanced order management

---

## Testing Recommendations

- Use Swagger/OpenAPI for API documentation and testing
- Implement unit tests for all services
- Add integration tests for critical flows (checkout, order creation)
- Use Postman collections for manual API testing
- Implement proper request validation using `class-validator` and `class-transformer`
- Add database migrations using TypeORM or Prisma

---

**Last Updated**: October 24, 2025  
**Version**: 1.0  
**Contact**: zip_funi@gmail.com

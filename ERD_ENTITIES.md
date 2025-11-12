ZIP IT YOUR WAY — ERD Entities (concise)

Purpose: concise list of entities, primary fields, and relationships to hand to an ERD designer.

Entities
--------

1. User
- PK: id
- Fields: email, password_hash, name, phone, avatar, role (customer|admin), createdAt, updatedAt
- Relations: hasMany Addresses, hasMany Orders, hasMany Reviews, hasOne Cart

2. Address
- PK: id
- Fields: userId (FK -> User.id), receiver, phoneNumber, province, district, address, isDefault, createdAt, updatedAt
- Relations: belongsTo User, used by Orders (stored snapshot)

3. Product
- PK: id
- Fields: name, price, priceRange, categoryId (FK), sku, description, detailedDescription, rating (computed), reviewCount, stock, mainImageUrl, createdAt, updatedAt
- Relations: belongsTo Category, hasMany ProductImage, hasMany Review, hasMany OrderItem, hasMany CartItem, many-to-many with Tag via ProductTag

4. ProductImage
- PK: id
- Fields: productId (FK -> Product.id), url, altText, sortOrder
- Relations: belongsTo Product

5. Category
- PK: id
- Fields: name, slug, imageUrl, productCount
- Relations: hasMany Product

6. Tag
- PK: id
- Fields: name, slug
- Relations: many-to-many with Product via ProductTag

7. ProductTag (join)
- PK: id
- Fields: productId (FK), tagId (FK)
- Relations: links Product <-> Tag

8. Review
- PK: id
- Fields: productId (FK), userId (FK), orderId (nullable FK for verified purchase), rating (1-5), title, comment, images (JSON array), verified (bool), createdAt, updatedAt
- Relations: belongsTo Product, belongsTo User, optionally belongsTo Order

9. Cart
- PK: id
- Fields: userId (FK -> User.id), createdAt, updatedAt
- Relations: belongsTo User, hasMany CartItem

10. CartItem
- PK: id
- Fields: cartId (FK), productId (FK), quantity, customization (JSON), subtotal, createdAt, updatedAt
- Relations: belongsTo Cart, belongsTo Product

11. Order
- PK: id
- Fields: orderNumber, userId (FK), shippingAddress (JSON snapshot), note, subtotal, shippingFee, discount, voucherCode, totalPayment, paymentMethod, status (enum), createdAt, updatedAt
- Relations: belongsTo User, hasMany OrderItem, hasMany OrderStatusHistory

12. OrderItem
- PK: id
- Fields: orderId (FK), productId (FK), productSnapshot (JSON), quantity, price, customization (JSON), subtotal
- Relations: belongsTo Order, references Product for reporting

13. OrderStatusHistory
- PK: id
- Fields: orderId (FK), status, timestamp, note
- Relations: belongsTo Order

14. Voucher
- PK: id
- Fields: code, description, discountType (percentage|fixed), discountValue, minimumOrderValue, maxUses, usedCount, expiresAt, isActive, createdAt, updatedAt
- Relations: can be applied to Orders

15. Service
- PK: id
- Fields: title, slug, description, detailedDescription, imageUrl, gallery (JSON), features (JSON), pricing (JSON), turnaroundTime, requirements (JSON), createdAt, updatedAt
- Relations: may be referenced by Quote

16. Quote (Service Quote / Request)
- PK: id
- Fields: quoteNumber, userId (nullable), serviceType, productType, quantity, customizationDetails, designFileUrl, contactInfo (JSON), estimatedPrice, estimatedDelivery, status, createdAt, updatedAt
- Relations: optionally belongsTo User, references Service

17. CustomizationFile / Upload
- PK: id
- Fields: userId (FK), fileUrl, fileType, thumbnailUrl, validationStatus, validationMessage, createdAt
- Relations: belongsTo User, referenced by CartItem.customization or Quote.designFileUrl

18. ReviewImage (optional)
- PK: id
- Fields: reviewId (FK), url, altText
- Relations: belongsTo Review

19. Payment (optional/ledger)
- PK: id
- Fields: orderId (FK), paymentMethod, amount, status, providerReference, paidAt, createdAt
- Relations: belongsTo Order

20. Upload (generic)
- PK: id
- Fields: userId (FK nullable), url, type (product|customization|review|avatar), metadata (JSON), createdAt
- Relations: belongsTo User (nullable)

Notes on relationships (short):
- User 1..* Address
- User 1..1 Cart; Cart 1..* CartItem -> Product
- Product *..1 Category
- Product *..* Tag (via ProductTag)
- Product 1..* ProductImage
- Product 1..* Review; Review *..1 User
- User 1..* Order; Order 1..* OrderItem -> Product (snapshot)
- Voucher applied to Order (voucherCode stored on Order)
- Service-related Quotes stored in Quote entity; Quote may reference Uploads (design files)

Suggested minimal fields for ERD boxes: PK, a few important attributes, and FKs. Keep JSON snapshot fields where denormalization is useful (Order.shippingAddress, OrderItem.productSnapshot).

---

File created for developers to draw ERD. If you want, I can also produce a Mermaid ER diagram or a SQL DDL skeleton next.
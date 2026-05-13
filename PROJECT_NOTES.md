# ShopVerse Project Notes

ShopVerse is a full-stack e-commerce project built with Java Spring Boot, MySQL, React, and TypeScript. It is designed to feel more like a real Amazon/Flipkart-style marketplace.

## Features

- Responsive marketplace homepage
- Product catalog with local image assets
- Search, category, price, and rating filters
- Cart drawer with quantity controls
- Checkout with payment method selection
- User register/login
- BCrypt password hashing
- JWT-style token returned after login/register
- Profile popup with editable contact details and addresses
- Order history page
- Admin panel for product edit/delete
- Seller dashboard with inventory metrics and product listing form
- MySQL persistence for users, products, and orders

## Important Folders

```text
backend/   Java Spring Boot API
frontend/  React TypeScript UI
database/  MySQL database script
```

## Backend APIs

Auth:

```text
POST /api/auth/register
POST /api/auth/login
```

Products:

```text
GET    /api/products
GET    /api/products/deals
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

Orders:

```text
POST /api/orders
GET  /api/orders?userId=1
```

## Key Backend Files

```text
backend/src/main/java/com/shopverse/model/AppUser.java
backend/src/main/java/com/shopverse/model/Product.java
backend/src/main/java/com/shopverse/model/CustomerOrder.java
backend/src/main/java/com/shopverse/service/AuthService.java
backend/src/main/java/com/shopverse/service/JwtService.java
backend/src/main/java/com/shopverse/service/ProductService.java
backend/src/main/java/com/shopverse/service/OrderService.java
```

## Key Frontend Files

```text
frontend/src/main.tsx
frontend/src/styles.css
frontend/public/assets/
```

## Run

```powershell
cd "C:\Users\Nikhil Sharma\Desktop\shopverse-mysql"
.\start-shopverse.ps1
```

Frontend:

```text
http://localhost:5174
```

Backend:

```text
http://localhost:8081/api
```

## MySQL Tables

```sql
USE shopverse;
SHOW TABLES;
SELECT * FROM app_users;
SELECT * FROM product;
SELECT * FROM customer_orders;
SELECT * FROM order_item;
```

## Resume Line

Built ShopVerse, a full-stack e-commerce platform using Java Spring Boot, MySQL, React, and TypeScript. Implemented BCrypt login, JWT-style token responses, product catalog APIs, admin product management, seller dashboard, order history, payment method checkout, search/category/price/rating filters, JPA relationships, local product assets, and responsive marketplace UI.

## Interview Explanation

ShopVerse is a full-stack e-commerce app. The frontend is a responsive React marketplace with search, filters, cart, checkout, profile, order history, admin panel, and seller dashboard. The backend is a Spring Boot REST API connected to MySQL with JPA entities for users, products, orders, and order items. Login uses BCrypt password hashing and returns a signed token-style response.


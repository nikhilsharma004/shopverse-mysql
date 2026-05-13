# ShopVerse

ShopVerse is a full-stack e-commerce resume project inspired by modern marketplaces such as Amazon and Flipkart. It uses a Java Spring Boot REST API, MySQL persistence, and a responsive React storefront.

## Tech Stack

- Java 21, Spring Boot 3, Maven
- Spring Web, Spring Data JPA, Bean Validation
- MySQL
- React, TypeScript, Vite
- Responsive CSS

## Features

- Real-looking marketplace homepage
- Searchable product catalog
- Category and deal sections
- Product cards with ratings, pricing, discount badges, and delivery text
- Cart drawer with quantity controls
- User registration/login with BCrypt password hashing and JWT-style token response
- Profile modal with editable contact details and addresses
- Order history page
- Admin panel for product management
- Seller dashboard with inventory metrics and product listing form
- Payment method UI for UPI, card, net banking, EMI, and cash on delivery
- Price and rating filters
- Local product image assets
- Checkout/order creation API
- MySQL database connection
- Seed products inserted automatically
- One-command startup script

## MySQL Setup

Your MySQL service is installed as `MySQL97`.

Create the database:

```powershell
& "C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe" -u root -p < database\schema.sql
```

The app uses these defaults:

```text
Database: shopverse
Username: root
Password: set through MYSQL_PASSWORD
```

Set your MySQL password before running:

```powershell
$env:MYSQL_PASSWORD='your_mysql_password'
```

## Run Project

From the project root:

```powershell
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

Auth APIs:

```text
POST /api/auth/register
POST /api/auth/login
```

Product management APIs:

```text
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

Order history:

```text
GET /api/orders?userId=1
```

## Manual Run

Backend:

```powershell
cd backend
$env:JAVA_HOME='C:\Program Files\Java\jdk-26.0.1'
$env:MYSQL_PASSWORD='your_mysql_password'
mvn spring-boot:run
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

## Resume Pitch

Built ShopVerse, a full-stack e-commerce platform using Java Spring Boot, MySQL, React, and TypeScript. Implemented REST APIs for products, BCrypt login, JWT-style token responses, order history, admin product management, seller dashboard, checkout/order creation, JPA entity relationships, MySQL persistence, local image assets, responsive marketplace UI, search/filtering, and one-command local startup.

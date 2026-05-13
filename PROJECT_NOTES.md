# ShopVerse Project Notes

ShopVerse is a full-stack e-commerce website project. It is designed to look like a real online shopping website inspired by Amazon and Flipkart style marketplaces.

## 1. What This Project Does

Users can:

- View a marketplace homepage
- Search products
- Filter by category
- See product price, MRP, discount, rating, stock, and delivery text
- Add products to cart
- Increase or decrease cart quantity
- Register and login as a customer
- Checkout by entering customer details
- Save an order into MySQL through the Spring Boot backend

## 2. Main Technologies

Backend:

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven
- MySQL

Frontend:

- React
- TypeScript
- Vite
- CSS
- lucide-react icons

Database:

- MySQL installed on your PC
- Service name found on your PC: `MySQL97`

## 3. Folder Structure

```text
shopverse-mysql/
  backend/
  frontend/
  database/
  README.md
  PROJECT_NOTES.md
  start-shopverse.ps1
```

Meaning:

- `backend/`: Java Spring Boot API
- `frontend/`: React shopping website
- `database/schema.sql`: Creates the MySQL database
- `start-shopverse.ps1`: Starts frontend and backend
- `README.md`: Short run instructions
- `PROJECT_NOTES.md`: Full explanation

## 4. Backend Explanation

Backend path:

```text
backend/src/main/java/com/shopverse/
```

Important folders:

```text
config/
controller/
dto/
model/
repository/
service/
```

### model

Model classes become database tables.

Important files:

```text
Product.java
AppUser.java
CustomerOrder.java
OrderItem.java
```

`Product.java` stores product details like name, brand, category, price, rating, stock, and image.

`AppUser.java` stores registered customer details like name, email, phone, password, and address.

`CustomerOrder.java` stores customer checkout details and total amount.

`OrderItem.java` stores products inside an order.

### repository

Repositories talk to MySQL.

Important files:

```text
ProductRepository.java
UserRepository.java
OrderRepository.java
```

Spring Data JPA automatically creates database queries from these repository interfaces.

### service

Services contain main logic.

Important files:

```text
ProductService.java
AuthService.java
OrderService.java
```

`ProductService.java` handles product search, category filter, and deals.

`AuthService.java` handles register and login logic.

`OrderService.java` handles checkout and saves orders in MySQL.

### controller

Controllers expose REST APIs.

Important files:

```text
ProductController.java
AuthController.java
OrderController.java
ApiExceptionHandler.java
```

`ProductController.java` provides product APIs.

`AuthController.java` provides register and login APIs.

`OrderController.java` provides checkout/order API.

`ApiExceptionHandler.java` returns clean error messages.

## 5. SQL Connection

Database configuration is here:

```text
backend/src/main/resources/application.yml
```

Important part:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/shopverse?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: ${MYSQL_USER:root}
    password: ${MYSQL_PASSWORD:}
```

This means:

- The app connects to MySQL on your PC
- Database name is `shopverse`
- Username is `root` by default
- Password comes from the `MYSQL_PASSWORD` environment variable

The password is not hardcoded for safety.

## 6. Create Database

Run this once:

```powershell
cd "C:\Users\Nikhil Sharma\Documents\Codex\2026-05-13\i-wanted-to-make-a-full\shopverse-mysql"
& "C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe" -u root -p < database\schema.sql
```

It creates:

```text
shopverse
```

Spring Boot creates tables automatically.

## 7. How To Run

Open PowerShell:

```powershell
cd "C:\Users\Nikhil Sharma\Documents\Codex\2026-05-13\i-wanted-to-make-a-full\shopverse-mysql"
.\start-shopverse.ps1
```

It will ask for your MySQL root password if `MYSQL_PASSWORD` is not already set.

Frontend:

```text
http://localhost:5174
```

Backend:

```text
http://localhost:8081/api
```

## 8. API Endpoints

Product APIs:

```text
GET /api/products
GET /api/products?query=laptop
GET /api/products?category=Mobiles
GET /api/products/deals
```

Auth APIs:

```text
POST /api/auth/register
POST /api/auth/login
```

Order API:

```text
POST /api/orders
```

Example order request:

```json
{
  "customerName": "Nikhil Sharma",
  "email": "nikhil@example.com",
  "phone": "9999999999",
  "address": "Delhi, India",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

## 9. Where Product Data Comes From

Sample products are created in:

```text
backend/src/main/java/com/shopverse/config/DataSeeder.java
```

This file adds products like:

- Laptop
- Smartphone
- Headphones
- Smart watch
- Shoes
- Air fryer
- Coffee maker

To change products, edit `DataSeeder.java`.

## 10. Frontend Explanation

Frontend path:

```text
frontend/src/
```

Important files:

```text
main.tsx
styles.css
```

`main.tsx` contains:

- Product loading
- Search
- Category filter
- Cart logic
- Checkout form
- API calls

`styles.css` contains:

- Responsive design
- Header styling
- Hero section
- Product cards
- Cart drawer
- Checkout modal
- Mobile layout

## 11. How To Change Website Text

Open:

```text
frontend/src/main.tsx
```

Example:

```tsx
<h1>Everything you need, delivered fast</h1>
```

Change the text and save.

## 12. How To Change Colors

Open:

```text
frontend/src/styles.css
```

Example:

```css
.top-header {
  background: #101820;
}
```

Change the color value.

## 13. How To Change Product Images

Open:

```text
backend/src/main/java/com/shopverse/config/DataSeeder.java
```

Find product image URLs:

```java
"https://images.unsplash.com/..."
```

Replace the URL with another image URL.

After changing Java files, restart backend.

## 14. How To Check Data In Browser

Start backend, then open:

```text
http://localhost:8081/api/products
```

Deals:

```text
http://localhost:8081/api/products/deals
```

Search:

```text
http://localhost:8081/api/products?query=laptop
```

## 15. Login And Register

The website has a `Sign in` button in the header.

Users can:

- Register a new account
- Login with email and password
- See their name in the header
- Logout by clicking their account button
- Checkout with saved customer details filled automatically

Backend files:

```text
backend/src/main/java/com/shopverse/model/AppUser.java
backend/src/main/java/com/shopverse/controller/AuthController.java
backend/src/main/java/com/shopverse/service/AuthService.java
backend/src/main/java/com/shopverse/repository/UserRepository.java
```

Frontend file:

```text
frontend/src/main.tsx
```

Important note:

```text
This project uses simple demo authentication for resume/project learning. Passwords are stored directly for simplicity. In a production project, passwords should be hashed with BCrypt and login should use JWT or sessions.
```

## 16. How To Check Data In MySQL

Open MySQL:

```powershell
& "C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe" -u root -p
```

Then run:

```sql
USE shopverse;
SHOW TABLES;
SELECT * FROM product;
SELECT * FROM app_users;
SELECT * FROM customer_orders;
SELECT * FROM order_item;
```

## 17. Resume Description

Use this on your resume:

```text
Built ShopVerse, a full-stack e-commerce platform using Java Spring Boot, MySQL, React, and TypeScript. Implemented REST APIs for product catalog, user registration/login, search, category filtering, cart checkout, order persistence, JPA relationships, seed data, and a responsive marketplace UI inspired by modern shopping platforms.
```

Short version:

```text
Developed a responsive e-commerce website with Spring Boot, MySQL, React, user login, product search, cart checkout, and order persistence.
```

## 18. Interview Explanation

If someone asks what this project is:

```text
ShopVerse is a full-stack e-commerce website. The frontend is built with React and TypeScript, and the backend is built with Java Spring Boot. Users, products, and orders are stored in MySQL using Spring Data JPA. The frontend calls REST APIs to register/login users, show products, filter/search them, add items to cart, and place orders.
```

If someone asks about SQL:

```text
The project uses MySQL as the database. Spring Boot connects to MySQL using JDBC configuration in application.yml. JPA entities like Product, CustomerOrder, and OrderItem are mapped to MySQL tables, and repositories handle database operations.
```

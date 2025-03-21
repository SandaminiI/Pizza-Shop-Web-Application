# Pizza Billing System

This is a full-stack Pizza Billing System built with React (frontend), Go Fiber (backend), and PostgreSQL (database).

## 🛠️ Prerequisites

Ensure you have the following installed:
- Node.js & npm
- Go (1.18+)
- PostgreSQL (latest version)

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/Pizza-Shop-Web-Application.git
cd pizza-billing
```

### 2️⃣ Database Setup
- Open PostgreSQL and create a new database:
```sql
CREATE DATABASE pizza_billing;
```
- Connect to the database:
```sh
psql -U postgres -d pizza_billing
```
- Create tables:
```sh
psql -U postgres -d pizza_billing -f database/schema.sql
```

### 3️⃣ Backend Setup (Go Fiber API)
```sh
cd backend
go mod tidy
go run main.go
```
The backend runs at `http://localhost:3001`.

### 4️⃣ Frontend Setup (React)
```sh
cd frontend
npm install
npm run dev
```
The frontend runs at `http://localhost:5173`.

### 5️⃣ API Testing (Postman)
- Test APIs using `http://localhost:3001/items`, `http://localhost:3001/customers`, `http://localhost:3001/invoices`.

### 6️⃣ Running Migrations
```sh
go run migrate.go
```

## 🔄 Backup & Restore Database

### Backup:
```sh
pg_dump -U postgres -d pizza_billing -F c -f pizza_billing_backup.sqlc
```

### Restore:
```sh
pg_restore -U postgres -d pizza_billing -F c pizza_billing_backup.sqlc
```

## 🎯 Features
- Item Management (Add, Update, Delete)
- Invoice Generation & Printing
- Category-based Filtering
- Full CRUD Operations

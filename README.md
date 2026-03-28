# 🟢 Memberio — Subscription-Based Membership Engine

A clean, minimal full-stack subscription management system built with Node.js, Express, MySQL, and Vanilla JS.

---

## 📁 Project Structure

```
subscription-engine/
├── server.js                  # App entry point
├── init_db.js                 # DB setup & seeder (run once)
├── package.json
├── config/
│   └── database.js            # MySQL connection
├── controllers/
│   ├── authController.js      # register / login
│   ├── planController.js      # select / cancel plan
│   └── dashboardController.js # active plan data
├── routes/
│   ├── authRoutes.js
│   ├── planRoutes.js
│   └── dashboardRoutes.js
├── middleware/
│   └── authMiddleware.js      # JWT verification
├── models/
│   └── userModel.js           # SQL queries for users
└── public/
    ├── login.html
    ├── register.html
    ├── plans.html
    ├── dashboard.html
    ├── css/style.css
    └── js/script.js
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MySQL (v8+) running locally

### 2. Install dependencies
```bash
cd subscription-engine
npm install
```

### 3. Configure your MySQL password
Open **both** of these files and replace `YOUR_PASSWORD` with your MySQL root password:
- `config/database.js`
- `init_db.js`

### 4. Initialize the database
```bash
node init_db.js
```
This creates the `membership_db` database, all tables, and seeds the 3 plans (Basic ₹499, Standard ₹999, Premium ₹1999).

### 5. Start the server
```bash
npm start
```

### 6. Open in browser
```
http://localhost:5000
```

---

## 🔑 API Endpoints

| Method | Route                        | Auth | Description              |
|--------|------------------------------|------|--------------------------|
| POST   | /api/auth/register           | ❌   | Register new user        |
| POST   | /api/auth/login              | ❌   | Login, returns JWT       |
| GET    | /api/plans                   | ❌   | List all plans           |
| POST   | /api/plans/select            | ✅   | Select a plan            |
| POST   | /api/plans/cancel            | ✅   | Cancel active plan       |
| GET    | /api/dashboard/active-plan   | ✅   | Get current plan details |

---

## 🗄️ Database Schema

### users
| Column    | Type         |
|-----------|--------------|
| id        | INT PK AI    |
| name      | VARCHAR(100) |
| email     | VARCHAR(100) UNIQUE |
| password  | VARCHAR(255) (bcrypt hashed) |
| phone     | VARCHAR(15)  |
| created_at| TIMESTAMP    |

### subscription_plan
| Column       | Type          |
|--------------|---------------|
| id           | INT PK AI     |
| name         | VARCHAR(50)   |
| price        | DECIMAL(10,2) |
| duration_days| INT           |
| description  | TEXT          |

### membership
| Column     | Type                            |
|------------|---------------------------------|
| id         | INT PK AI                       |
| user_id    | INT FK → users                  |
| plan_id    | INT FK → subscription_plan      |
| start_date | DATE                            |
| end_date   | DATE                            |
| status     | ENUM(active, cancelled, expired)|

---

## 🔒 Security Features
- **Passwords**: Hashed with `bcryptjs` (salt rounds: 10)
- **Auth**: Stateless JWT tokens (24h expiry)
- **SQL Injection**: Prevented via parameterized queries (`?` placeholders)
- **Guard**: `authMiddleware.js` protects all sensitive routes

---

## 🚀 Future Enhancements
1. **Razorpay / Stripe** payment gateway integration
2. **Email notifications** 2 days before plan expiry (SendGrid)
3. **Admin dashboard** with user management
4. **Connection pooling** for production scalability
5. **Role-based access control** (RBAC)

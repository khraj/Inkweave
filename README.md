# 🎨 PrintCraft — Custom T-Shirt Printing E-Commerce

A full-stack e-commerce web application for custom t-shirt printing with role-based authentication, product customization, and Stripe payment integration.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose) |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| Payments | Stripe (Card + Webhook support) |
| Styling | Custom CSS with CSS Variables |
| Notifications | react-hot-toast |

---

## 📁 Project Structure

```
tshirt-store/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   ├── productController.js   # CRUD + seeding
│   │   ├── orderController.js     # Create, track, manage orders
│   │   ├── paymentController.js   # Stripe intents + webhooks
│   │   └── adminController.js     # Dashboard stats, user mgmt
│   ├── middleware/
│   │   └── auth.js                # JWT protect, adminOnly
│   ├── models/
│   │   ├── User.js                # User schema (customer/admin)
│   │   ├── Product.js             # Product with variants & print areas
│   │   └── Order.js               # Order with status history
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── payment.js
│   │   └── admin.js
│   ├── .env                       # ← You must fill this in
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Navbar.js / .css
│   │   │       ├── Footer.js / .css
│   │   │       ├── ProductCard.js / .css
│   │   │       └── ProtectedRoute.js
│   │   ├── context/
│   │   │   ├── AuthContext.js     # User auth state
│   │   │   └── CartContext.js     # Cart state (localStorage)
│   │   ├── pages/
│   │   │   ├── HomePage.js        # Landing page
│   │   │   ├── ProductsPage.js    # Browse + filter products
│   │   │   ├── ProductDetailPage.js  # Customize + add to cart
│   │   │   ├── CartPage.js        # Shopping cart
│   │   │   ├── CheckoutPage.js    # Address + Stripe payment
│   │   │   ├── OrdersPage.js      # Order history + tracking
│   │   │   ├── ProfilePage.js     # User profile + password
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.js
│   │   │   │   └── RegisterPage.js
│   │   │   └── admin/
│   │   │       ├── AdminLayout.js # Sidebar layout
│   │   │       ├── AdminDashboard.js  # Stats + charts
│   │   │       ├── AdminOrders.js     # Manage all orders
│   │   │       ├── AdminProducts.js   # CRUD products
│   │   │       └── AdminUsers.js      # Manage customers
│   │   ├── utils/
│   │   │   └── api.js             # Axios instance + interceptors
│   │   ├── App.js                 # Routes
│   │   ├── index.js
│   │   └── index.css              # Global styles + CSS variables
│   ├── .env                       # ← You must fill this in
│   └── package.json
│
├── package.json                   # Root scripts (run both servers)
└── README.md
```

---

## ✅ Prerequisites

Before you begin, install these tools:

1. **Node.js** (v18 or later) — https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB Community Server** — https://www.mongodb.com/try/download/community
   - After install, start it: `mongod` (or it runs as a service automatically)
   - Verify: `mongosh` opens the Mongo shell

3. **Git** (optional) — https://git-scm.com/

---

## 🚀 Step-by-Step Local Setup

### Step 1 — Get your Stripe API Keys (Free)

1. Go to https://stripe.com and create a free account
2. In the dashboard, click **Developers → API Keys**
3. Copy your **Publishable key** (starts with `pk_test_...`)
4. Copy your **Secret key** (starts with `sk_test_...`)
5. Keep these handy for the next steps

---

### Step 2 — Configure Backend Environment

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tshirt_store
JWT_SECRET=make_this_a_long_random_string_at_least_32_chars
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_placeholder_update_if_using_webhooks
CLIENT_URL=http://localhost:3000
```

> **JWT_SECRET tip:** You can generate one by running this in your terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

### Step 3 — Configure Frontend Environment

Open `frontend/.env` and fill in:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

---

### Step 4 — Install Dependencies

Open a terminal and navigate to the `tshirt-store` folder, then run:

```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend
```

Or install all at once:
```bash
npm run install:all
```

---

### Step 5 — Start MongoDB

**Windows:**
MongoDB usually starts automatically as a Windows Service after installation.
If not, open Command Prompt as Administrator and run:
```cmd
net start MongoDB
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo systemctl start mongod
```

Verify it's running:
```bash
mongosh
# Should show a MongoDB shell prompt. Type 'exit' to leave.
```

---

### Step 6 — Start the Application

**Option A — Run both servers together (recommended):**
```bash
# From the tshirt-store root folder
npm run dev
```

**Option B — Run separately (two terminals):**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
# Output: 🚀 Server running on port 5000
# Output: ✅ MongoDB Connected: localhost
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
# Browser opens automatically at http://localhost:3000
```

---

### Step 7 — Seed Initial Data

Once the servers are running, do these one-time setup steps in your browser:

**1. Create Admin Account**
Open your browser and go to:
```
http://localhost:5000/api/auth/seed-admin
```
This creates: `admin@tshirtstore.com` / `Admin@123`

**2. Seed Demo Products**
```
http://localhost:5000/api/products/seed/demo
```
This adds 4 demo products (Round Neck, Polo, V-Neck, Hoodie).

> ⚠️ **Security:** After seeding, remove these routes in production:
> - `routes/auth.js` → delete the `/seed-admin` route
> - `routes/products.js` → delete the `/seed/demo` route

---

### Step 8 — Explore the Application

| URL | What you'll see |
|-----|----------------|
| http://localhost:3000 | Home page |
| http://localhost:3000/products | Product catalog |
| http://localhost:3000/login | Login page |
| http://localhost:3000/register | Customer registration |
| http://localhost:3000/admin | Admin dashboard (admin only) |

**Login credentials:**
- **Admin:** `admin@tshirtstore.com` / `Admin@123`
- **Customer:** Register a new account at `/register`

---

## 🔑 Role-Based Features

### Customer Role
| Feature | Description |
|---------|-------------|
| Browse Products | View all products with category filters and search |
| Product Customization | Choose size, color, print area, add design text |
| Cart Management | Add/remove items, update quantities |
| Checkout | Enter shipping address + Stripe payment |
| Order Tracking | View order status with visual progress tracker |
| Profile | Update personal info, address, change password |

### Admin Role
| Feature | Description |
|---------|-------------|
| Dashboard | Revenue charts, order stats, recent activity |
| Order Management | View all orders, update status, add tracking numbers |
| Product Management | Add/edit/deactivate products, bulk pricing |
| User Management | View all customers, activate/deactivate accounts |

---

## 💳 Testing Payments with Stripe

Use these test card numbers (Stripe test mode):

| Card | Number | Use for |
|------|--------|---------|
| Visa (success) | `4242 4242 4242 4242` | Successful payment |
| Requires auth | `4000 0025 0000 3155` | 3D Secure flow |
| Card declined | `4000 0000 0000 9995` | Decline scenario |

For all test cards:
- **Expiry:** Any future date (e.g., `12/26`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

---

## 🌐 API Reference

### Auth Endpoints
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new customer |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Protected | Get current user |
| PUT | `/api/auth/profile` | Protected | Update profile |
| PUT | `/api/auth/change-password` | Protected | Change password |

### Product Endpoints
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/products` | Public | List products (filter/search/paginate) |
| GET | `/api/products/:id` | Public | Single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Deactivate product |

### Order Endpoints
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/orders` | Customer | Place new order |
| GET | `/api/orders/my-orders` | Customer | My order history |
| GET | `/api/orders/:id` | Customer/Admin | Single order |
| PUT | `/api/orders/:id/cancel` | Customer | Cancel order |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |

### Payment Endpoints
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/payment/create-intent` | Customer | Create Stripe PaymentIntent |
| POST | `/api/payment/confirm` | Customer | Confirm payment |
| POST | `/api/payment/webhook` | Stripe | Webhook handler |

### Admin Endpoints
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/admin/dashboard` | Admin | Stats + charts data |
| GET | `/api/admin/users` | Admin | All users |
| PUT | `/api/admin/users/:id/toggle` | Admin | Toggle user status |

---

## 🔧 Common Issues & Fixes

**"MongoDB connection failed"**
- Make sure MongoDB service is running (Step 5)
- Check `MONGODB_URI` in `backend/.env`

**"Cannot find module" errors**
- Run `npm install` inside the `backend` or `frontend` folder

**"Network Error" in frontend**
- Make sure backend is running on port 5000
- Check `REACT_APP_API_URL=http://localhost:5000/api` in `frontend/.env`
- Make sure there are no CORS issues (backend allows `http://localhost:3000`)

**Stripe payment not working**
- Double-check both keys in `backend/.env` and `frontend/.env`
- Make sure you're using test keys (both start with `_test_`)
- Use the test card numbers listed above

**Port already in use**
```bash
# Kill process on port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 🚀 Production Deployment Notes

When deploying to production (e.g., Render, Railway, Vercel):

1. Set `NODE_ENV=production` in your environment
2. Use a real MongoDB Atlas connection string for `MONGODB_URI`
3. Use live Stripe keys (`sk_live_...` / `pk_live_...`)
4. Change `CLIENT_URL` in backend to your actual frontend domain
5. Build the frontend: `cd frontend && npm run build`
6. Delete seed routes from `routes/auth.js` and `routes/products.js`
7. Set a strong, random `JWT_SECRET`

---

## 📞 Support

If you run into issues:
1. Check terminal output for error messages
2. Verify all environment variables are set correctly
3. Make sure MongoDB is running before starting the backend
4. Ensure Node.js version is 18 or later: `node --version`

# NexStore - React Frontend (with Laravel & PostgreSQL API)

A modern, high-performance eCommerce frontend built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Lucide Icons**, integrated with the **Laravel 13 REST API** running on **PostgreSQL**.

---

## 🚀 Quick Start

### 1. Start the Laravel Backend (Port 8000)
From the project root (`d:\Ecommerce\ecommerce-shop`):
```bash
php artisan serve
```
*API Base URL will be accessible at: `http://localhost:8000/api`*

### 2. Start the React Frontend (Port 5173)
From the `frontend` directory (`d:\Ecommerce\ecommerce-shop\frontend`):
```bash
npm run dev
```
Open your browser at: **`http://localhost:5173`**

---

## 🔑 Demo Accounts (Pre-Seeded)

| Role | Email | Password |
|---|---|---|
| **Customer** | `john@example.com` | `password` |
| **Admin** | `admin@example.com` | `password` |

*(You can also register a new account on `/register` or shop as a guest)*

---

## 🛍️ Features Included

1. **Modern Navigation & Header**:
   - Live search with instant query routing.
   - Category navigation pills and mobile responsive drawer.
   - Live Cart Badge indicator.
   - User profile dropdown with "My Orders" and "Log Out".

2. **Homepage**:
   - Hero banner with spotlight product & gradient visual accents.
   - Interactive category cards with live product counts.
   - Trending / Featured products grid.
   - Free shipping progress threshold indicator.

3. **Shop & Catalog (`/shop`)**:
   - Category filtering (Audio, Wearables, Laptops, Gadgets, etc.).
   - Multi-option sorting (Newest, Price: Low to High, Price: High to Low, Highest Rated).
   - Search term query matching.
   - Active filter tags with one-click reset.

4. **Product Details (`/products/:slug`)**:
   - Interactive gallery image switcher.
   - Dynamic pricing with discount badges.
   - In-stock availability counter.
   - Increment / Decrement quantity selector.
   - Real customer verified reviews & rating breakdown.
   - "You Might Also Like" related product suggestions.

5. **Shopping Bag & Cart (`/cart`)**:
   - Supports both authenticated users and guest sessions via `X-Session-Id`.
   - Real-time quantity updates and removal.
   - Free shipping progress bar (`$100` threshold).
   - Tax and delivery calculations.

6. **Checkout Flow (`/checkout`)**:
   - Contact and delivery address inputs.
   - Multi-option payment selector (Credit / Debit Card, Cash on Delivery, PayPal).
   - Order review summary and place order action with atomic DB transactions.

7. **Order Confirmation (`/orders/:orderNumber`)**:
   - Full order receipt with status, items, amounts, and shipping address.

8. **My Orders (`/orders`)**:
   - Order tracking and past purchase history for logged-in users.

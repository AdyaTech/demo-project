# 🍕 Pizza Shop — Client UI (Simulation Mode)

A Next.js 14 customer-facing storefront running entirely with **mock API routes** — no separate backend, database, or auth service needed.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

---

## 🔑 Demo Accounts

| Email | Password | Notes |
|-------|----------|-------|
| customer@pizza.com | password123 | Pre-loaded with 2 past orders & 1 address |

Or click **Sign up** to create a new account.

---

## 🎟️ Coupon Codes

| Code | Discount |
|------|----------|
| PIZZA10 | 10% off |
| SAVE20 | 20% off |
| WELCOME15 | 15% off |

---

## 🗺️ App Flow

1. **Home** — Select a restaurant from the dropdown, browse menu by category
2. **Product Modal** — Choose size, crust, toppings → Add to cart
3. **Cart** — Review items, adjust quantities
4. **Checkout** — Login required, pick address, payment mode (Cash/Card)
5. **Order Status** — Track your order through the stepper
6. **Orders** — Full order history

---

## 📁 Key Mock Files

```
src/lib/mock/db.ts          ← In-memory database (users, products, orders, sessions)
src/app/api/
  auth/login/route.ts       ← POST /api/auth/login
  auth/register/route.ts    ← POST /api/auth/register
  auth/logout/route.ts      ← POST /api/auth/logout
  auth/self/route.ts        ← GET  /api/auth/self
  auth/tenants/route.ts     ← GET  /api/auth/tenants
  catalog/categories/       ← GET  /api/catalog/categories
  catalog/products/         ← GET  /api/catalog/products?tenantId=
  catalog/toppings/         ← GET  /api/catalog/toppings?tenantId=
  order/customer/           ← GET  /api/order/customer
  order/orders/             ← POST /api/order/orders
  order/orders/mine/        ← GET  /api/order/orders/mine
  order/orders/[orderId]/   ← GET  /api/order/orders/:id
  order/coupons/verify/     ← POST /api/order/coupons/verify
```

---

## 🔌 Connecting a Real Backend

1. Delete `src/lib/mock/db.ts` and `src/app/api/` folder
2. Restore original server actions in `src/lib/actions/`
3. Update `.env.local` with real backend URLs

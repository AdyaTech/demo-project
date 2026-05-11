# 🍕 Pizza Mock API Server

Shared backend that connects the **Client UI** and **Admin UI** so they work with the same live data.

## Start

```bash
npm install
npm run dev
# Runs on http://localhost:4000
```

## What it provides

| Service | Base path |
|---------|-----------|
| Auth (login, register, users, tenants) | `/api/auth/...` |
| Catalog (products, categories, toppings) | `/api/catalog/...` |
| Orders (place, list, change status) | `/api/order/...` |

## Demo accounts

| Email | Password | Role |
|-------|----------|------|
| admin@pizza.com | password123 | Admin (full access) |
| manager@pizza.com | password123 | Manager (Pizza Palace Bandra) |
| customer@pizza.com | password123 | Customer |

## Coupon codes

`PIZZA10` · `SAVE20` · `WELCOME15`

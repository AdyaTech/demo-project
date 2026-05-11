# 🍕 Pizza Shop — Full Stack (Simulation)

Three projects working together. Run them all to get a fully connected system.

---

## 🚀 Start Everything (3 terminals)

### Terminal 1 — Shared API Server (start this first!)
```bash
cd mock-api-server
npm install
npm run dev
# → http://localhost:4000
```

### Terminal 2 — Client UI (customer storefront)
```bash
cd client-ui
npm install
npm run dev
# → http://localhost:3000
```

### Terminal 3 — Admin UI (restaurant dashboard)
```bash
cd admin-ui
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔑 Accounts

| Email | Password | Role | Portal |
|-------|----------|------|--------|
| customer@pizza.com | password123 | Customer | Client UI |
| admin@pizza.com | password123 | Admin | Admin UI |
| manager@pizza.com | password123 | Manager | Admin UI |

---

## 🔄 Connected Flow

1. **Customer** opens http://localhost:3000 → selects restaurant → adds pizza to cart → places order
2. **Admin/Manager** opens http://localhost:5173 → sees the new order appear in Orders list
3. Admin changes order status (Confirmed → Prepared → Out for Delivery → Delivered)
4. Customer can track status on their order page

---

## 🎟️ Coupon Codes
`PIZZA10` (10% off) · `SAVE20` (20% off) · `WELCOME15` (15% off)

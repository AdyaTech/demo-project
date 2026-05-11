# 🍕 Pizza Shop Admin Dashboard — Simulation Mode

A fully functional admin dashboard running entirely with mock data — no backend, no DB, no socket server needed.

## 🚀 Quick Start

npm install
npm run dev

Then open http://localhost:5173

## 🔑 Login Credentials

| Role    | Email               | Password     |
|---------|---------------------|--------------|
| Admin   | admin@pizza.com     | password123  |
| Manager | manager@pizza.com   | password123  |

Admin sees Users & Restaurants menu items. Manager sees a restricted view.

## ✨ Features

- Login / Logout (simulated auth)
- Dashboard with live stats from mock orders
- Orders list + single order detail with status change
- Real-time order notifications every 45 seconds (fake socket)
- Users management - Admin only
- Restaurants management - Admin only
- Products with dynamic pricing & attributes per category
- Promos page (placeholder)

## 🔌 Connecting a Real Backend

1. Delete src/http/mockData.ts
2. Restore real Axios calls in src/http/api.ts
3. Restore real socket.io in src/lib/socket.ts
4. Update .env with real server URLs

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
}));

// ─── Helper middleware ───────────────────────────────────────────────
const requireAuth = (req, res, next) => {
    const token = db.extractToken(req);
    const user = db.getUserFromToken(token);
    if (!user) return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
    req.user = user;
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ errors: [{ msg: 'Forbidden' }] });
    next();
};

// ─── AUTH ────────────────────────────────────────────────────────────

// POST /api/auth/auth/login
app.post('/api/auth/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ errors: [{ msg: 'Invalid email or password' }] });

    const { accessToken, refreshToken } = db.createSession(user.id);
    db.setCookies(res, accessToken, refreshToken);
    res.json({ id: user.id, role: user.role, firstName: user.firstName });
});

// POST /api/auth/auth/register
app.post('/api/auth/auth/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
        return res.status(400).json({ errors: [{ msg: 'All fields required' }] });
    if (db.users.find((u) => u.email === email))
        return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });

    const newUser = {
        id: db.getUserIdCounter(), firstName, lastName, email, password,
        role: 'customer', tenant: null, addresses: [],
    };
    db.users.push(newUser);
    const { accessToken, refreshToken } = db.createSession(newUser.id);
    db.setCookies(res, accessToken, refreshToken);
    res.json({ id: newUser.id, role: newUser.role });
});

// POST /api/auth/auth/logout
app.post('/api/auth/auth/logout', (req, res) => {
    res.setHeader('Set-Cookie', [
        'accessToken=; Path=/; HttpOnly; Max-Age=0',
        'refreshToken=; Path=/; HttpOnly; Max-Age=0',
    ]);
    res.json({ success: true });
});

// GET /api/auth/auth/self
app.get('/api/auth/auth/self', requireAuth, (req, res) => {
    const u = req.user;
    res.json({ id: u.id, _id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role, tenant: u.tenant });
});

// POST /api/auth/auth/refresh
app.post('/api/auth/auth/refresh', (req, res) => {
    const cookieHeader = req.headers['cookie'] || '';
    const match = cookieHeader.match(/refreshToken=([^;]+)/);
    const token = match ? match[1] : null;
    const user = db.getUserFromToken(token);
    if (!user) return res.status(401).json({ success: false });
    const { accessToken, refreshToken } = db.createSession(user.id);
    db.setCookies(res, accessToken, refreshToken);
    res.json({ success: true });
});

// GET /api/auth/tenants
app.get('/api/auth/tenants', (req, res) => {
    res.json({ data: db.tenants, total: db.tenants.length });
});

// POST /api/auth/tenants
app.post('/api/auth/tenants', (req, res) => {
    const { name, address, city } = req.body;
    const newTenant = { id: String(db.tenants.length + 1), name, address, city };
    db.tenants.push(newTenant);
    res.json(newTenant);
});

// GET /api/auth/users
app.get('/api/auth/users', requireAuth, (req, res) => {
    const managers = db.users.filter((u) => u.role !== 'customer');
    res.json({ data: managers, total: managers.length });
});

// POST /api/auth/users
app.post('/api/auth/users', requireAuth, (req, res) => {
    const { firstName, lastName, email, password, role, tenantId } = req.body;
    const tenant = tenantId ? db.tenants.find((t) => t.id === tenantId) : null;
    const newUser = {
        id: db.getUserIdCounter(), firstName, lastName, email,
        password: password || 'password123', role: role || 'manager',
        tenant: tenant ? { id: tenant.id, name: tenant.name, address: tenant.address } : null,
        addresses: [],
    };
    db.users.push(newUser);
    res.json(newUser);
});

// PATCH /api/auth/users/:id
app.patch('/api/auth/users/:id', requireAuth, (req, res) => {
    const user = db.users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    Object.assign(user, req.body);
    res.json(user);
});

// ─── CATALOG ─────────────────────────────────────────────────────────

// GET /api/catalog/categories
app.get('/api/catalog/categories', (req, res) => res.json(db.categories));

// GET /api/catalog/categories/:id
app.get('/api/catalog/categories/:id', (req, res) => {
    const cat = db.categories.find((c) => c._id === req.params.id);
    if (!cat) return res.status(404).json({ errors: [{ msg: 'Not found' }] });
    res.json(cat);
});

// GET /api/catalog/products
app.get('/api/catalog/products', (req, res) => {
    const { tenantId } = req.query;
    const filtered = tenantId
        ? db.products.filter((p) => p.tenantId === tenantId && p.isPublish)
        : db.products.filter((p) => p.isPublish);
    res.json({ data: filtered, total: filtered.length });
});

// POST /api/catalog/products
app.post('/api/catalog/products', requireAuth, (req, res) => {
    const newProduct = {
        _id: `p${db.getProductIdCounter()}`,
        name: req.body.name || 'New Product',
        description: req.body.description || '',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
        category: db.categories[0],
        priceConfiguration: req.body.priceConfiguration || {},
        attributes: req.body.attributes || [],
        isPublish: req.body.isPublish === 'true' || false,
        tenantId: req.body.tenantId || '1',
        createdAt: new Date().toISOString(),
    };
    db.products.push(newProduct);
    res.json(newProduct);
});

// GET /api/catalog/toppings
app.get('/api/catalog/toppings', (req, res) => {
    const { tenantId } = req.query;
    const filtered = tenantId ? db.toppings.filter((t) => t.tenantId === tenantId) : db.toppings;
    res.json(filtered);
});

// ─── ORDERS ──────────────────────────────────────────────────────────

// GET /api/order/orders  (admin: all orders)
app.get('/api/order/orders', requireAuth, (req, res) => {
    const { tenantId } = req.query;
    let result = [...db.orders];
    if (tenantId) result = result.filter((o) => o.tenantId === tenantId);
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(result);
});

// POST /api/order/orders  (client: place order)
app.post('/api/order/orders', requireAuth, (req, res) => {
    const { cart, tenantId, address, paymentMode, comment, couponCode } = req.body;
    const user = req.user;

    const subtotal = (cart || []).reduce((acc, item) => {
        const configPrice = Object.entries(item.chosenConfiguration?.priceConfiguration || {}).reduce(
            (a, [key, val]) => a + (item.priceConfiguration?.[key]?.availableOptions?.[val] ?? 0), 0
        );
        return acc + configPrice * item.qty;
    }, 0);

    const taxes = Math.round(subtotal * 0.18);
    const deliveryCharges = 100;
    const discount = couponCode ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + taxes + deliveryCharges - discount;

    const newOrder = {
        _id: db.getOrderIdCounter(),
        customerId: { _id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
        cart, total, discount, taxes, deliveryCharges,
        address, tenantId, comment, paymentMode,
        orderStatus: 'received',
        paymentStatus: paymentMode === 'cash' ? 'pending' : 'paid',
        createdAt: new Date().toISOString(),
    };
    db.orders.push(newOrder);

    const paymentUrl = paymentMode === 'card'
        ? `/payment?success=true&orderId=${newOrder._id}&restaurantId=${tenantId}`
        : null;

    res.json({ ...newOrder, paymentUrl });
});

// GET /api/order/orders/mine  (client: my orders)
app.get('/api/order/orders/mine', requireAuth, (req, res) => {
    const mine = db.orders.filter((o) => o.customerId._id === req.user.id);
    res.json(mine);
});

// GET /api/order/orders/:id
app.get('/api/order/orders/:id', requireAuth, (req, res) => {
    const order = db.orders.find((o) => o._id === req.params.id);
    if (!order) return res.status(404).json({ errors: [{ msg: 'Order not found' }] });
    res.json(order);
});

// PATCH /api/order/orders/change-status/:id  (admin: update status)
app.patch('/api/order/orders/change-status/:id', requireAuth, (req, res) => {
    const order = db.orders.find((o) => o._id === req.params.id);
    if (!order) return res.status(404).json({ errors: [{ msg: 'Order not found' }] });
    order.orderStatus = req.body.status;
    res.json(order);
});

// ─── CUSTOMER (Order service) ─────────────────────────────────────────

// GET /api/order/customer
app.get('/api/order/customer', requireAuth, (req, res) => {
    const u = req.user;
    res.json({ _id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, addresses: u.addresses });
});

// PATCH /api/order/customer/addresses/:customerId
app.patch('/api/order/customer/addresses/:customerId', requireAuth, (req, res) => {
    const user = db.users.find((u) => u.id === req.params.customerId);
    if (!user) return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    user.addresses.push({ text: req.body.address, isDefault: false });
    res.json({ success: true });
});

// ─── COUPONS ─────────────────────────────────────────────────────────

// POST /api/order/coupons/verify
app.post('/api/order/coupons/verify', (req, res) => {
    const code = (req.body.code || '').toUpperCase();
    const discount = db.coupons[code];
    res.json(discount ? { valid: true, discount } : { valid: false, discount: 0 });
});

// ─── START ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🍕 Pizza Mock API running on http://localhost:${PORT}`);
    console.log(`   Auth routes:    /api/auth/...`);
    console.log(`   Catalog routes: /api/catalog/...`);
    console.log(`   Order routes:   /api/order/...`);
    console.log(`\n   Client UI → http://localhost:3000`);
    console.log(`   Admin UI  → http://localhost:5173\n`);
});

// ============================================================
// SHARED IN-MEMORY DATABASE
// Single source of truth for both Admin UI and Client UI
// ============================================================

// ---- Tenants ----
const tenants = [
    { id: '1', name: 'Pizza Palace Bandra', address: 'Bandra West, Mumbai', city: 'Mumbai' },
    { id: '2', name: 'Pizza Hub Andheri', address: 'Andheri East, Mumbai', city: 'Mumbai' },
    { id: '3', name: 'Slice Heaven Pune', address: 'Koregaon Park, Pune', city: 'Pune' },
];

// ---- Categories ----
const categories = [
    {
        _id: 'cat1',
        name: 'Pizza',
        priceConfiguration: {
            Size: { priceType: 'base', availableOptions: ['Small', 'Medium', 'Large'] },
            Crust: { priceType: 'aditional', availableOptions: ['Thin', 'Thick', 'Stuffed'] },
        },
        attributes: [
            { name: 'Is Veg', widgetType: 'switch', defaultValue: 'true', availableOptions: [] },
            { name: 'Spicy Level', widgetType: 'radio', defaultValue: 'Medium', availableOptions: ['Mild', 'Medium', 'Hot'] },
        ],
    },
    {
        _id: 'cat2',
        name: 'Pasta',
        priceConfiguration: {
            Portion: { priceType: 'base', availableOptions: ['Regular', 'Large'] },
        },
        attributes: [
            { name: 'Is Veg', widgetType: 'switch', defaultValue: 'false', availableOptions: [] },
        ],
    },
    {
        _id: 'cat3',
        name: 'Beverages',
        priceConfiguration: {
            Size: { priceType: 'base', availableOptions: ['250ml', '500ml', '1L'] },
        },
        attributes: [
            { name: 'Type', widgetType: 'radio', defaultValue: 'Cold', availableOptions: ['Cold', 'Hot'] },
        ],
    },
];

// ---- Toppings ----
const toppings = [
    { id: 't1', name: 'Extra Cheese', price: 40, image: '/cheese.png', tenantId: '1' },
    { id: 't2', name: 'Chicken', price: 60, image: '/chicken.png', tenantId: '1' },
    { id: 't3', name: 'Jalapeños', price: 25, image: '/jelapeno.png', tenantId: '1' },
    { id: 't4', name: 'Mushroom', price: 30, image: '/mushroom.png', tenantId: '1' },
    { id: 't5', name: 'Extra Cheese', price: 40, image: '/cheese.png', tenantId: '2' },
    { id: 't6', name: 'Jalapeños', price: 25, image: '/jelapeno.png', tenantId: '2' },
    { id: 't7', name: 'Mushroom', price: 30, image: '/mushroom.png', tenantId: '3' },
];

// ---- Products ----
const products = [
    {
        _id: 'p1', name: 'Margherita',
        description: 'Classic tomato base with fresh mozzarella and basil.',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300',
        category: { _id: 'cat1', name: 'Pizza', priceConfiguration: { Size: { priceType: 'base', availableOptions: ['Small','Medium','Large'] }, Crust: { priceType: 'aditional', availableOptions: ['Thin','Thick','Stuffed'] } }, attributes: [] },
        priceConfiguration: { Size: { priceType: 'base', availableOptions: { Small: 199, Medium: 299, Large: 399 } }, Crust: { priceType: 'aditional', availableOptions: { Thin: 0, Thick: 30, Stuffed: 60 } } },
        attributes: [{ name: 'Is Veg', value: true }, { name: 'Spicy Level', value: 'Mild' }],
        isPublish: true, tenantId: '1', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
        _id: 'p2', name: 'Pepperoni Blast',
        description: 'Loaded with spicy pepperoni slices and extra cheese.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300',
        category: { _id: 'cat1', name: 'Pizza', priceConfiguration: { Size: { priceType: 'base', availableOptions: ['Small','Medium','Large'] }, Crust: { priceType: 'aditional', availableOptions: ['Thin','Thick','Stuffed'] } }, attributes: [] },
        priceConfiguration: { Size: { priceType: 'base', availableOptions: { Small: 249, Medium: 349, Large: 449 } }, Crust: { priceType: 'aditional', availableOptions: { Thin: 0, Thick: 30, Stuffed: 60 } } },
        attributes: [{ name: 'Is Veg', value: false }, { name: 'Spicy Level', value: 'Hot' }],
        isPublish: true, tenantId: '1', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
        _id: 'p3', name: 'BBQ Chicken',
        description: 'Smoky BBQ sauce with grilled chicken and onions.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300',
        category: { _id: 'cat1', name: 'Pizza', priceConfiguration: { Size: { priceType: 'base', availableOptions: ['Small','Medium','Large'] }, Crust: { priceType: 'aditional', availableOptions: ['Thin','Thick','Stuffed'] } }, attributes: [] },
        priceConfiguration: { Size: { priceType: 'base', availableOptions: { Small: 269, Medium: 369, Large: 479 } }, Crust: { priceType: 'aditional', availableOptions: { Thin: 0, Thick: 30, Stuffed: 60 } } },
        attributes: [{ name: 'Is Veg', value: false }, { name: 'Spicy Level', value: 'Medium' }],
        isPublish: true, tenantId: '2', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
        _id: 'p4', name: 'Penne Arrabbiata',
        description: 'Spicy tomato pasta with garlic, chilli flakes and fresh herbs.',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300',
        category: { _id: 'cat2', name: 'Pasta', priceConfiguration: { Portion: { priceType: 'base', availableOptions: ['Regular','Large'] } }, attributes: [] },
        priceConfiguration: { Portion: { priceType: 'base', availableOptions: { Regular: 189, Large: 269 } } },
        attributes: [{ name: 'Is Veg', value: true }],
        isPublish: true, tenantId: '1', createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        _id: 'p5', name: 'Mango Lassi',
        description: 'Thick, creamy mango lassi made with fresh alphonso mangoes.',
        image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300',
        category: { _id: 'cat3', name: 'Beverages', priceConfiguration: { Size: { priceType: 'base', availableOptions: ['250ml','500ml','1L'] } }, attributes: [] },
        priceConfiguration: { Size: { priceType: 'base', availableOptions: { '250ml': 79, '500ml': 139, '1L': 249 } } },
        attributes: [{ name: 'Type', value: 'Cold' }],
        isPublish: true, tenantId: '1', createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
];
let productIdCounter = 10;

// ---- Users ----
const users = [
    { id: 'u1', firstName: 'Alice', lastName: 'Customer', email: 'customer@pizza.com', password: 'password123', role: 'customer', tenant: null, addresses: [{ text: 'Flat 4B, Sunshine Apartments, Bandra West, Mumbai - 400050', isDefault: true }] },
    { id: 'u2', firstName: 'Bob', lastName: 'Admin', email: 'admin@pizza.com', password: 'password123', role: 'admin', tenant: null, addresses: [] },
    { id: 'u3', firstName: 'Carol', lastName: 'Manager', email: 'manager@pizza.com', password: 'password123', role: 'manager', tenant: { id: '1', name: 'Pizza Palace Bandra', address: 'Bandra West, Mumbai' }, addresses: [] },
];
let userIdCounter = 10;

// ---- Orders ----
const orders = [
    {
        _id: 'ord001',
        customerId: { _id: 'u1', firstName: 'Alice', lastName: 'Customer', email: 'customer@pizza.com' },
        cart: [{ _id: 'p1', name: 'Margherita', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80', qty: 2, chosenConfiguration: { priceConfiguration: { Size: 'Large', Crust: 'Thin' }, selectedToppings: [{ name: 'Extra Cheese', price: 40 }] } }],
        total: 878, discount: 0, taxes: 138, deliveryCharges: 100,
        address: 'Flat 4B, Sunshine Apartments, Bandra West, Mumbai - 400050',
        tenantId: '1', paymentMode: 'cash', orderStatus: 'delivered', paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        _id: 'ord002',
        customerId: { _id: 'u1', firstName: 'Alice', lastName: 'Customer', email: 'customer@pizza.com' },
        cart: [{ _id: 'p2', name: 'Pepperoni Blast', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=80', qty: 1, chosenConfiguration: { priceConfiguration: { Size: 'Medium', Crust: 'Stuffed' }, selectedToppings: [] } }],
        total: 509, discount: 0, taxes: 69, deliveryCharges: 100,
        address: 'Flat 4B, Sunshine Apartments, Bandra West, Mumbai - 400050',
        tenantId: '1', paymentMode: 'card', orderStatus: 'confirmed', paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
];
let orderIdCounter = 10;

// ---- Coupons ----
const coupons = { PIZZA10: 10, SAVE20: 20, WELCOME15: 15 };

// ---- Token helpers (stateless: token = "mock-{userId}") ----
const createSession = (userId) => ({
    accessToken: `mock-${userId}`,
    refreshToken: `refresh-${userId}`,
});

const getUserFromToken = (token) => {
    if (!token) return null;
    let userId = null;
    if (token.startsWith('mock-')) userId = token.slice(5);
    else if (token.startsWith('refresh-')) userId = token.slice(8);
    return users.find((u) => u.id === userId) ?? null;
};

const extractToken = (req) => {
    const auth = req.headers['authorization'];
    if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
    const cookieHeader = req.headers['cookie'] || '';
    const match = cookieHeader.match(/accessToken=([^;]+)/);
    return match ? match[1] : null;
};

const setCookies = (res, accessToken, refreshToken) => {
    const expires = new Date(Date.now() + 86400000).toUTCString();
    res.setHeader('Set-Cookie', [
        `accessToken=${accessToken}; Path=/; HttpOnly; Expires=${expires}; SameSite=Lax`,
        `refreshToken=${refreshToken}; Path=/; HttpOnly; Expires=${expires}; SameSite=Lax`,
    ]);
};

module.exports = {
    tenants, categories, toppings, products, users, orders, coupons,
    createSession, getUserFromToken, extractToken, setCookies,
    getProductIdCounter: () => ++productIdCounter,
    getUserIdCounter: () => `u${++userIdCounter}`,
    getOrderIdCounter: () => `ord${(++orderIdCounter).toString().padStart(3, '0')}`,
};

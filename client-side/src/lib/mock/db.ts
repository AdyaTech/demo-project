// =============================================
// MOCK DATABASE — simulates all backend services
// =============================================

// ---- Tenants (Restaurants) ----
export const tenants = [
    { id: '1', name: 'Pizza Palace Bandra', address: 'Bandra West, Mumbai', city: 'Mumbai' },
    { id: '2', name: 'Pizza Hub Andheri', address: 'Andheri East, Mumbai', city: 'Mumbai' },
    { id: '3', name: 'Slice Heaven Pune', address: 'Koregaon Park, Pune', city: 'Pune' },
];

// ---- Categories ----
export const categories = [
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
export const toppings = [
    { id: 't1', name: 'Extra Cheese', price: 40, image: '/cheese.png', tenantId: '1' },
    { id: 't2', name: 'Chicken', price: 60, image: '/chicken.png', tenantId: '1' },
    { id: 't3', name: 'Jalapeños', price: 25, image: '/jelapeno.png', tenantId: '1' },
    { id: 't4', name: 'Mushroom', price: 30, image: '/mushroom.png', tenantId: '1' },
    { id: 't5', name: 'Extra Cheese', price: 40, image: '/cheese.png', tenantId: '2' },
    { id: 't6', name: 'Jalapeños', price: 25, image: '/jelapeno.png', tenantId: '2' },
    { id: 't7', name: 'Mushroom', price: 30, image: '/mushroom.png', tenantId: '3' },
];

// ---- Products ----
export const products = [
    {
        _id: 'p1',
        name: 'Margherita',
        description: 'Classic tomato base with fresh mozzarella and basil.',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300',
        category: { _id: 'cat1', name: 'Pizza', priceConfiguration: { Size: { priceType: 'base', availableOptions: ['Small', 'Medium', 'Large'] }, Crust: { priceType: 'aditional', availableOptions: ['Thin', 'Thick', 'Stuffed'] } }, attributes: [] },
        priceConfiguration: {
            Size: { priceType: 'base', availableOptions: { Small: 199, Medium: 299, Large: 399 } },
            Crust: { priceType: 'aditional', availableOptions: { Thin: 0, Thick: 30, Stuffed: 60 } },
        },
        attributes: [{ name: 'Is Veg', value: true }, { name: 'Spicy Level', value: 'Mild' }],
        isPublish: true,
        tenantId: '1',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
        _id: 'p2',
        name: 'Pepperoni Blast',
        description: 'Loaded with spicy pepperoni slices and extra cheese.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300',
        category: { _id: 'cat1', name: 'Pizza', priceConfiguration: { Size: { priceType: 'base', availableOptions: ['Small', 'Medium', 'Large'] }, Crust: { priceType: 'aditional', availableOptions: ['Thin', 'Thick', 'Stuffed'] } }, attributes: [] },
        priceConfiguration: {
            Size: { priceType: 'base', availableOptions: { Small: 249, Medium: 349, Large: 449 } },
            Crust: { priceType: 'aditional', availableOptions: { Thin: 0, Thick: 30, Stuffed: 60 } },
        },
        attributes: [{ name: 'Is Veg', value: false }, { name: 'Spicy Level', value: 'Hot' }],
        isPublish: true,
        tenantId: '1',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
        _id: 'p3',
        name: 'BBQ Chicken',
        description: 'Smoky BBQ sauce with grilled chicken and onions.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300',
        category: { _id: 'cat1', name: 'Pizza', priceConfiguration: { Size: { priceType: 'base', availableOptions: ['Small', 'Medium', 'Large'] }, Crust: { priceType: 'aditional', availableOptions: ['Thin', 'Thick', 'Stuffed'] } }, attributes: [] },
        priceConfiguration: {
            Size: { priceType: 'base', availableOptions: { Small: 269, Medium: 369, Large: 479 } },
            Crust: { priceType: 'aditional', availableOptions: { Thin: 0, Thick: 30, Stuffed: 60 } },
        },
        attributes: [{ name: 'Is Veg', value: false }, { name: 'Spicy Level', value: 'Medium' }],
        isPublish: true,
        tenantId: '2',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
        _id: 'p4',
        name: 'Penne Arrabbiata',
        description: 'Spicy tomato pasta with garlic, chilli flakes and fresh herbs.',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300',
        category: { _id: 'cat2', name: 'Pasta', priceConfiguration: { Portion: { priceType: 'base', availableOptions: ['Regular', 'Large'] } }, attributes: [] },
        priceConfiguration: {
            Portion: { priceType: 'base', availableOptions: { Regular: 189, Large: 269 } },
        },
        attributes: [{ name: 'Is Veg', value: true }],
        isPublish: true,
        tenantId: '1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        _id: 'p5',
        name: 'Mango Lassi',
        description: 'Thick, creamy mango lassi made with fresh alphonso mangoes.',
        image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300',
        category: { _id: 'cat3', name: 'Beverages', priceConfiguration: { Size: { priceType: 'base', availableOptions: ['250ml', '500ml', '1L'] } }, attributes: [] },
        priceConfiguration: {
            Size: { priceType: 'base', availableOptions: { '250ml': 79, '500ml': 139, '1L': 249 } },
        },
        attributes: [{ name: 'Type', value: 'Cold' }],
        isPublish: true,
        tenantId: '1',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
];

// ---- Users ----
export interface MockUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'admin' | 'customer' | 'manager';
    tenant: number | null;
    addresses: { text: string; isDefault: boolean }[];
}

export const users: MockUser[] = [
    {
        id: 'u1',
        firstName: 'Alice',
        lastName: 'Customer',
        email: 'customer@pizza.com',
        password: 'password123',
        role: 'customer',
        tenant: null,
        addresses: [
            { text: 'Flat 4B, Sunshine Apartments, Bandra West, Mumbai - 400050', isDefault: true },
        ],
    },
    {
        id: 'u2',
        firstName: 'Bob',
        lastName: 'Admin',
        email: 'admin@pizza.com',
        password: 'password123',
        role: 'admin',
        tenant: null,
        addresses: [],
    },
];

export const registerUser = (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) => {
    const existing = users.find((u) => u.email === data.email);
    if (existing) return null;
    const newUser: MockUser = {
        id: `u${users.length + 1}`,
        ...data,
        role: 'customer',
        tenant: null,
        addresses: [],
    };
    users.push(newUser);
    return newUser;
};

// ---- Session: token is simply "mock-userId" stored in the cookie ----
// No in-memory Map needed — userId is encoded directly in the token string.
export const createSession = (userId: string) => {
    // Token is just "mock-{userId}" — stateless, no Map required
    const accessToken = `mock-${userId}`;
    const refreshToken = `refresh-${userId}`;
    return { accessToken, refreshToken };
};

export const getUserIdFromToken = (token: string | undefined): string | null => {
    if (!token) return null;
    if (token.startsWith('mock-')) return token.slice(5);
    if (token.startsWith('refresh-')) return token.slice(8);
    return null;
};

export const getUserFromToken = (token: string | undefined): MockUser | null => {
    const userId = getUserIdFromToken(token);
    if (!userId) return null;
    return users.find((u) => u.id === userId) ?? null;
};

// ---- Orders ----
export interface MockOrder {
    _id: string;
    customerId: { _id: string; firstName: string; lastName: string; email: string };
    cart: unknown[];
    total: number;
    discount: number;
    taxes: number;
    deliveryCharges: number;
    address: string;
    tenantId: string;
    comment?: string;
    paymentMode: string;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
}

export const orders: MockOrder[] = [
    {
        _id: 'ord001',
        customerId: { _id: 'u1', firstName: 'Alice', lastName: 'Customer', email: 'customer@pizza.com' },
        cart: [],
        total: 728,
        discount: 0,
        taxes: 128,
        deliveryCharges: 100,
        address: 'Flat 4B, Sunshine Apartments, Bandra West, Mumbai - 400050',
        tenantId: '1',
        paymentMode: 'cash',
        orderStatus: 'delivered',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        _id: 'ord002',
        customerId: { _id: 'u1', firstName: 'Alice', lastName: 'Customer', email: 'customer@pizza.com' },
        cart: [],
        total: 509,
        discount: 0,
        taxes: 79,
        deliveryCharges: 100,
        address: 'Flat 4B, Sunshine Apartments, Bandra West, Mumbai - 400050',
        tenantId: '1',
        paymentMode: 'card',
        orderStatus: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
];
let orderCounter = 10;

export const addOrder = (order: Omit<MockOrder, '_id' | 'createdAt'>) => {
    const newOrder: MockOrder = {
        ...order,
        _id: `ord${(++orderCounter).toString().padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    return newOrder;
};

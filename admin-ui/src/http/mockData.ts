// =============================================
// MOCK DATA - simulates backend responses
// =============================================

import { Category, Order, OrderStatus, PaymentMode, PaymentStatus, Product, User } from '../types';

// Simulated delay to mimic network
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ---- Auth ----
const MOCK_USERS: User[] = [
    {
        _id: 'u1',
        firstName: 'Alice',
        lastName: 'Admin',
        email: 'admin@pizza.com',
        role: 'admin',
    },
    {
        _id: 'u2',
        firstName: 'Bob',
        lastName: 'Manager',
        email: 'manager@pizza.com',
        role: 'manager',
        tenant: { id: 't1', name: 'Pizza Palace Bandra', address: 'Bandra, Mumbai' },
    },
    {
        _id: 'u3',
        firstName: 'Carol',
        lastName: 'Ops',
        email: 'carol@pizza.com',
        role: 'manager',
        tenant: { id: 't2', name: 'Pizza Hub Andheri', address: 'Andheri, Mumbai' },
    },
];

// In-memory session
let currentUser: User | null = null;

export const mockLogin = async (credentials: { email: string; password: string }) => {
    await delay();
    const user = MOCK_USERS.find((u) => u.email === credentials.email);
    if (!user || credentials.password !== 'password123') {
        const err = new Error('Invalid email or password') as Error & { response?: { status: number } };
        err.response = { status: 401 };
        throw err;
    }
    currentUser = user;
    return { data: user };
};

export const mockSelf = async () => {
    await delay(200);
    if (!currentUser) {
        const err = new Error('Unauthorized') as Error & { response?: { status: number } };
        err.response = { status: 401 };
        throw err;
    }
    return { data: currentUser };
};

export const mockLogout = async () => {
    await delay(200);
    currentUser = null;
    return { data: {} };
};

// ---- Users ----
let usersDb: User[] = [...MOCK_USERS];
let userIdCounter = 100;

export const mockGetUsers = async (_queryString: string) => {
    await delay();
    const managers = usersDb.filter((u) => u.role !== 'customer');
    return { data: { data: managers, total: managers.length } };
};

export const mockCreateUser = async (user: Omit<User, '_id'>) => {
    await delay();
    const newUser: User = { ...user, _id: `u${++userIdCounter}` } as User;
    usersDb.push(newUser);
    return { data: newUser };
};

export const mockUpdateUser = async (user: Partial<User>, id: string) => {
    await delay();
    usersDb = usersDb.map((u) => (u._id === id ? { ...u, ...user } : u));
    return { data: usersDb.find((u) => u._id === id) };
};

// ---- Tenants ----
const tenantsDb = [
    { _id: 't1', name: 'Pizza Palace Bandra', address: 'Bandra, Mumbai', city: 'Mumbai' },
    { _id: 't2', name: 'Pizza Hub Andheri', address: 'Andheri, Mumbai', city: 'Mumbai' },
    { _id: 't3', name: 'Slice Heaven Pune', address: 'Koregaon Park, Pune', city: 'Pune' },
];
let tenantIdCounter = 10;

export const mockGetTenants = async (_queryString: string) => {
    await delay();
    return { data: { data: tenantsDb, total: tenantsDb.length } };
};

export const mockCreateTenant = async (tenant: { name: string; address: string; city: string }) => {
    await delay();
    const newTenant = { _id: `t${++tenantIdCounter}`, ...tenant };
    tenantsDb.push(newTenant);
    return { data: newTenant };
};

// ---- Categories ----
const MOCK_CATEGORIES: Category[] = [
    {
        _id: 'cat1',
        name: 'Pizza',
        priceConfiguration: {
            Size: { priceType: 'base', availableOptions: ['Small', 'Medium', 'Large'] },
            Crust: { priceType: 'additional', availableOptions: ['Thin', 'Thick', 'Stuffed'] },
        },
        attributes: [
            {
                name: 'Is Veg',
                widgetType: 'switch',
                defaultValue: true,
                availableOptions: [],
            },
            {
                name: 'Spicy Level',
                widgetType: 'radio',
                defaultValue: 'Medium',
                availableOptions: ['Mild', 'Medium', 'Hot'],
            },
        ],
    },
    {
        _id: 'cat2',
        name: 'Pasta',
        priceConfiguration: {
            Portion: { priceType: 'base', availableOptions: ['Regular', 'Large'] },
        },
        attributes: [
            {
                name: 'Is Veg',
                widgetType: 'switch',
                defaultValue: false,
                availableOptions: [],
            },
        ],
    },
    {
        _id: 'cat3',
        name: 'Beverages',
        priceConfiguration: {
            Size: { priceType: 'base', availableOptions: ['250ml', '500ml', '1L'] },
        },
        attributes: [
            {
                name: 'Type',
                widgetType: 'radio',
                defaultValue: 'Cold',
                availableOptions: ['Cold', 'Hot'],
            },
        ],
    },
];

export const mockGetCategories = async () => {
    await delay();
    return { data: MOCK_CATEGORIES };
};

export const mockGetCategory = async (id: string) => {
    await delay(200);
    const cat = MOCK_CATEGORIES.find((c) => c._id === id);
    if (!cat) throw new Error('Category not found');
    return { data: cat };
};

// ---- Products ----
let productsDb: Product[] = [
    {
        _id: 'p1',
        name: 'Margherita Pizza',
        description: 'Classic tomato, mozzarella, and fresh basil.',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200',
        category: MOCK_CATEGORIES[0],
        tenantId: 't1',
        priceConfiguration: { Size: { Small: 199, Medium: 299, Large: 399 }, Crust: { Thin: 0, Thick: 30, Stuffed: 60 } },
        attributes: { 'Is Veg': true, 'Spicy Level': 'Mild' },
        isPublish: true,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
        _id: 'p2',
        name: 'Pepperoni Pizza',
        description: 'Loaded with spicy pepperoni and cheese.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200',
        category: MOCK_CATEGORIES[0],
        tenantId: 't1',
        priceConfiguration: { Size: { Small: 249, Medium: 349, Large: 449 }, Crust: { Thin: 0, Thick: 30, Stuffed: 60 } },
        attributes: { 'Is Veg': false, 'Spicy Level': 'Hot' },
        isPublish: true,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
        _id: 'p3',
        name: 'Penne Arrabbiata',
        description: 'Spicy tomato pasta with garlic and herbs.',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200',
        category: MOCK_CATEGORIES[1],
        tenantId: 't2',
        priceConfiguration: { Portion: { Regular: 189, Large: 269 } },
        attributes: { 'Is Veg': true },
        isPublish: false,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
];
let productIdCounter = 10;

export const mockGetProducts = async (_queryParam: string) => {
    await delay();
    return { data: { data: productsDb, total: productsDb.length } };
};

export const mockCreateProduct = async (formData: FormData) => {
    await delay(600);
    const newProduct: Product = {
        _id: `p${++productIdCounter}`,
        name: (formData.get('name') as string) ?? 'New Product',
        description: (formData.get('description') as string) ?? '',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
        category: MOCK_CATEGORIES[0],
        tenantId: 't1',
        priceConfiguration: {},
        attributes: {},
        isPublish: false,
        createdAt: new Date().toISOString(),
    };
    productsDb.push(newProduct);
    return { data: newProduct };
};

export const mockUpdateProduct = async (formData: FormData, id: string) => {
    await delay(600);
    productsDb = productsDb.map((p) =>
        p._id === id ? { ...p, name: (formData.get('name') as string) ?? p.name } : p
    );
    return { data: productsDb.find((p) => p._id === id) };
};

// ---- Orders ----
let ordersDb: Order[] = [
    {
        _id: 'ord001',
        cart: [
            {
                _id: 'p1',
                name: 'Margherita Pizza',
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80',
                qty: 2,
                chosenConfiguration: {
                    priceConfiguration: { Size: 'Large', Crust: 'Thin' },
                    selectedToppings: [{ name: 'Extra Cheese', price: 40 }],
                },
            },
        ],
        customerId: { _id: 'cust1', firstName: 'Raj', lastName: 'Sharma', email: 'raj@test.com' },
        address: 'Bandra West, Mumbai - 400050',
        comment: 'Please ring bell twice',
        paymentMode: PaymentMode.CASH,
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: OrderStatus.RECEIVED,
        total: 838,
        tenantId: 't1',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        _id: 'ord002',
        cart: [
            {
                _id: 'p2',
                name: 'Pepperoni Pizza',
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=80',
                qty: 1,
                chosenConfiguration: {
                    priceConfiguration: { Size: 'Medium', Crust: 'Stuffed' },
                    selectedToppings: [],
                },
            },
        ],
        customerId: { _id: 'cust2', firstName: 'Priya', lastName: 'Patel', email: 'priya@test.com' },
        address: 'Koregaon Park, Pune - 411001',
        paymentMode: PaymentMode.CARD,
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.CONFIRMED,
        total: 409,
        tenantId: 't1',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
        _id: 'ord003',
        cart: [
            {
                _id: 'p1',
                name: 'Margherita Pizza',
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80',
                qty: 3,
                chosenConfiguration: {
                    priceConfiguration: { Size: 'Small', Crust: 'Thick' },
                    selectedToppings: [{ name: 'Olives', price: 20 }, { name: 'Jalapeños', price: 25 }],
                },
            },
        ],
        customerId: { _id: 'cust3', firstName: 'Aditya', lastName: 'Verma', email: 'aditya@test.com' },
        address: 'Andheri East, Mumbai - 400069',
        paymentMode: PaymentMode.CASH,
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: OrderStatus.PREPARED,
        total: 687,
        tenantId: 't1',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
    {
        _id: 'ord004',
        cart: [
            {
                _id: 'p2',
                name: 'Pepperoni Pizza',
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=80',
                qty: 2,
                chosenConfiguration: {
                    priceConfiguration: { Size: 'Large', Crust: 'Thin' },
                    selectedToppings: [],
                },
            },
        ],
        customerId: { _id: 'cust4', firstName: 'Sneha', lastName: 'Gupta', email: 'sneha@test.com' },
        address: 'Viman Nagar, Pune - 411014',
        comment: 'No onions please',
        paymentMode: PaymentMode.CARD,
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.OUT_FOR_DELIVERY,
        total: 898,
        tenantId: 't1',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
    {
        _id: 'ord005',
        cart: [
            {
                _id: 'p3',
                name: 'Penne Arrabbiata',
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=80',
                qty: 1,
                chosenConfiguration: {
                    priceConfiguration: { Portion: 'Large' },
                    selectedToppings: [],
                },
            },
        ],
        customerId: { _id: 'cust5', firstName: 'Mohit', lastName: 'Khan', email: 'mohit@test.com' },
        address: 'Dadar, Mumbai - 400014',
        paymentMode: PaymentMode.CASH,
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.DELIVERED,
        total: 269,
        tenantId: 't1',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
];
let orderIdCounter = 10;

export const mockGetOrders = async (_queryString: string) => {
    await delay();
    return { data: [...ordersDb].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
};

export const mockGetSingleOrder = async (orderId: string, _queryString: string) => {
    await delay();
    const order = ordersDb.find((o) => o._id === orderId);
    if (!order) throw new Error('Order not found');
    return { data: order };
};

export const mockChangeStatus = async (orderId: string, data: { status: OrderStatus }) => {
    await delay();
    ordersDb = ordersDb.map((o) =>
        o._id === orderId ? { ...o, orderStatus: data.status } : o
    );
    return { data: ordersDb.find((o) => o._id === orderId) };
};

// Helper to add a new mock order (used by fake socket)
export const addMockOrder = () => {
    const newOrder: Order = {
        _id: `ord${(++orderIdCounter).toString().padStart(3, '0')}`,
        cart: [
            {
                _id: 'p1',
                name: 'Margherita Pizza',
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80',
                qty: Math.ceil(Math.random() * 3),
                chosenConfiguration: {
                    priceConfiguration: { Size: 'Medium', Crust: 'Thin' },
                    selectedToppings: [],
                },
            },
        ],
        customerId: { _id: `cust${orderIdCounter}`, firstName: 'New', lastName: 'Customer', email: `cust${orderIdCounter}@test.com` },
        address: 'Live Order, Mumbai',
        paymentMode: PaymentMode.CASH,
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: OrderStatus.RECEIVED,
        total: 299 + Math.floor(Math.random() * 200),
        tenantId: 't1',
        createdAt: new Date().toISOString(),
    };
    ordersDb.unshift(newOrder);
    return newOrder;
};

export interface Credentials {
    email: string;
    password: string;
}

export interface Tenant {
    id: string;
    name: string;
    address: string;
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'manager' | 'customer';
    tenant?: Tenant;
}

export interface CreateUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    tenantId?: string;
}

export interface CreateTenantData {
    name: string;
    address: string;
    city: string;
}

export interface Category {
    _id: string;
    name: string;
    priceConfiguration: Record<string, PriceConfigOption>;
    attributes: Attribute[];
}

export interface PriceConfigOption {
    priceType: 'base' | 'additional';
    availableOptions: string[];
}

export interface Attribute {
    name: string;
    widgetType: 'radio' | 'switch';
    defaultValue: string | boolean;
    availableOptions: string[];
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    image: string;
    category: Category;
    tenantId: string;
    priceConfiguration: Record<string, Record<string, number>>;
    attributes: Record<string, string | boolean>;
    isPublish: boolean;
    createdAt: string;
}

export enum OrderStatus {
    RECEIVED = 'received',
    CONFIRMED = 'confirmed',
    PREPARED = 'prepared',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
}

export enum PaymentMode {
    CASH = 'cash',
    CARD = 'card',
}

export enum PaymentStatus {
    PAID = 'paid',
    PENDING = 'pending',
}

export enum OrderEvents {
    ORDER_CREATE = 'ORDER_CREATE',
    PAYMENT_STATUS_UPDATE = 'PAYMENT_STATUS_UPDATE',
}

export interface CartItem {
    _id: string;
    name: string;
    image: string;
    qty: number;
    chosenConfiguration: {
        priceConfiguration: Record<string, string>;
        selectedToppings: { name: string; price: number }[];
    };
}

export interface Order {
    _id: string;
    cart: CartItem[];
    customerId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    address: string;
    comment?: string;
    paymentMode: PaymentMode;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    total: number;
    tenantId: string;
    createdAt: string;
}

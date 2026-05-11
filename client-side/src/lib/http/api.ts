import axios from 'axios';
import { CouponCodeData, OrderData } from '../types';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

export const getCustomer = () => api.get('/api/order/customer');
export const addAddress = (customerId: string, address: string) =>
    api.patch(`/api/order/customer/addresses/${customerId}`, { address });
export const verifyCoupon = (data: CouponCodeData) => api.post('/api/order/coupons/verify', data);
export const createOrder = (data: OrderData, idempotencyKey: string) =>
    api.post('/api/order/orders', data, { headers: { 'Idempotency-Key': idempotencyKey } });
export const getSingleOrder = (orderId: string) =>
    api.get(`/api/order/orders/${orderId}?fields=orderStatus`);

import { getOrders as apiGetOrders } from '../http/api';

export const getOrders = () => apiGetOrders('').then((res) => res.data as { cart: {name:string}[], address: string, total: number, orderStatus: string }[]);

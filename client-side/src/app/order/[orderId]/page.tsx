import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import OrderStatus from './components/orderStatus';
import { Separator } from '@/components/ui/separator';
import { Banknote, Coins, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { Order } from '@/lib/types';
import { redirect } from 'next/navigation';

const SingleOrder = async ({ params }: { params: { orderId: string } }) => {
    const token = cookies().get('accessToken')?.value;
    if (!token) redirect('/login');

    const response = await fetch(
        `${process.env.BACKEND_URL}/api/order/orders/${params.orderId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        return (
            <div className="container mt-6">
                <p className="text-red-500">Order not found.</p>
            </div>
        );
    }

    const order: Order = await response.json();

    return (
        <div className="container mt-6 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Order #{order._id}</CardTitle>
                    <CardDescription>Track the order status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrderStatus orderId={order._id} />
                </CardContent>
            </Card>

            <div className="flex gap-6">
                <Card className="w-1/3">
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg">Delivery Address</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                        <h2 className="font-bold">
                            {order.customerId.firstName + ' ' + order.customerId.lastName}
                        </h2>
                        <p className="mt-2">{order.address}</p>
                    </CardContent>
                </Card>

                <Card className="w-2/3">
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg">Your order information</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <LayoutDashboard size={20} />
                            <h2 className="text-base font-medium">Order reference:</h2>
                            <span>{order._id}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Banknote />
                            <h2 className="text-base font-medium">Payment status:</h2>
                            <span>{order.paymentStatus.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Coins size={20} />
                            <h2 className="text-base font-medium">Payment method:</h2>
                            <span>{order.paymentMode.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <LayoutDashboard size={20} />
                            <h2 className="text-base font-medium">Total:</h2>
                            <span>₹{order.total}</span>
                        </div>
                        <Button variant={'destructive'} className="mt-6" disabled>
                            Cancel Order
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SingleOrder;

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Order } from '@/lib/types';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const Orders = async () => {
    const token = cookies().get('accessToken')?.value;
    if (!token) redirect('/login?return-to=/orders');

    const response = await fetch(`${process.env.BACKEND_URL}/api/order/orders/mine`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });

    const orders: Order[] = response.ok ? await response.json() : [];

    return (
        <div className="container mt-8">
            <Card>
                <CardHeader className="px-7">
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>My complete order history.</CardDescription>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <p className="text-gray-500">No orders yet. <Link href="/" className="text-primary underline">Start shopping!</Link></p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Payment Status</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Order Status</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="text-right">Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order: Order) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-medium">{order._id}</TableCell>
                                        <TableCell>{order.paymentStatus.toUpperCase()}</TableCell>
                                        <TableCell>{order.paymentMode}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString('en-IN')}</TableCell>
                                        <TableCell>
                                            <Badge variant={'outline'}>{order.orderStatus.toUpperCase()}</Badge>
                                        </TableCell>
                                        <TableCell>₹{order.total}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/order/${order._id}`} className="underline text-primary">
                                                More details
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Orders;

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, orders } from '@/lib/mock/db';

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
    const token = req.cookies.get('accessToken')?.value
        ?? req.headers.get('authorization')?.replace('Bearer ', '');
    const user = getUserFromToken(token);
    if (!user) return NextResponse.json({ errors: [{ msg: 'Unauthorized' }] }, { status: 401 });
    const order = orders.find((o) => o._id === params.orderId);
    if (!order) return NextResponse.json({ errors: [{ msg: 'Order not found' }] }, { status: 404 });
    return NextResponse.json(order);
}

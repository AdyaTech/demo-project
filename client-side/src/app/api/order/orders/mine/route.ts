import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, orders } from '@/lib/mock/db';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value
        ?? req.headers.get('authorization')?.replace('Bearer ', '');
    const user = getUserFromToken(token);
    if (!user) return NextResponse.json({ errors: [{ msg: 'Unauthorized' }] }, { status: 401 });
    return NextResponse.json(orders.filter((o) => o.customerId._id === user.id));
}

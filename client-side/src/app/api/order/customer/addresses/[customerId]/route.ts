import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, users } from '@/lib/mock/db';

export async function PATCH(req: NextRequest, { params }: { params: { customerId: string } }) {
    const token = req.cookies.get('accessToken')?.value
        ?? req.headers.get('authorization')?.replace('Bearer ', '');
    const user = getUserFromToken(token);
    if (!user) return NextResponse.json({ errors: [{ msg: 'Unauthorized' }] }, { status: 401 });
    const { address } = await req.json();
    const dbUser = users.find((u) => u.id === params.customerId);
    if (dbUser) dbUser.addresses.push({ text: address, isDefault: false });
    return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/mock/db';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value
        ?? req.headers.get('authorization')?.replace('Bearer ', '');
    const user = getUserFromToken(token);
    if (!user) return NextResponse.json({ errors: [{ msg: 'Unauthorized' }] }, { status: 401 });
    return NextResponse.json({
        _id: user.id, firstName: user.firstName, lastName: user.lastName,
        email: user.email, addresses: user.addresses,
    });
}

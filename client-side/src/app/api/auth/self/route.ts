import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/mock/db';

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
        ?? req.cookies.get('accessToken')?.value;
    const user = getUserFromToken(token);
    if (!user) return NextResponse.json({ errors: [{ msg: 'Unauthorized' }] }, { status: 401 });
    return NextResponse.json({
        id: user.id, firstName: user.firstName, lastName: user.lastName,
        email: user.email, role: user.role, tenant: user.tenant,
    });
}

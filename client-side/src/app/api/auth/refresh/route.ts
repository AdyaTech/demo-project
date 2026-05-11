import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, createSession } from '@/lib/mock/db';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('refreshToken')?.value;
    const user = getUserFromToken(token);
    if (!user) return NextResponse.json({ success: false }, { status: 401 });
    const { accessToken, refreshToken } = createSession(user.id);
    const res = NextResponse.json({ success: true });
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    res.cookies.set('accessToken', accessToken, { httpOnly: true, expires, path: '/' });
    res.cookies.set('refreshToken', refreshToken, { httpOnly: true, expires, path: '/' });
    return res;
}

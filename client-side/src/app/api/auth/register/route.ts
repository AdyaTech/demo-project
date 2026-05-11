import { NextRequest, NextResponse } from 'next/server';
import { registerUser, createSession } from '@/lib/mock/db';

export async function POST(req: NextRequest) {
    const { firstName, lastName, email, password } = await req.json();
    if (!firstName || !lastName || !email || !password) {
        return NextResponse.json({ errors: [{ msg: 'All fields are required' }] }, { status: 400 });
    }
    const user = registerUser({ firstName, lastName, email, password });
    if (!user) {
        return NextResponse.json({ errors: [{ msg: 'Email already in use' }] }, { status: 400 });
    }
    const { accessToken, refreshToken } = createSession(user.id);
    const res = NextResponse.json({ id: user.id, role: user.role });
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    res.cookies.set('accessToken', accessToken, { httpOnly: true, expires, path: '/' });
    res.cookies.set('refreshToken', refreshToken, { httpOnly: true, expires, path: '/' });
    return res;
}

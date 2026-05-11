import { NextRequest, NextResponse } from 'next/server';
import { users, createSession } from '@/lib/mock/db';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
        return NextResponse.json({ errors: [{ msg: 'Invalid email or password' }] }, { status: 401 });
    }
    const { accessToken, refreshToken } = createSession(user.id);
    const res = NextResponse.json({ id: user.id, role: user.role });
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    res.cookies.set('accessToken', accessToken, { httpOnly: true, expires, path: '/' });
    res.cookies.set('refreshToken', refreshToken, { httpOnly: true, expires, path: '/' });
    return res;
}

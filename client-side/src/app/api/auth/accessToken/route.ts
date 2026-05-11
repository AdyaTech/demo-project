import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value;
    return NextResponse.json({ token: token ?? null });
}

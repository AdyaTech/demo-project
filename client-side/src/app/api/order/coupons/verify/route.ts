import { NextRequest, NextResponse } from 'next/server';

// Mock coupons
const COUPONS: Record<string, number> = {
    PIZZA10: 10,
    SAVE20: 20,
    WELCOME15: 15,
};

export async function POST(req: NextRequest) {
    const { code } = await req.json();
    const discount = COUPONS[code?.toUpperCase()];

    if (discount) {
        return NextResponse.json({ valid: true, discount });
    }

    return NextResponse.json({ valid: false, discount: 0 });
}

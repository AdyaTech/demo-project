import { NextRequest, NextResponse } from 'next/server';
import { toppings } from '@/lib/mock/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    const filtered = tenantId ? toppings.filter((t) => t.tenantId === tenantId) : toppings;
    return NextResponse.json(filtered);
}

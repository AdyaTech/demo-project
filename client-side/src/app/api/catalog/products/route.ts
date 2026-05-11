import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/mock/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    const filtered = tenantId
        ? products.filter((p) => p.tenantId === tenantId && p.isPublish)
        : products.filter((p) => p.isPublish);

    return NextResponse.json({ data: filtered, total: filtered.length });
}

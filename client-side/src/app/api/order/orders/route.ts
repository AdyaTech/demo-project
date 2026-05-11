import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, addOrder } from '@/lib/mock/db';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value
        ?? req.headers.get('authorization')?.replace('Bearer ', '');
    const user = getUserFromToken(token);
    if (!user) return NextResponse.json({ errors: [{ msg: 'Unauthorized' }] }, { status: 401 });

    const body = await req.json();
    const { cart, tenantId, address, paymentMode, comment, couponCode } = body;

    const subtotal = (cart as {
        qty: number;
        priceConfiguration: Record<string, { availableOptions: Record<string, number> }>;
        chosenConfiguration: { priceConfiguration: Record<string, string> };
    }[]).reduce((acc, item) => {
        const configPrice = Object.entries(item.chosenConfiguration.priceConfiguration).reduce(
            (a, [key, val]) => a + (item.priceConfiguration[key]?.availableOptions[val] ?? 0), 0
        );
        return acc + configPrice * item.qty;
    }, 0);

    const taxes = Math.round(subtotal * 0.18);
    const deliveryCharges = 100;
    const discount = couponCode ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + taxes + deliveryCharges - discount;

    const newOrder = addOrder({
        customerId: { _id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
        cart, total, discount, taxes, deliveryCharges, address, tenantId, comment, paymentMode,
        orderStatus: 'received',
        paymentStatus: paymentMode === 'cash' ? 'pending' : 'paid',
    });

    const paymentUrl = paymentMode === 'card'
        ? `/payment?success=true&orderId=${newOrder._id}&restaurantId=${tenantId}`
        : null;

    return NextResponse.json({ ...newOrder, paymentUrl });
}

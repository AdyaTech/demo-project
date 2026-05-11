'use client';
import React from 'react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Coins, CreditCard } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { createOrder, getCustomer } from '@/lib/http/api';
import { Customer, OrderData } from '@/lib/types';
import AddAdress from './addAddress';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import OrderSummary from './orderSummary';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { clearCart } from '@/lib/store/features/cart/cartSlice';

const formSchema = z.object({
    address: z.string({ required_error: 'Please select an address.' }),
    paymentMode: z.enum(['card', 'cash'], { required_error: 'You need to select a payment mode.' }),
    comment: z.any(),
});

const CustomerForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const customerForm = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });
    const searchParam = useSearchParams();
    const chosenCouponCode = React.useRef('');
    const idempotencyKeyRef = React.useRef('');
    const cart = useAppSelector((state) => state.cart);

    const { data: customer, isLoading } = useQuery<Customer>({
        queryKey: ['customer'],
        queryFn: async () => getCustomer().then((res) => res.data),
    });

    const { mutate, isPending: isPlaceOrderPending } = useMutation({
        mutationKey: ['order'],
        mutationFn: async (data: OrderData) => {
            const idempotencyKey = idempotencyKeyRef.current
                ? idempotencyKeyRef.current
                : (idempotencyKeyRef.current = uuidv4() + customer?._id);
            return createOrder(data, idempotencyKey).then((res) => res.data);
        },
        retry: 0,
        onSuccess: (data: { paymentUrl: string | null; _id?: string }) => {
            dispatch(clearCart());
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
                return;
            }
            // Cash order — redirect to order status page
            const restaurantId = searchParam.get('restaurantId');
            router.push(`/payment?success=true&orderId=${data._id}&restaurantId=${restaurantId}`);
        },
    });

    if (isLoading) return <h3 className="container mt-16">Loading customer details...</h3>;

    const handlePlaceOrder = (data: z.infer<typeof formSchema>) => {
        const tenantId = searchParam.get('restaurantId');
        if (!tenantId) { alert('Restaurant Id is required!'); return; }
        mutate({
            cart: cart.cartItems,
            couponCode: chosenCouponCode.current ?? '',
            tenantId,
            customerId: customer ? customer._id : '',
            comment: data.comment,
            address: data.address,
            paymentMode: data.paymentMode,
        });
    };

    return (
        <Form {...customerForm}>
            <form onSubmit={customerForm.handleSubmit(handlePlaceOrder)}>
                <div className="flex container gap-6 mt-16">
                    <Card className="w-3/5 border-none">
                        <CardHeader><CardTitle>Customer details</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label>First Name</Label>
                                    <Input defaultValue={customer?.firstName} disabled />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Last Name</Label>
                                    <Input defaultValue={customer?.lastName} disabled />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Email</Label>
                                    <Input defaultValue={customer?.email} disabled />
                                </div>
                                <div className="grid gap-3">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <Label>Address</Label>
                                            <AddAdress customerId={customer?._id} />
                                        </div>
                                        <FormField name="address" control={customerForm.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <RadioGroup onValueChange={field.onChange} className="grid grid-cols-2 gap-6 mt-2">
                                                            {customer?.addresses.map((address) => (
                                                                <Card className="p-6" key={address.text}>
                                                                    <div className="flex items-center space-x-2">
                                                                        <FormControl>
                                                                            <RadioGroupItem value={address.text} id={address.text} />
                                                                        </FormControl>
                                                                        <Label htmlFor={address.text} className="leading-normal">{address.text}</Label>
                                                                    </div>
                                                                </Card>
                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label>Payment Mode</Label>
                                    <FormField name="paymentMode" control={customerForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} className="flex gap-6">
                                                        {(['card', 'cash'] as const).map((mode) => (
                                                            <div className="w-36" key={mode}>
                                                                <FormControl>
                                                                    <RadioGroupItem value={mode} id={mode} className="peer sr-only" />
                                                                </FormControl>
                                                                <Label htmlFor={mode} className="flex items-center justify-center rounded-md border-2 bg-white p-2 h-16 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                                                    {mode === 'card' ? <CreditCard size={20} /> : <Coins size={20} />}
                                                                    <span className="ml-2 capitalize">{mode}</span>
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Comment</Label>
                                    <FormField name="comment" control={customerForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl><Textarea {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <OrderSummary
                        isPlaceOrderPending={isPlaceOrderPending}
                        handleCouponCodeChange={(code) => { chosenCouponCode.current = code; }}
                    />
                </div>
            </form>
        </Form>
    );
};

export default CustomerForm;

'use server';
import { cookies } from 'next/headers';

export default async function register(prevState: { type: string; message: string }, formdata: FormData) {
    const firstName = formdata.get('firstName');
    const lastName = formdata.get('lastName');
    const email = formdata.get('email');
    const password = formdata.get('password');
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            return { type: 'error', message: error.errors?.[0]?.msg ?? 'Registration failed' };
        }
        const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
        for (const cookieStr of setCookieHeaders) {
            const [nameVal] = cookieStr.split(';');
            const [name, value] = nameVal.split('=');
            if (name && value) {
                cookies().set({ name: name.trim(), value: value.trim(), httpOnly: true, path: '/', maxAge: 86400 });
            }
        }
        return { type: 'success', message: 'Registration successful!' };
    } catch (err: unknown) {
        return { type: 'error', message: (err as Error).message };
    }
}

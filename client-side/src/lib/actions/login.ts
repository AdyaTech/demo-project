'use server';
import { cookies } from 'next/headers';

export default async function login(prevState: { type: string; message: string }, formdata: FormData) {
    const email = formdata.get('email');
    const password = formdata.get('password');
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            return { type: 'error', message: error.errors?.[0]?.msg ?? 'Login failed' };
        }
        const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
        for (const cookieStr of setCookieHeaders) {
            const [nameVal] = cookieStr.split(';');
            const [name, value] = nameVal.split('=');
            if (name && value) {
                cookies().set({ name: name.trim(), value: value.trim(), httpOnly: true, path: '/', maxAge: 86400 });
            }
        }
        return { type: 'success', message: 'Login successful!' };
    } catch (err: unknown) {
        return { type: 'error', message: (err as Error).message };
    }
}

'use server';
import { cookies } from 'next/headers';

export const logout = async () => {
    await fetch(`${process.env.BACKEND_URL}/api/auth/auth/logout`, { method: 'POST' });
    cookies().delete('accessToken');
    cookies().delete('refreshToken');
    return true;
};

import { cookies } from 'next/headers';

interface Session {
    user: { id: string; firstName: string; lastName: string; email: string; role: string; tenant: unknown };
}

export const getSession = async (): Promise<Session | null> => {
    const token = cookies().get('accessToken')?.value;
    if (!token) return null;
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/auth/self`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!response.ok) return null;
        return { user: await response.json() };
    } catch { return null; }
};

'use client';
import React, { useCallback, useEffect, useRef } from 'react';

// Simplified refresher — calls /api/auth/refresh periodically (every 20 min)
// since our mock tokens don't have real JWT expiry fields.
const Refresher = ({ children }: { children: React.ReactNode }) => {
    const intervalRef = useRef<NodeJS.Timeout>();

    const refreshAccessToken = useCallback(async () => {
        try {
            await fetch('/api/auth/refresh', { method: 'POST' });
        } catch (err) {
            console.error('Error while refreshing token', err);
        }
    }, []);

    useEffect(() => {
        // Refresh every 20 minutes
        intervalRef.current = setInterval(refreshAccessToken, 20 * 60 * 1000);
        return () => clearInterval(intervalRef.current);
    }, [refreshAccessToken]);

    return <div>{children}</div>;
};

export default Refresher;

// Mock Socket - shared server doesn't have socket.io, simulate it
import { OrderEvents, PaymentMode } from '../types';

type EventCallback = (data: unknown) => void;
const listeners: Record<string, EventCallback[]> = {};

const mockSocket = {
    on(event: string, cb: EventCallback) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(cb);
    },
    off(event: string) { delete listeners[event]; },
    emit(event: string, _data: unknown) {
        if (event === 'join') {
            setTimeout(() => {
                (listeners['join'] ?? []).forEach((cb) => cb({ roomId: 'tenant-room-t1' }));
            }, 300);
        }
    },
    id: 'mock-socket-' + Math.random().toString(36).slice(2),
};

setTimeout(() => console.log('Mock socket connected:', mockSocket.id), 100);
export default mockSocket;

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { AdminNotificationPayload } from "../hooks/useAdminNotificationSocket";

export interface ToastNotification extends AdminNotificationPayload {
    id: string;
    timestamp: number;
}

interface AdminNotificationContextValue {
    toasts: ToastNotification[];
    addToast: (payload: AdminNotificationPayload) => void;
    removeToast: (id: string) => void;
    unreadCount: number;
    incrementUnread: () => void;
    resetUnread: () => void;
}

const AdminNotificationContext = createContext<AdminNotificationContextValue | null>(null);

export function AdminNotificationProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const addToast = useCallback((payload: AdminNotificationPayload) => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts((prev) => [...prev, { ...payload, id, timestamp: Date.now() }]);
        setUnreadCount((prev) => prev + 1);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const incrementUnread = useCallback(() => setUnreadCount((prev) => prev + 1), []);
    const resetUnread = useCallback(() => setUnreadCount(0), []);

    return (
        <AdminNotificationContext.Provider value={{ toasts, addToast, removeToast, unreadCount, incrementUnread, resetUnread }}>
            {children}
        </AdminNotificationContext.Provider>
    );
}

export function useAdminNotification() {
    const ctx = useContext(AdminNotificationContext);
    if (!ctx) throw new Error("useAdminNotification must be used within AdminNotificationProvider");
    return ctx;
}

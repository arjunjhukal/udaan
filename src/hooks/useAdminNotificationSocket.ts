import { useEffect, useRef } from "react";
import { getEcho } from "../lib/echo";
import type { NotifiableTypes } from "../types/notification";

export interface AdminNotificationPayload {
    title: string;
    description: string;
    notification_type: NotifiableTypes;
    notifiable_type: string;
    notifiable_id: number;
}

export interface AdminNotificationSocketCallbacks {
    onNotification?: (payload: AdminNotificationPayload) => void;
}

export function useAdminNotificationSocket(callbacks: AdminNotificationSocketCallbacks) {
    const callbacksRef = useRef(callbacks);

    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);

    useEffect(() => {
        let echo: ReturnType<typeof getEcho>;
        try {
            echo = getEcho();
        } catch (err) {
            console.error("[useAdminNotificationSocket]", err);
            return;
        }

        const channel = echo.private("admin.notification");

        channel.subscribed(() => {
            console.log("[Socket] ✅ Subscribed to admin.notification");
        });
        channel.error((err: unknown) => {
            console.error("[Socket] ❌ Channel error on admin.notification:", err);
        });

        channel.listen(".NotificationEvent", (data: AdminNotificationPayload) => {
            console.log("[useAdminNotificationSocket] NotificationEvent", data);
            callbacksRef.current.onNotification?.(data);
        });

        return () => {
            echo.leave("admin.notification");
        };
    }, []);
}

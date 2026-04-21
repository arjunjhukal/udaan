import { useEffect, useRef } from "react";
import { getEcho } from "../lib/echo";
import { baseApi } from "../services/baseApi";
import { useAppDispatch } from "../store/hook";
import type { NotifiableTypes } from "../types/notification";

const NOTIFIABLE_TAG_MAP: Record<string, string[]> = {
    discussion:  ["Discussion"],
    ticket:      ["Ticket", "TicketReply"],
    reset:       ["ResetRequest"],
    transaction: ["Transaction"],
    notification:["Notifications"],
    activity:    ["Activity"],
    user:        ["User"],
    test:        ["Test", "Results"],
    live:        ["Live_Class"],
};

function resolveEntityTags(notifiableType: string): string[] {
    const key = notifiableType.split(/[\\/_]/).pop()?.toLowerCase() ?? "";
    return NOTIFIABLE_TAG_MAP[key] ?? [];
}

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

export function useAdminNotificationSocket(
    userId: number | undefined,
    callbacks: AdminNotificationSocketCallbacks
) {
    const dispatch = useAppDispatch();
    const callbacksRef = useRef(callbacks);

    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);

    useEffect(() => {
        if (!userId) return;

        let echo: ReturnType<typeof getEcho>;
        try {
            echo = getEcho();
        } catch (err) {
            console.error("[useAdminNotificationSocket]", err);
            return;
        }

        const channel = echo.private(`App.Models.User.${userId}`);

        channel.error((err: unknown) => {
            console.error("[Socket] ❌ Channel error:", err);
        });

        channel.listen(".NotificationEvent", (data: AdminNotificationPayload) => {
            callbacksRef.current.onNotification?.(data);

            const entityTags = resolveEntityTags(data.notifiable_type);
            dispatch(
                baseApi.util.invalidateTags(
                    [{ type: "MenuCounts", id: "ALL" }, ...entityTags] as Parameters<typeof baseApi.util.invalidateTags>[0]
                )
            );
        });

        return () => {
            echo.leave(`App.Models.User.${userId}`);
        };
    }, [userId, dispatch]);
}

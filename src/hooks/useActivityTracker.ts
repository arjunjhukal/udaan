import { useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSendActivityHeartbeatMutation } from "../services/performanceTrackingApi";
import type { ActivityType } from "../types/activityTracking";

const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000;   // 5 minutes
const IDLE_THRESHOLD_MS = 15 * 60 * 1000;       // 15 minutes — new session after this
const MAX_SESSION_SECONDS = 8 * 60 * 60;         // 8 hours guard cap
const ACTIVITY_EVENTS = ["mousemove", "keydown", "scroll", "click", "touchstart"] as const;

export function useActivityTracker(activityType: ActivityType = "general") {
    const [sendHeartbeat] = useSendActivityHeartbeatMutation();

    const sessionId = useRef<string>(uuidv4());
    const sessionStart = useRef<number>(Date.now());
    const lastActivity = useRef<number>(Date.now());
    const isIdle = useRef<boolean>(false);

    const getToken = useCallback((): string | null => {
        try {
            const state = (window as any).__REDUX_STORE__?.getState?.();
            return state?.auth?.token?.access_token ?? null;
        } catch {
            return null;
        }
    }, []);

    const startNewSession = useCallback(() => {
        sessionId.current = uuidv4();
        sessionStart.current = Date.now();
        isIdle.current = false;
    }, []);

    const computeDurationSeconds = useCallback((): number => {
        const raw = Math.floor((Date.now() - sessionStart.current) / 1000);
        return Math.min(raw, MAX_SESSION_SECONDS);
    }, []);

    const sendFlush = useCallback((durationSeconds: number) => {
        if (durationSeconds <= 0) return;
        const token = getToken();
        const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "") + "/api/v1";
        const body = JSON.stringify({
            session_id: sessionId.current,
            duration_seconds: durationSeconds,
            activity_type: activityType,
        });
        // keepalive ensures the request survives page unload
        fetch(`${baseUrl}/user/activity/flush`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body,
            keepalive: true,
        }).catch(() => {});
    }, [activityType, getToken]);

    const onHeartbeat = useCallback(() => {
        const now = Date.now();
        const idleFor = now - lastActivity.current;

        if (idleFor >= IDLE_THRESHOLD_MS) {
            // User has been idle — mark idle and don't accumulate
            isIdle.current = true;
            return;
        }

        const duration = computeDurationSeconds();
        if (duration <= 0) return;

        sendHeartbeat({
            session_id: sessionId.current,
            duration_seconds: duration,
            activity_type: activityType,
        });

        // Reset session start so next heartbeat measures only the next interval
        sessionStart.current = Date.now();
    }, [activityType, computeDurationSeconds, sendHeartbeat]);

    const onUserActivity = useCallback(() => {
        const now = Date.now();
        const wasIdle = isIdle.current;
        lastActivity.current = now;

        if (wasIdle) {
            // Resume from idle — start a fresh session
            startNewSession();
        }
    }, [startNewSession]);

    // Visibility change: flush when hidden, new session when visible
    const onVisibilityChange = useCallback(() => {
        if (document.hidden) {
            const duration = computeDurationSeconds();
            sendFlush(duration);
            isIdle.current = true;
        } else {
            startNewSession();
        }
    }, [computeDurationSeconds, sendFlush, startNewSession]);

    // Page unload flush
    const onBeforeUnload = useCallback(() => {
        if (isIdle.current) return;
        const duration = computeDurationSeconds();
        sendFlush(duration);
    }, [computeDurationSeconds, sendFlush]);

    useEffect(() => {
        // Attach activity event listeners with passive flag for performance
        ACTIVITY_EVENTS.forEach((event) => {
            window.addEventListener(event, onUserActivity, { passive: true });
        });
        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("beforeunload", onBeforeUnload);

        const heartbeatTimer = setInterval(onHeartbeat, HEARTBEAT_INTERVAL_MS);

        return () => {
            ACTIVITY_EVENTS.forEach((event) => {
                window.removeEventListener(event, onUserActivity);
            });
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("beforeunload", onBeforeUnload);
            clearInterval(heartbeatTimer);

            // Final flush on component unmount
            if (!isIdle.current) {
                const duration = computeDurationSeconds();
                sendFlush(duration);
            }
        };
    }, [onHeartbeat, onUserActivity, onVisibilityChange, onBeforeUnload, computeDurationSeconds, sendFlush]);
}

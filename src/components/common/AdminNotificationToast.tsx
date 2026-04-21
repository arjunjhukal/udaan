import { useEffect } from "react";
import { useAdminNotification, type ToastNotification } from "../../context/AdminNotificationContext";

const TOAST_DURATION = 3000;

function SingleToast({ toast }: { toast: ToastNotification }) {
    const { removeToast } = useAdminNotification();

    useEffect(() => {
        const timer = setTimeout(() => removeToast(toast.id), TOAST_DURATION);
        return () => clearTimeout(timer);
    }, [toast.id, removeToast]);

    return (
        <div
            className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 px-4 py-3 min-w-[300px] max-w-[360px] animate-slide-in-up"
            style={{
                animation: "slideInUp 0.25s ease-out",
            }}
        >
            {/* Colored left bar */}
            <div className="w-1 self-stretch rounded-full bg-blue-500 shrink-0" />

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {toast.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {toast.description}
                </p>
            </div>

            <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0 mt-0.5"
                aria-label="Dismiss"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export default function AdminNotificationToast() {
    const { toasts } = useAdminNotification();

    if (toasts.length === 0) return null;

    return (
        <>
            <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <SingleToast toast={toast} />
                    </div>
                ))}
            </div>
        </>
    );
}

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react"

import {
    Toast,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
    ToastClose,
} from "@/components/ui/toast"

interface ToastMessage {
    id: string
    title?: string
    description?: string
    variant?: "default" | "success" | "warning" | "destructive" | "info"
    action?: ReactNode
    duration?: number
}

interface NotificationContextValue {
    notify: (toast: Omit<ToastMessage, "id">) => void
    dismiss: (toastId: string) => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([])
    const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

    const dismiss = useCallback((toastId: string) => {
        const timeoutId = timers.current.get(toastId)
        if (timeoutId) {
            clearTimeout(timeoutId)
            timers.current.delete(toastId)
        }
        setToasts((current) => current.filter((toast) => toast.id !== toastId))
    }, [])

    const scheduleRemoval = useCallback((toastId: string, duration: number) => {
        const timeoutId = setTimeout(() => {
            dismiss(toastId)
            timers.current.delete(toastId)
        }, duration)
        timers.current.set(toastId, timeoutId)
    }, [dismiss])

    const notify = useCallback(
        (toast: Omit<ToastMessage, "id">) => {
            const id = typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2, 10)
            const duration = toast.duration ?? 5_000
            const message: ToastMessage = { ...toast, id, duration }
            setToasts((current) => [message, ...current].slice(0, 5))
            scheduleRemoval(id, duration)
        },
        [scheduleRemoval]
    )

    const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss])

    return (
        <NotificationContext.Provider value={value}>
            <ToastProvider>
                {children}
                <ToastViewport />
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        open
                        onOpenChange={(open) => {
                            if (!open) dismiss(toast.id)
                        }}
                        className={toast.variant === "destructive" ? "border-red-500/40" : undefined}
                    >
                        {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                        {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
                        {toast.action}
                        <ToastClose />
                    </Toast>
                ))}
            </ToastProvider>
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider")
    }
    return context
}

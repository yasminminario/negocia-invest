import { useEffect } from "react"
import { io, type Socket } from "socket.io-client"

import { API_BASE_URL } from "@/config/api"
import { USE_MOCKS } from "@/config/dev"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { useProfile } from "@/contexts/ProfileContext"

interface NotificationPayload {
    title?: string
    description?: string
    variant?: "default" | "success" | "warning" | "destructive" | "info"
}

export function useRealtimeNotifications() {
    const { user, token } = useAuth()
    const { notify } = useNotifications()
    const { activeProfile } = useProfile()

    useEffect(() => {
        if (!user || !token) return

        if (USE_MOCKS) {
            // emit a mock notification every 12s for development
            const id = setInterval(() => {
                notify({
                    title: "Notificação de dev",
                    description: "Evento simulado para testar toasts e atualizações.",
                    variant: "info",
                })
            }, 12_000)

            return () => clearInterval(id)
        }

        let socket: Socket | undefined
        let initialConnect = true

        try {
            socket = io(API_BASE_URL, {
                path: "/ws/notifications",
                transports: ["websocket"],
                auth: {
                    token,
                },
                query: {
                    userId: String(user.id),
                    profile: activeProfile,
                },
            })

            socket.on("connect", () => {
                if (initialConnect) {
                    notify({
                        title: "Conectado em tempo real",
                        description: "Você receberá novos eventos instantaneamente.",
                        variant: "info",
                    })
                    initialConnect = false
                }
            })

            socket.on("notification", (payload: NotificationPayload) => {
                notify({
                    title: payload.title ?? "Atualização recebida",
                    description: payload.description ?? "Uma nova ação foi registrada.",
                    variant: payload.variant ?? "info",
                })
            })

            socket.on("disconnect", () => {
                notify({
                    title: "Conexão perdida",
                    description: "Tentaremos reconectar automaticamente.",
                    variant: "warning",
                })
            })
        } catch (error) {
            console.error("Socket connection failed", error)
        }

        return () => {
            socket?.disconnect()
        }
    }, [activeProfile, notify, token, user])
}

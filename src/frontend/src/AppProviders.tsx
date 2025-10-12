import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState, type ReactNode } from "react"

import { NotificationProvider } from "@/contexts/NotificationContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ProfileProvider } from "@/contexts/ProfileContext"

export function AppProviders({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() =>
        new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60_000,
                    retry: 1,
                },
            },
        })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <NotificationProvider>
                <AuthProvider>
                    <ProfileProvider>{children}</ProfileProvider>
                </AuthProvider>
            </NotificationProvider>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </QueryClientProvider>
    )
}

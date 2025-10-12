import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/contexts/AuthContext"

export function ProtectedRoute() {
    const { user, initializing } = useAuth()
    const location = useLocation()

    if (initializing) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" aria-label="Carregando" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />
    }

    return <Outlet />
}

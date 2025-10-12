import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import {
    type AuthResponse,
    type AuthUser,
    type LoginPayload,
    type RegisterPayload,
    getCurrentUser,
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest,
} from "@/services/auth.service"

interface AuthContextValue {
    user: AuthUser | null
    token: string | null
    loading: boolean
    initializing: boolean
    login: (payload: LoginPayload) => Promise<void>
    register: (payload: RegisterPayload) => Promise<void>
    logout: () => Promise<void>
    refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = "ni.token"
const USER_KEY = "ni.user"

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [initializing, setInitializing] = useState(true)

    const saveSession = useCallback(({ token: newToken, usuario }: AuthResponse) => {
        localStorage.setItem(TOKEN_KEY, newToken)
        localStorage.setItem(USER_KEY, JSON.stringify(usuario))
        setToken(newToken)
        setUser(usuario)
    }, [])

    const clearSession = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
    }, [])

    const hydrateFromStorage = useCallback(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY)
        const storedUser = localStorage.getItem(USER_KEY)

        if (storedToken) {
            setToken(storedToken)
        }

        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser) as AuthUser
                setUser(parsed)
            } catch (error) {
                console.warn("Invalid user cache", error)
                localStorage.removeItem(USER_KEY)
            }
        }
    }, [])

    useEffect(() => {
        hydrateFromStorage()
        const onUnauthorized = () => {
            clearSession()
        }
        window.addEventListener("ni:unauthorized", onUnauthorized)

        return () => window.removeEventListener("ni:unauthorized", onUnauthorized)
    }, [clearSession, hydrateFromStorage])

    const refresh = useCallback(async () => {
        if (!token) {
            setInitializing(false)
            return
        }
        try {
            const data = await getCurrentUser()
            setUser(data)
        } catch (error) {
            clearSession()
            console.error("Failed to refresh session", error)
        } finally {
            setInitializing(false)
        }
    }, [clearSession, token])

    useEffect(() => {
        void refresh()
    }, [refresh])

    const login = useCallback(async (payload: LoginPayload) => {
        setLoading(true)
        try {
            const response = await loginRequest(payload)
            saveSession(response)
        } finally {
            setLoading(false)
        }
    }, [saveSession])

    const register = useCallback(async (payload: RegisterPayload) => {
        setLoading(true)
        try {
            const response = await registerRequest(payload)
            saveSession(response)
        } finally {
            setLoading(false)
        }
    }, [saveSession])

    const logout = useCallback(async () => {
        setLoading(true)
        try {
            await logoutRequest()
        } catch (error) {
            console.warn("Logout request failed", error)
        } finally {
            clearSession()
            setLoading(false)
        }
    }, [clearSession])

    const value = useMemo(
        () => ({ user, token, loading, initializing, login, register, logout, refresh }),
        [user, token, loading, initializing, login, register, logout, refresh]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}

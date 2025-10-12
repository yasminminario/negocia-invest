import { apiClient } from "@/services/api-client"
import { seedMockUsers } from "@/mocks"
export type UserRole = "investidor" | "tomador"

export interface AuthUser {
    id: number
    nome: string
    email: string
    perfis: UserRole[]
    cpf?: string
    telefone?: string
    [key: string]: unknown
}

export interface LoginPayload {
    email: string
    senha: string
}

export interface RegisterPayload {
    nome: string
    email: string
    senha: string
    cpf?: string
    telefone?: string
    perfis?: UserRole[]
}

export interface AuthResponse {
    token: string
    usuario: AuthUser
}

// Flags:
// - VITE_USE_MOCKS: global service mocks (negotiations, proposals, rates, score, notifications)
// - VITE_MOCK_AUTH: mock only authentication flows (login/register/getCurrentUser/logout)
const USE_MOCK_AUTH = (import.meta.env.VITE_MOCK_AUTH ?? "") === "true"

// --- Mock implementation (in-memory via localStorage) ---
const MOCK_USERS_KEY = "ni.mock.users"
const MOCK_SESSION_KEY = "ni.mock.session"

if (USE_MOCK_AUTH) {
    try {
        // seed users for developer convenience
        seedMockUsers()
    } catch {
        // ignore if mocks not available in some builds
    }
}

function getMockUsers(): Array<any> {
    try {
        const raw = localStorage.getItem(MOCK_USERS_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function saveMockUsers(users: Array<any>) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

function createMockSession(user: any) {
    const token = `mock-token-${user.id}`
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({ token, user }))
    return { token, usuario: user }
}

function clearMockSession() {
    localStorage.removeItem(MOCK_SESSION_KEY)
}

function getMockSession() {
    try {
        const raw = localStorage.getItem(MOCK_SESSION_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

// Exported functions: either real API or mock depending on env
export async function login(payload: LoginPayload) {
    if (!USE_MOCK_AUTH) {
        const { data } = await apiClient.post<AuthResponse>("/auth/login", payload)
        return data
    }
    console.debug("[auth.service] using MOCK auth for login", payload.email)

    const users = getMockUsers()
    const found = users.find((u: any) => u.email === payload.email && u.senha === payload.senha)
    if (!found) {
        const err: any = new Error("Invalid credentials")
        err.response = { status: 401 }
        throw err
    }
    return createMockSession(found)
}

export async function register(payload: RegisterPayload) {
    if (!USE_MOCK_AUTH) {
        const { data } = await apiClient.post<AuthResponse>("/auth/register", payload)
        return data
    }
    console.debug("[auth.service] using MOCK auth for register", payload.email)

    const users = getMockUsers()
    if (users.some((u: any) => u.email === payload.email)) {
        const err: any = new Error("Email already exists")
        err.response = { status: 409 }
        throw err
    }

    const id = users.length ? Math.max(...users.map((u: any) => u.id)) + 1 : 1
    const newUser: any = {
        id,
        nome: payload.nome,
        email: payload.email,
        senha: payload.senha, // mock-only: do NOT store plaintext in production
        perfis: payload.perfis ?? ["tomador"],
        cpf: payload.cpf,
        telefone: payload.telefone,
    }
    users.push(newUser)
    saveMockUsers(users)
    return createMockSession(newUser)
}

export async function getCurrentUser() {
    if (!USE_MOCK_AUTH) {
        const { data } = await apiClient.get<AuthUser>("/auth/me")
        return data
    }
    const session = getMockSession()
    if (!session) {
        const err: any = new Error("Not authenticated")
        err.response = { status: 401 }
        throw err
    }
    return session.user as AuthUser
}

export async function logout() {
    if (!USE_MOCK_AUTH) {
        await apiClient.post("/auth/logout")
        return
    }
    clearMockSession()
}

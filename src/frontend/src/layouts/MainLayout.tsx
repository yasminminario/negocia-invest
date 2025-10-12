import { NavLink, Outlet } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { useProfile } from "@/contexts/ProfileContext"
import { cn } from "@/lib/utils"
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications"

export function MainLayout() {
    const { user, logout } = useAuth()
    const { notify } = useNotifications()
    const { activeProfile, availableProfiles, setActiveProfile } = useProfile()

    useRealtimeNotifications()

    const handleLogout = async () => {
        await logout()
        notify({
            title: "Sessão encerrada",
            description: "Você saiu da plataforma com segurança.",
            variant: "info",
        })
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
                    <div className="flex items-center gap-6">
                        <span className="text-xl font-semibold text-foreground">Negocia Invest</span>
                        <nav className="hidden items-center gap-3 text-sm font-medium text-muted-foreground md:flex">
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    cn(
                                        "rounded-md px-3 py-2 transition-colors",
                                        isActive ? "bg-primary-subtle text-foreground" : "hover:bg-muted"
                                    )
                                }
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/negotiations"
                                className={({ isActive }) =>
                                    cn(
                                        "rounded-md px-3 py-2 transition-colors",
                                        isActive ? "bg-primary-subtle text-foreground" : "hover:bg-muted"
                                    )
                                }
                            >
                                Negociações
                            </NavLink>
                            <NavLink
                                to="/market"
                                className={({ isActive }) =>
                                    cn(
                                        "rounded-md px-3 py-2 transition-colors",
                                        isActive ? "bg-primary-subtle text-foreground" : "hover:bg-muted"
                                    )
                                }
                            >
                                Mercado
                            </NavLink>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    cn(
                                        "rounded-md px-3 py-2 transition-colors",
                                        isActive ? "bg-primary-subtle text-foreground" : "hover:bg-muted"
                                    )
                                }
                            >
                                Meu Perfil
                            </NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex rounded-full border border-border/50 bg-card/60 p-1 text-xs font-semibold">
                            {availableProfiles.map((profile) => (
                                <button
                                    key={profile}
                                    type="button"
                                    onClick={() => setActiveProfile(profile)}
                                    className={cn(
                                        "rounded-full px-3 py-1 transition-colors",
                                        activeProfile === profile && "bg-primary text-primary-foreground"
                                    )}
                                    aria-pressed={activeProfile === profile}
                                >
                                    {profile === "investidor" ? "Investidor" : "Tomador"}
                                </button>
                            ))}
                        </div>
                        <div className="hidden flex-col text-right text-xs text-muted-foreground sm:flex">
                            <span className="font-semibold text-foreground">{user?.nome}</span>
                            <span>{user?.email}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Sair
                        </Button>
                    </div>
                </div>
            </header>
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
                <Outlet />
            </main>
        </div>
    )
}

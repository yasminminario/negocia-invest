import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, Navigate, useLocation } from "react-router-dom"
import { map422ToFormErrors } from "@/lib/validation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationContext"

const loginSchema = z.object({
    email: z.string().email("Informe um e-mail válido"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
    const { user, login, loading } = useAuth()
    const location = useLocation()
    const { notify } = useNotifications()

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            senha: "",
        },
    })

    const { setError } = form

    const onSubmit = async (values: LoginValues) => {
        try {
            await login(values)
            notify({
                title: "Bem-vindo de volta!",
                description: "Login realizado com sucesso.",
                variant: "success",
            })
        } catch (error: any) {
            console.error(error)
            // Axios/FastAPI validation errors
            const detail = error?.response?.data?.detail
            const mapped = map422ToFormErrors(detail)
            if (Object.keys(mapped).length > 0) {
                for (const [field, err] of Object.entries(mapped)) {
                    setError(field as any, { type: (err as any).type ?? "server", message: (err as any).message })
                }
                return
            }

            notify({
                title: "Não foi possível entrar",
                description: "Verifique suas credenciais e tente novamente.",
                variant: "destructive",
            })
        }
    }

    if (user) {
        const redirectTo =
            (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ?? "/dashboard"
        return <Navigate to={redirectTo} replace />
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-background/80 px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card/70 p-10 shadow-xl backdrop-blur">
                <header className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold text-foreground">Acesse sua conta</h1>
                    <p className="text-base text-muted-foreground">
                        Gerencie suas solicitações e ofertas de empréstimo com facilidade.
                    </p>
                </header>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="voce@email.com"
                            {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="senha">Senha</Label>
                        <Input
                            id="senha"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...form.register("senha")}
                        />
                        {form.formState.errors.senha && (
                            <p className="text-sm text-destructive">{form.formState.errors.senha.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full text-base" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
                <footer className="space-y-3 text-center text-sm text-muted-foreground">
                    <p>Esqueceu sua senha? Entre em contato com nosso suporte.</p>
                    <p>
                        Ainda não possui conta? {" "}
                        <Link to="/auth/register" className="text-primary underline-offset-4 hover:underline">
                            Cadastre-se agora
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    )
}

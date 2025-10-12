import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, Navigate } from "react-router-dom"
import { map422ToFormErrors } from "@/lib/validation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationContext"

const registerSchema = z
    .object({
        nome: z.string().min(3, "Informe seu nome completo"),
        email: z.string().email("Informe um e-mail válido"),
        senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
        confirmarSenha: z.string().min(6, "Confirme sua senha"),
        cpf: z
            .string()
            .optional()
            .refine((value) => !value || value.replace(/\D/g, "").length === 11, {
                message: "CPF deve conter 11 dígitos",
            }),
        telefone: z
            .string()
            .optional()
            .refine((value) => !value || value.replace(/\D/g, "").length >= 10, {
                message: "Informe um telefone válido",
            }),
        perfis: z
            .array(z.enum(["investidor", "tomador"]))
            .min(1, "Selecione ao menos um perfil"),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
        path: ["confirmarSenha"],
        message: "As senhas devem coincidir",
    })

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterPage() {
    const { user, register: registerUser, loading } = useAuth()
    const { notify } = useNotifications()

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            nome: "",
            email: "",
            senha: "",
            confirmarSenha: "",
            cpf: "",
            telefone: "",
            perfis: ["tomador"],
        },
    })

    const { setError } = form

    const onSubmit = async (values: RegisterValues) => {
        try {
            await registerUser({
                nome: values.nome,
                email: values.email,
                senha: values.senha,
                cpf: values.cpf,
                telefone: values.telefone,
                perfis: values.perfis,
            })
            notify({
                title: "Conta criada!",
                description: "Você já pode acessar a plataforma.",
                variant: "success",
            })
        } catch (error: any) {
            console.error(error)
            const detail = error?.response?.data?.detail
            const mapped = map422ToFormErrors(detail)
            if (Object.keys(mapped).length > 0) {
                for (const [field, err] of Object.entries(mapped)) {
                    setError(field as any, { type: (err as any).type ?? "server", message: (err as any).message })
                }
                return
            }
            notify({
                title: "Erro ao cadastrar",
                description: "Tente novamente em instantes ou fale com o suporte.",
                variant: "destructive",
            })
        }
    }

    if (user) {
        return <Navigate to="/dashboard" replace />
    }

    const perfisSelecionados = form.watch("perfis")

    const togglePerfil = (perfil: "investidor" | "tomador") => {
        form.setValue(
            "perfis",
            perfisSelecionados.includes(perfil)
                ? perfisSelecionados.filter((item) => item !== perfil)
                : [...perfisSelecionados, perfil],
            { shouldValidate: true }
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-background/80 px-4">
            <div className="w-full max-w-2xl space-y-8 rounded-2xl border border-border bg-card/70 p-10 shadow-xl backdrop-blur">
                <header className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold text-foreground">Crie sua conta</h1>
                    <p className="text-base text-muted-foreground">
                        Cadastre-se para começar a solicitar ou ofertar empréstimos.
                    </p>
                </header>
                <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome completo</Label>
                            <Input id="nome" placeholder="Nome e sobrenome" {...form.register("nome")} />
                            {form.formState.errors.nome && (
                                <p className="text-sm text-destructive">{form.formState.errors.nome.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" type="email" placeholder="voce@email.com" {...form.register("email")} />
                            {form.formState.errors.email && (
                                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="senha">Senha</Label>
                            <Input id="senha" type="password" placeholder="••••••••" {...form.register("senha")} />
                            {form.formState.errors.senha && (
                                <p className="text-sm text-destructive">{form.formState.errors.senha.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                            <Input
                                id="confirmarSenha"
                                type="password"
                                placeholder="Repita sua senha"
                                {...form.register("confirmarSenha")}
                            />
                            {form.formState.errors.confirmarSenha && (
                                <p className="text-sm text-destructive">{form.formState.errors.confirmarSenha.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF (opcional)</Label>
                            <Input id="cpf" placeholder="000.000.000-00" {...form.register("cpf")} />
                            {form.formState.errors.cpf && (
                                <p className="text-sm text-destructive">{form.formState.errors.cpf.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone (opcional)</Label>
                            <Input id="telefone" placeholder="(11) 99999-0000" {...form.register("telefone")} />
                            {form.formState.errors.telefone && (
                                <p className="text-sm text-destructive">{form.formState.errors.telefone.message}</p>
                            )}
                        </div>
                    </div>
                    <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold text-muted-foreground">
                            Com quais perfis você deseja atuar?
                        </legend>
                        <div className="grid gap-3 md:grid-cols-2">
                            <button
                                type="button"
                                className={`rounded-xl border-2 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${perfisSelecionados.includes("investidor")
                                    ? "border-primary bg-primary-subtle"
                                    : "border-border bg-background"
                                    }`}
                                onClick={() => togglePerfil("investidor")}
                            >
                                <span className="block text-lg font-semibold">Investidor</span>
                                <span className="block text-sm text-muted-foreground">
                                    Financie oportunidades e acompanhe retornos com clareza.
                                </span>
                            </button>
                            <button
                                type="button"
                                className={`rounded-xl border-2 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${perfisSelecionados.includes("tomador")
                                    ? "border-primary bg-primary-subtle"
                                    : "border-border bg-background"
                                    }`}
                                onClick={() => togglePerfil("tomador")}
                            >
                                <span className="block text-lg font-semibold">Tomador</span>
                                <span className="block text-sm text-muted-foreground">
                                    Solicite empréstimos personalizados e negocie condições.
                                </span>
                            </button>
                        </div>
                        {form.formState.errors.perfis && (
                            <p className="text-sm text-destructive">{form.formState.errors.perfis.message}</p>
                        )}
                    </fieldset>
                    <Button type="submit" className="w-full text-base" disabled={loading}>
                        {loading ? "Finalizando..." : "Criar conta"}
                    </Button>
                </form>
                <footer className="space-y-3 text-center text-sm text-muted-foreground">
                    <p>
                        Já possui conta? {" "}
                        <Link to="/auth/login" className="text-primary underline-offset-4 hover:underline">
                            Entrar agora
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    )
}

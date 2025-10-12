import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationContext"

export function ProfilePage() {
    const { user, refresh } = useAuth()
    const { notify } = useNotifications()

    const refreshData = async () => {
        await refresh()
        notify({
            title: "Perfil atualizado",
            description: "Informações sincronizadas com o servidor.",
            variant: "info",
        })
    }

    if (!user) {
        return <p className="text-sm text-destructive">Nenhuma informação de usuário disponível.</p>
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
                <p className="text-sm text-muted-foreground">Consulte seus dados cadastrais e perfis de atuação.</p>
            </header>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>{user.nome}</CardTitle>
                    <CardDescription>ID #{user.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <Info label="E-mail" value={user.email} />
                    {user.cpf && <Info label="CPF" value={user.cpf} />}
                    {user.telefone && <Info label="Telefone" value={user.telefone as string} />}
                    <Info label="Perfis ativos" value={user.perfis?.join(", ") ?? "—"} />
                    <Button variant="outline" onClick={refreshData}>
                        Recarregar informações
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <p>
            <span className="font-semibold text-foreground">{label}:</span> {value}
        </p>
    )
}

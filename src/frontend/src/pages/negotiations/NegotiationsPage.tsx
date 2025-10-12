import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useProfile } from "@/contexts/ProfileContext"
import { fetchNegotiations } from "@/services/negotiations.service"
import type { Negotiation } from "@/types"
import { cn } from "@/lib/utils"

const STATUS_FILTERS = [
    { key: "todas", label: "Todas" },
    { key: "ativa", label: "Ativas" },
    { key: "aguardando", label: "Aguardando" },
    { key: "concluida", label: "Concluídas" },
]

type StatusKey = (typeof STATUS_FILTERS)[number]["key"]

export function NegotiationsPage() {
    const { user } = useAuth()
    const { activeProfile } = useProfile()
    const [statusFilter, setStatusFilter] = useState<StatusKey>("todas")

    const { data: negotiations = [], isLoading } = useQuery({
        queryKey: ["negotiations"],
        queryFn: () => fetchNegotiations(),
        enabled: Boolean(user?.id),
    })

    const filteredNegotiations = useMemo(() => {
        if (!user?.id) return []
        return negotiations
            .filter((negotiation) =>
                activeProfile === "tomador"
                    ? negotiation.id_tomador === user.id
                    : negotiation.id_investidor === user.id
            )
            .filter((negotiation) =>
                statusFilter === "todas" ? true : negotiation.status.toLowerCase().includes(statusFilter)
            )
    }, [activeProfile, negotiations, statusFilter, user?.id])

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Negociações</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Visualize, acompanhe e tome ações nas negociações em andamento.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/negotiations/new">
                        {activeProfile === "tomador" ? "Abrir nova solicitação" : "Ofertar novo empréstimo"}
                    </Link>
                </Button>
            </header>

            <div className="flex flex-wrap gap-2 text-sm">
                {STATUS_FILTERS.map((filter) => (
                    <button
                        key={filter.key}
                        type="button"
                        onClick={() => setStatusFilter(filter.key as StatusKey)}
                        className={cn(
                            "rounded-full border border-border px-4 py-1.5 transition-colors",
                            statusFilter === filter.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <section className="grid gap-4">
                {isLoading && <p className="text-sm text-muted-foreground">Carregando negociações...</p>}
                {!isLoading && filteredNegotiations.length === 0 && (
                    <Card className="border-dashed border-primary/40">
                        <CardHeader>
                            <CardTitle>Nenhuma negociação encontrada</CardTitle>
                            <CardDescription>Ainda não há negociações para este perfil.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Utilize o botão acima para iniciar uma nova negociação e acompanhe tudo por aqui.
                            </p>
                        </CardContent>
                    </Card>
                )}
                {filteredNegotiations.map((negotiation) => (
                    <NegotiationItem key={negotiation.id} negotiation={negotiation} profile={activeProfile} />
                ))}
            </section>
        </div>
    )
}

function NegotiationItem({ negotiation, profile }: { negotiation: Negotiation; profile: "investidor" | "tomador" }) {
    return (
        <Card className="border-border/60 bg-card/70">
            <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">
                    Negociação #{negotiation.id}
                </CardTitle>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {negotiation.status}
                </span>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <div>
                    <p className="font-semibold text-foreground">Valor</p>
                    <span>{negotiation.valor ? negotiation.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}</span>
                </div>
                <div>
                    <p className="font-semibold text-foreground">Taxa</p>
                    <span>{negotiation.taxa ? `${negotiation.taxa.toFixed(2)}% a.m.` : "—"}</span>
                </div>
                <div>
                    <p className="font-semibold text-foreground">Prazo</p>
                    <span>{negotiation.prazo ? `${negotiation.prazo} meses` : "—"}</span>
                </div>
                <div>
                    <p className="font-semibold text-foreground">
                        {profile === "tomador" ? "Investidor responsável" : "Tomador"}
                    </p>
                    <span>{profile === "tomador" ? negotiation.id_investidor : negotiation.id_tomador}</span>
                </div>
            </CardContent>
            <CardContent className="flex flex-wrap gap-2 pt-0">
                <Button asChild variant="secondary" size="sm">
                    <Link to={`/negotiations/${negotiation.id}`}>Ver detalhes</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                    <Link to={`/negotiations/${negotiation.id}/counter`}>Contraproposta</Link>
                </Button>
            </CardContent>
        </Card>
    )
}

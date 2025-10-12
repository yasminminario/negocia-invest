import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { useProfile } from "@/contexts/ProfileContext"
import { calculateScore } from "@/services/score.service"
import { fetchNegotiations } from "@/services/negotiations.service"
import { fetchProposals } from "@/services/proposals.service"
import type { Proposal } from "@/types"

export function DashboardPage() {
    const { user } = useAuth()
    const { activeProfile } = useProfile()
    const { notify } = useNotifications()

    const userId = user?.id

    const negotiationsQuery = useQuery({
        queryKey: ["negotiations"],
        queryFn: () => fetchNegotiations(),
        enabled: Boolean(userId),
    })

    const proposalsQuery = useQuery({
        queryKey: ["proposals"],
        queryFn: () => fetchProposals(),
        enabled: Boolean(userId),
    })

    const scoreQuery = useQuery({
        queryKey: ["score", userId],
        queryFn: () => calculateScore(userId!),
        enabled: Boolean(userId),
        staleTime: 5 * 60_000,
    })

    const filteredNegotiations = useMemo(() => {
        if (!negotiationsQuery.data || !userId) return []
        return negotiationsQuery.data.filter((negotiation) =>
            activeProfile === "tomador"
                ? negotiation.id_tomador === userId
                : negotiation.id_investidor === userId
        )
    }, [activeProfile, negotiationsQuery.data, userId])

    const filteredProposals = useMemo(() => {
        if (!proposalsQuery.data || !userId) return []
        return proposalsQuery.data.filter((proposal) =>
            activeProfile === "tomador"
                ? proposal.autor_tipo === "tomador" && proposal.id_autor === userId
                : proposal.autor_tipo === "investidor" && proposal.id_autor === userId
        )
    }, [activeProfile, proposalsQuery.data, userId])

    const activeNegotiations = filteredNegotiations.filter((item) => item.status !== "concluida")
    const activeProposals = filteredProposals.filter((item) => item.status !== "concluida")

    const averageRate = useMemo(() => {
        if (!activeNegotiations.length) return null
        const total = activeNegotiations.reduce((acc, negotiation) => acc + (negotiation.taxa ?? 0), 0)
        return total / activeNegotiations.length
    }, [activeNegotiations])

    const recentActivities = useMemo(() => {
        const items: Array<{ type: string; id: number; status: string; createdAt: string }> = []

        filteredNegotiations.slice(0, 5).forEach((negotiation) => {
            items.push({
                type: "Negociação",
                id: negotiation.id,
                status: negotiation.status,
                createdAt: negotiation.criado_em,
            })
        })

        filteredProposals.slice(0, 5).forEach((proposal) => {
            items.push({
                type: "Proposta",
                id: proposal.id,
                status: proposal.status,
                createdAt: proposal.criado_em,
            })
        })

        return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6)
    }, [filteredNegotiations, filteredProposals])

    const refreshData = () => {
        negotiationsQuery.refetch()
        proposalsQuery.refetch()
        scoreQuery.refetch()
        notify({ title: "Dados atualizados", description: "Painel sincronizado com o servidor.", variant: "info" })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase text-muted-foreground">{activeProfile}</p>
                    <h1 className="text-3xl font-bold text-foreground">Visão geral</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Acompanhe métricas e oportunidades do seu perfil ativo.
                    </p>
                </div>
                <Button onClick={refreshData} variant="outline">
                    Atualizar agora
                </Button>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardDescription>Score de crédito combinado</CardDescription>
                        <CardTitle className="text-3xl">
                            {scoreQuery.isLoading ? "Calculando..." : Math.round(scoreQuery.data?.valor_score ?? 0)}
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="text-xs text-muted-foreground">
                        Score do modelo: {Math.round(scoreQuery.data?.score_modelo ?? 0)} · Serasa: {" "}
                        {Math.round(scoreQuery.data?.score_serasa ?? 0)}
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Negociações ativas</CardDescription>
                        <CardTitle className="text-3xl">{activeNegotiations.length}</CardTitle>
                    </CardHeader>
                    <CardFooter className="text-xs text-muted-foreground">
                        Entre em detalhes para acompanhar propostas e status.
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Propostas em andamento</CardDescription>
                        <CardTitle className="text-3xl">{activeProposals.length}</CardTitle>
                    </CardHeader>
                    <CardFooter className="text-xs text-muted-foreground">
                        Inclui propostas e contrapropostas aguardando resposta.
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Taxa média contratada</CardDescription>
                        <CardTitle className="text-3xl">
                            {averageRate ? `${averageRate.toFixed(2)}% a.m.` : "Sem dados"}
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="text-xs text-muted-foreground">
                        Considerando negociações ativas do seu perfil.
                    </CardFooter>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Atividades recentes</CardTitle>
                        <CardDescription>Acompanhe o que mudou nas últimas movimentações.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivities.length === 0 && (
                            <p className="text-sm text-muted-foreground">Nenhuma atividade recente encontrada.</p>
                        )}
                        {recentActivities.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="flex items-center justify-between rounded-lg border border-border/40 bg-card/40 px-4 py-3">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {item.type} #{item.id}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Status: {item.status}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(item.createdAt).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="h-full border-dashed border-primary/40">
                    <CardHeader>
                        <CardTitle>Ações rápidas</CardTitle>
                        <CardDescription>
                            Inicie uma nova negociação, faça contrapropostas ou explore o mercado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <QuickActionList profile={activeProfile} proposals={filteredProposals} />
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}

function QuickActionList({
    profile,
    proposals,
}: {
    profile: "investidor" | "tomador"
    proposals: Proposal[]
}) {
    const pending = proposals.filter((proposal) => proposal.status === "pendente")
    const waitingCounter = proposals.filter((proposal) => proposal.status === "aguardando_contraproposta")

    return (
        <ul className="space-y-3">
            <li className="rounded-lg border border-border/40 bg-background/60 p-3">
                <p className="font-semibold text-foreground">
                    {profile === "tomador" ? "Solicitar novo empréstimo" : "Ofertar novo investimento"}
                </p>
                <p className="text-xs text-muted-foreground">
                    Utilize o assistente de taxas para montar a melhor proposta.
                </p>
            </li>
            <li className="rounded-lg border border-border/40 bg-background/60 p-3">
                <p className="font-semibold text-foreground">Propostas pendentes</p>
                <p className="text-xs text-muted-foreground">{pending.length} aguardando sua ação imediata.</p>
            </li>
            <li className="rounded-lg border border-border/40 bg-background/60 p-3">
                <p className="font-semibold text-foreground">Negociações aguardando resposta</p>
                <p className="text-xs text-muted-foreground">{waitingCounter.length} aguardando contraproposta.</p>
            </li>
        </ul>
    )
}

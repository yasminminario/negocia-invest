import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useProfile } from "@/contexts/ProfileContext"
import { fetchNegotiationById } from "@/services/negotiations.service"
import { fetchProposals } from "@/services/proposals.service"

export function NegotiationDetailsPage() {
    const params = useParams()
    const negotiationId = Number(params.negotiationId)
    const { activeProfile } = useProfile()

    const negotiationQuery = useQuery({
        queryKey: ["negotiation", negotiationId],
        queryFn: () => fetchNegotiationById(negotiationId),
        enabled: Number.isFinite(negotiationId),
    })

    const proposalsQuery = useQuery({
        queryKey: ["proposals", negotiationId],
        queryFn: () => fetchProposals({ id_negociacoes: negotiationId }),
        enabled: Number.isFinite(negotiationId),
    })

    const negotiation = negotiationQuery.data
    const proposals = proposalsQuery.data ?? []

    const sortedProposals = useMemo(
        () => [...proposals].sort((a, b) => (a.criado_em < b.criado_em ? 1 : -1)),
        [proposals]
    )

    if (negotiationQuery.isError) {
        return <p className="text-sm text-destructive">Erro ao carregar negociação.</p>
    }

    if (!negotiation) {
        return <p className="text-sm text-muted-foreground">Carregando detalhes...</p>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Link to="/negotiations" className="text-sm text-primary underline-offset-4 hover:underline">
                    Voltar para negociações
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Negociação #{negotiation.id}</h1>
                <p className="text-sm text-muted-foreground">
                    Status atual: <span className="font-semibold text-foreground">{negotiation.status}</span>
                </p>
            </div>

            <section className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Informações principais</CardTitle>
                        <CardDescription>Detalhes financeiros desta negociação.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <InfoRow label="Valor" value={formatCurrency(negotiation.valor)} />
                        <InfoRow label="Taxa" value={negotiation.taxa ? `${negotiation.taxa.toFixed(2)}% a.m.` : "—"} />
                        <InfoRow label="Prazo" value={negotiation.prazo ? `${negotiation.prazo} meses` : "—"} />
                        <InfoRow label="Parcelas" value={negotiation.parcela ? formatCurrency(negotiation.parcela) : "—"} />
                        <InfoRow label="Propostas" value={negotiation.quant_propostas ?? 0} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Participantes</CardTitle>
                        <CardDescription>Identificadores das partes envolvidas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <InfoRow label="Tomador" value={`#${negotiation.id_tomador}`} highlight={activeProfile === "tomador"} />
                        <InfoRow label="Investidor" value={`#${negotiation.id_investidor}`} highlight={activeProfile === "investidor"} />
                        <InfoRow
                            label="Assinada em"
                            value={negotiation.assinado_em ? new Date(negotiation.assinado_em).toLocaleDateString("pt-BR") : "—"}
                        />
                        <InfoRow label="Criada" value={new Date(negotiation.criado_em).toLocaleString("pt-BR")}
                        />
                        <InfoRow label="Atualizada" value={new Date(negotiation.atualizado_em).toLocaleString("pt-BR")} />
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Propostas e contrapropostas</h2>
                    <Button asChild variant="secondary">
                        <Link to={`/negotiations/${negotiation.id}/counter`}>Enviar contraproposta</Link>
                    </Button>
                </div>
                <div className="space-y-3">
                    {sortedProposals.length === 0 && (
                        <Card className="border-dashed border-primary/40">
                            <CardHeader>
                                <CardTitle>Sem propostas ainda</CardTitle>
                                <CardDescription>As propostas trocadas serão listadas aqui.</CardDescription>
                            </CardHeader>
                        </Card>
                    )}
                    {sortedProposals.map((proposal) => (
                        <Card key={proposal.id} className="border-border/60 bg-card/70">
                            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <CardTitle className="text-lg font-semibold text-foreground">
                                    {proposal.autor_tipo === "tomador" ? "Tomador" : "Investidor"} · Proposta #{proposal.id}
                                </CardTitle>
                                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
                                    {proposal.status}
                                </span>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                                <InfoRow label="Valor" value={proposal.valor ? formatCurrency(proposal.valor) : "—"} />
                                <InfoRow label="Taxa sugerida" value={`${proposal.taxa_sugerida}%`} />
                                <InfoRow label="Prazo" value={`${proposal.prazo_meses} meses`} />
                                <InfoRow
                                    label="Negociável"
                                    value={proposal.negociavel ? "Sim" : "Não"}
                                />
                                <InfoRow label="Tipo" value={proposal.tipo ?? "—"} />
                                <InfoRow label="Criada em" value={new Date(proposal.criado_em).toLocaleString("pt-BR")} />
                            </CardContent>
                            {proposal.justificativa && (
                                <CardContent className="text-sm text-muted-foreground">
                                    <p className="font-semibold text-foreground">Justificativa</p>
                                    <p>{proposal.justificativa}</p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    )
}

function InfoRow({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border/20 bg-background/60 px-3 py-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
            <span className={highlight ? "font-semibold text-primary" : "font-medium text-foreground"}>{value}</span>
        </div>
    )
}

function formatCurrency(value?: number | null) {
    if (!value) return "—"
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

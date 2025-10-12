import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

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
import { useProfile } from "@/contexts/ProfileContext"
import { fetchMarketRecommendations } from "@/services/proposals.service"
import type { MarketRecommendation } from "@/types"

export function MarketPage() {
    const { user } = useAuth()
    const { activeProfile } = useProfile()
    const { notify } = useNotifications()

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["market", user?.id, activeProfile],
        queryFn: () => fetchMarketRecommendations(user!.id, activeProfile),
        enabled: Boolean(user?.id),
    })

    const recommendations = useMemo(() => data ?? [], [data])

    const applyInterest = (recommendation: MarketRecommendation) => {
        notify({
            title: "Ação registrada",
            description: `Você sinalizou interesse na proposta #${recommendation.id}.`,
            variant: "success",
        })
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Mercado</h1>
                    <p className="text-sm text-muted-foreground">
                        Explore oportunidades compatíveis com o seu perfil e diversifique negociações.
                    </p>
                </div>
                <Button variant="outline" onClick={() => refetch()}>
                    Atualizar recomendações
                </Button>
            </header>

            {isLoading && <p className="text-sm text-muted-foreground">Carregando sugestões...</p>}

            {!isLoading && recommendations.length === 0 && (
                <Card className="border-dashed border-primary/40">
                    <CardHeader>
                        <CardTitle>Nada encontrado por enquanto</CardTitle>
                        <CardDescription>
                            Ajuste suas preferências ou aguarde novas ofertas e solicitações do mercado.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommendations.map((item) => (
                    <MarketCard key={item.id} recommendation={item} onApply={() => applyInterest(item)} />
                ))}
            </section>
        </div>
    )
}

function MarketCard({
    recommendation,
    onApply,
}: {
    recommendation: MarketRecommendation
    onApply: () => void
}) {
    const label = recommendation.autor_tipo === "tomador" ? "Solicitação" : "Oferta"
    return (
        <Card className="border-border/70 bg-card/70">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground">
                        {label} #{recommendation.id}
                    </CardTitle>
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
                        {recommendation.status}
                    </span>
                </div>
                <CardDescription>
                    {recommendation.tipo ?? (recommendation.autor_tipo === "tomador" ? "Nova solicitação" : "Nova oferta")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
                <Info label="Valor" value={formatCurrency(recommendation.valor)} />
                <Info label="Taxa sugerida" value={`${recommendation.taxa_sugerida}%`} />
                <Info label="Prazo" value={`${recommendation.prazo_meses} meses`} />
                <Info label="Negociável" value={recommendation.negociavel ? "Sim" : "Não"} />
                {recommendation.justificativa && <Info label="Mensagem" value={recommendation.justificativa} />}
                <div className="pt-2">
                    <Button className="w-full" onClick={onApply}>
                        Demonstrar interesse
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function Info({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <p>
            <span className="font-semibold text-foreground">{label}:</span> {value ?? "—"}
        </p>
    )
}

function formatCurrency(value?: number | null) {
    if (!value) return "—"
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { useProfile } from "@/contexts/ProfileContext"
import { fetchNegotiationById } from "@/services/negotiations.service"
import { createProposal } from "@/services/proposals.service"
import { getRateRecommendation } from "@/services/rates.service"

const counterSchema = z.object({
    valor: z.coerce.number().positive("Informe um valor válido"),
    prazo_meses: z.coerce.number().min(1, "Prazo mínimo de 1 mês"),
    taxa_sugerida: z.coerce.number().min(0.01, "Informe uma taxa válida"),
    justificativa: z.string().optional(),
    negociavel: z.enum(["true", "false"]).default("true"),
})

type CounterValues = z.infer<typeof counterSchema>

export function CounterProposalPage() {
    const { user } = useAuth()
    const { activeProfile } = useProfile()
    const params = useParams()
    const negotiationId = Number(params.negotiationId)
    const { notify } = useNotifications()
    const navigate = useNavigate()
    const [loadingSuggestion, setLoadingSuggestion] = useState(false)
    const [loadingNegotiation, setLoadingNegotiation] = useState(true)

    const form = useForm<CounterValues>({
        resolver: zodResolver(counterSchema) as any,
        defaultValues: {
            valor: 0,
            prazo_meses: 0,
            taxa_sugerida: 0,
            justificativa: "",
            negociavel: "true",
        } as CounterValues,
    })

    useEffect(() => {
        const load = async () => {
            if (!negotiationId) return
            try {
                const negotiation = await fetchNegotiationById(negotiationId)
                form.reset({
                    valor: negotiation.valor ?? 0,
                    prazo_meses: negotiation.prazo ?? 0,
                    taxa_sugerida: negotiation.taxa ?? 0,
                    justificativa: "",
                    negociavel: "true",
                })
            } catch (error) {
                console.error(error)
                notify({
                    title: "Não foi possível carregar a negociação",
                    description: "Tente novamente em alguns instantes.",
                    variant: "destructive",
                })
            } finally {
                setLoadingNegotiation(false)
            }
        }
        void load()
    }, [form, negotiationId, notify])

    const sugerirTaxa = async () => {
        if (!user) return
        const { valor, prazo_meses } = form.getValues()
        if (!valor || !prazo_meses) {
            notify({
                title: "Preencha valor e prazo",
                description: "Esses dados são obrigatórios para sugerir taxas.",
                variant: "warning",
            })
            return
        }
        setLoadingSuggestion(true)
        try {
            const recomendacao = await getRateRecommendation({
                user_id: user.id,
                valor,
                prazo: prazo_meses,
                score: 700,
                tipo: activeProfile,
            })
            const faixaMatch = recomendacao.faixa_sugerida.match(/[0-9]+[.,]?[0-9]*/)
            if (faixaMatch) {
                const faixa = parseFloat(faixaMatch[0].replace(",", "."))
                if (!Number.isNaN(faixa)) {
                    form.setValue("taxa_sugerida", faixa, { shouldValidate: true })
                }
            }
            notify({
                title: "Sugestão atualizada",
                description: recomendacao.mensagem,
                variant: "info",
            })
        } catch (error) {
            console.error(error)
            notify({
                title: "Erro ao sugerir taxa",
                description: "Não conseguimos gerar a recomendação agora.",
                variant: "destructive",
            })
        } finally {
            setLoadingSuggestion(false)
        }
    }

    const onSubmit = async (values: CounterValues) => {
        if (!user || !negotiationId) return
        try {
            await createProposal({
                id_negociacoes: negotiationId,
                id_autor: user.id,
                autor_tipo: activeProfile,
                taxa_analisada: values.taxa_sugerida.toString(),
                taxa_sugerida: values.taxa_sugerida.toString(),
                prazo_meses: values.prazo_meses,
                status: "aguardando_resposta",
                negociavel: values.negociavel === "true",
                valor: values.valor,
                justificativa: values.justificativa,
                tipo: "contraproposta",
            })
            notify({
                title: "Contraproposta enviada",
                description: "A outra parte receberá uma notificação agora mesmo.",
                variant: "success",
            })
            navigate(`/negotiations/${negotiationId}`)
        } catch (error) {
            console.error(error)
            notify({
                title: "Erro ao enviar contraproposta",
                description: "Tente novamente após ajustar os dados.",
                variant: "destructive",
            })
        }
    }

    if (!negotiationId) {
        return <p className="text-sm text-destructive">Identificador da negociação inválido.</p>
    }

    if (loadingNegotiation) {
        return <p className="text-sm text-muted-foreground">Carregando dados da negociação...</p>
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Nova contraproposta</h1>
                <p className="text-sm text-muted-foreground">
                    Ajuste condições para buscar um ponto de acordo com a outra parte.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Parâmetros da contraproposta</CardTitle>
                        <CardDescription>Revise os dados antes de enviar.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="valor">Valor</Label>
                                <Input id="valor" type="number" step="0.01" {...form.register("valor", { valueAsNumber: true })} />
                                {form.formState.errors.valor && (
                                    <p className="text-sm text-destructive">{form.formState.errors.valor.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prazo_meses">Prazo (meses)</Label>
                                <Input id="prazo_meses" type="number" {...form.register("prazo_meses", { valueAsNumber: true })} />
                                {form.formState.errors.prazo_meses && (
                                    <p className="text-sm text-destructive">{form.formState.errors.prazo_meses.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="taxa_sugerida">Taxa sugerida (% a.m.)</Label>
                                <Input
                                    id="taxa_sugerida"
                                    type="number"
                                    step="0.01"
                                    {...form.register("taxa_sugerida", { valueAsNumber: true })}
                                />
                                {form.formState.errors.taxa_sugerida && (
                                    <p className="text-sm text-destructive">{form.formState.errors.taxa_sugerida.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="negociavel">Disponível para ajustes?</Label>
                                <select
                                    id="negociavel"
                                    className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    {...form.register("negociavel")}
                                >
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="justificativa">Mensagem (opcional)</Label>
                            <Textarea id="justificativa" rows={4} {...form.register("justificativa")} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Button type="button" variant="outline" onClick={sugerirTaxa} disabled={loadingSuggestion}>
                            {loadingSuggestion ? "Calculando..." : "Sugerir nova taxa"}
                        </Button>
                        <Button type="submit">Enviar contraproposta</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

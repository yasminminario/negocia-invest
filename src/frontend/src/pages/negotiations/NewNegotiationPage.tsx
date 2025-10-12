import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"

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
import { createProposal } from "@/services/proposals.service"
import { getRateRecommendation } from "@/services/rates.service"

const negotiationSchema = z.object({
    valor: z.coerce.number().positive("Informe um valor válido"),
    prazo_meses: z.coerce.number().min(1, "Prazo mínimo de 1 mês"),
    score: z.coerce.number().min(0).max(1000).optional(),
    justificativa: z.string().optional(),
    negociavel: z.enum(["true", "false"]).default("true"),
    // taxa_sugerida: string representation like "1.6-1.9" or "1.8"
    taxa_sugerida: z.string().optional(),
    // taxa_analisada: selected numeric value as string (ex: "1.8")
    taxa_analisada: z.string().optional(),
})

type NegotiationValues = z.infer<typeof negotiationSchema>

export function NewNegotiationPage() {
    const { user } = useAuth()
    const { activeProfile } = useProfile()
    const { notify } = useNotifications()
    const navigate = useNavigate()
    const [suggestion, setSuggestion] = useState<{ faixa: string; mercado: string; mensagem: string } | null>(null)
    const [loadingSuggestion, setLoadingSuggestion] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const form = useForm<NegotiationValues & { taxa_sugerida?: string; taxa_analisada?: string }>({
        resolver: zodResolver(negotiationSchema) as any,
        defaultValues: {
            valor: 50_000,
            prazo_meses: 24,
            score: undefined,
            justificativa: "",
            negociavel: "true",
            taxa_sugerida: "",
            taxa_analisada: "",
        } as NegotiationValues,
    })

    const gerarSugestao = async () => {
        if (!user) return
        const { valor, prazo_meses, score } = form.getValues()
        if (!valor || !prazo_meses) {
            notify({
                title: "Preencha os campos",
                description: "Informe valor e prazo para receber sugestões.",
                variant: "warning",
            })
            return
        }
        const normalizedScore = Number.isFinite(score) ? (score as number) : 650
        setLoadingSuggestion(true)
        try {
            const resposta = await getRateRecommendation({
                user_id: user.id,
                valor,
                prazo: prazo_meses,
                score: normalizedScore,
                tipo: activeProfile,
            })
            setSuggestion({
                faixa: resposta.faixa_sugerida,
                mercado: resposta.faixa_mercado,
                mensagem: resposta.mensagem,
            })
            // populate form fields: suggested faixa and default analyzed rate (use media_usuario if present)
            try {
                form.setValue("taxa_sugerida", resposta.faixa_sugerida ?? "")
                if ((resposta as any).media_usuario != null) {
                    const media = Number((resposta as any).media_usuario)
                    // clamp and format to one decimal place
                    const mediaStr = Number.isFinite(media) ? media.toFixed(1) : ""
                    form.setValue("taxa_analisada", mediaStr)
                }
            } catch (e) {
                // ignore form set errors
            }
            notify({
                title: "Sugestão de taxa pronta",
                description: "Utilize a faixa sugerida para fortalecer sua proposta.",
                variant: "info",
            })
        } catch (error) {
            console.error(error)
            notify({
                title: "Não foi possível sugerir taxas",
                description: "Tente novamente em instantes.",
                variant: "destructive",
            })
        } finally {
            setLoadingSuggestion(false)
        }
    }

    // auto-generate suggestion on mount (use defaults)
    useEffect(() => {
        void gerarSugestao()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit = async (values: NegotiationValues & { taxa_sugerida?: string; taxa_analisada?: string }) => {
        if (!user) return
        setSubmitting(true)
        try {
            await createProposal({
                id_autor: user.id,
                autor_tipo: activeProfile,
                // taxa_sugerida comes from the suggestion (faixa string). taxa_analisada is the value selected by the slider.
                taxa_analisada: (values.taxa_analisada ?? suggestion?.faixa ?? "").toString(),
                taxa_sugerida: "22",
                prazo_meses: values.prazo_meses,
                status: "pendente",
                negociavel: values.negociavel === "true",
                valor: values.valor,
                justificativa: values.justificativa,
                tipo: activeProfile === "tomador" ? "solicitacao" : "oferta",
            })
            notify({
                title: "Proposta enviada",
                description: "Ela ficará disponível para negociação imediata.",
                variant: "success",
            })
            navigate("/negotiations")
        } catch (error) {
            console.error(error)
            notify({
                title: "Erro ao enviar proposta",
                description: "Verifique os dados informados e tente novamente.",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                    {activeProfile === "tomador" ? "Nova solicitação de empréstimo" : "Nova oferta para investir"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    Utilize nossa análise de taxas para montar a melhor proposta possível e aumentar suas chances de acordo.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Dados da negociação</CardTitle>
                        <CardDescription>Informe os detalhes financeiros da sua proposta.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="valor">Valor desejado</Label>
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
                        <div className="space-y-2">
                            <Label htmlFor="score">Score estimado (opcional)</Label>
                            <Input id="score" type="number" {...form.register("score", { valueAsNumber: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="negociavel">Disponível para negociação?</Label>
                            <select
                                id="negociavel"
                                className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                {...form.register("negociavel")}
                            >
                                <option value="true">Sim, negociação aberta</option>
                                <option value="false">Não, proposta final</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="justificativa">Mensagem complementar</Label>
                            <Textarea
                                id="justificativa"
                                rows={4}
                                placeholder="Compartilhe informações relevantes para facilitar a aprovação."
                                {...form.register("justificativa")}
                            />
                        </div>

                        {/* Slider to pick taxa_analisada (1.1% - 10.0%) */}
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="taxa_analisada">Taxa analisada (% a.m.)</Label>
                            <div className="flex items-center gap-4">
                                <input
                                    id="taxa_analisada"
                                    type="range"
                                    min={1.1}
                                    max={10}
                                    step={0.1}
                                    value={Number(form.watch("taxa_analisada") || 0)}
                                    onChange={(e) => form.setValue("taxa_analisada", e.target.value)}
                                />
                                <div className="w-24 text-right">{form.watch("taxa_analisada") || "—"}%</div>
                            </div>
                            <p className="text-sm text-muted-foreground">Selecione a taxa que será analisada pelo sistema.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="text-sm text-muted-foreground">
                            {suggestion ? (
                                <p>
                                    Faixa sugerida: <span className="font-semibold text-foreground">{suggestion.faixa}</span> · Mercado: {" "}
                                    <span className="font-semibold text-foreground">{suggestion.mercado}</span>
                                </p>
                            ) : (
                                <p>Obtenha uma recomendação de taxa personalizada antes de enviar.</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button type="button" variant="outline" onClick={gerarSugestao} disabled={loadingSuggestion}>
                                {loadingSuggestion ? "Calculando..." : "Sugerir taxas"}
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Enviando..." : "Enviar proposta"}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

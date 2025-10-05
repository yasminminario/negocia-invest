import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { NegotiationSlider } from '@/components/negotiation/NegotiationSlider';
import { Slider } from '@/components/ui/slider';
import { formatCurrency, calculateMonthlyPayment, calculateTotalAmount, calculateEstimatedProfit } from '@/utils/calculations';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';

const CreateOffer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(8000);
  const [installments, setInstallments] = useState(25);
  const [interestRate, setInterestRate] = useState(10);
  const [acceptsNegotiation, setAcceptsNegotiation] = useState(true);

  const monthlyPayment = calculateMonthlyPayment(amount, interestRate, installments);
  const totalAmount = calculateTotalAmount(monthlyPayment, installments);
  const profit = calculateEstimatedProfit(amount, interestRate, installments);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      toast({
        title: "Oferta criada com sucesso!",
        description: "Tomadores qualificados poderão visualizar sua oferta.",
        className: "bg-positive-light border-positive/20",
      });
      setTimeout(() => navigate('/investor/find-requests'), 1500);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={handleBack} />
      
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>🔍</span>
            Encontrar solicitação
          </h1>
          <div className="text-sm text-muted-foreground">
            {step} de 4
          </div>
        </div>

        {/* Step 1: Amount */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-4 block">
                Quanto você quer ofertar?
              </label>
              <div className="text-4xl font-bold text-primary text-center my-8">
                {formatCurrency(amount)}
              </div>
              <Slider
                value={[amount]}
                onValueChange={(values) => setAmount(values[0])}
                min={100}
                max={20000}
                step={100}
                className="my-6"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$100,00</span>
                <span>R$20.000,00</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Installments */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-4 block">
                Qual a quantidade ideal de parcelas?
              </label>
              <div className="text-4xl font-bold text-primary text-center my-8">
                {installments}x
              </div>
              <Slider
                value={[installments]}
                onValueChange={(values) => setInstallments(values[0])}
                min={1}
                max={48}
                step={1}
                className="my-6"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1x</span>
                <span>48x</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Interest Rate */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-2xl border-2 border-primary/20 space-y-4">
              <h3 className="text-center text-sm font-medium text-muted-foreground">
                Qual seria a taxa de juros ideal?
              </h3>
              <NegotiationSlider
                value={interestRate}
                onChange={setInterestRate}
                min={1.25}
                max={10}
                suggestedMin={1.30}
                suggestedMax={3.0}
              />
            </div>

            <div className="p-4 rounded-lg bg-muted space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-5 h-5" />
                <span>Parcela mensal estimada:</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(monthlyPayment)}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Negotiation */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-4 block">
                Sua oferta estará aberta a negociações?
              </label>
              
              <div className="flex gap-4 my-6">
                <button
                  onClick={() => setAcceptsNegotiation(true)}
                  className={`flex-1 p-6 rounded-2xl border-2 transition-all ${
                    acceptsNegotiation
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-2">👍</div>
                  <div className="font-bold">Sim</div>
                </button>
                <button
                  onClick={() => setAcceptsNegotiation(false)}
                  className={`flex-1 p-6 rounded-2xl border-2 transition-all ${
                    !acceptsNegotiation
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-2">👎</div>
                  <div className="font-bold">Não</div>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="p-6 rounded-2xl border-2 bg-card space-y-3">
              <h3 className="font-bold mb-4">Resumo</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Taxa de juros</div>
                  <div className="font-bold text-primary">{interestRate.toFixed(2)}% a.m.</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Período</div>
                  <div className="font-semibold">{installments} m</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Parcela mensal</div>
                  <div className="font-semibold">{formatCurrency(monthlyPayment)}</div>
                </div>
              </div>
              <div className="pt-3 border-t flex justify-between">
                <span className="text-sm">Total:</span>
                <span className="font-bold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Valor ofertado:</span>
                <span className="font-bold">{formatCurrency(amount)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-success bg-success-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-success-foreground">
                  <span>💰</span>
                  <span>Lucro estimado:</span>
                </div>
                <div className="text-lg font-bold text-success">
                  {formatCurrency(profit)}
                </div>
              </div>
            </div>

            {!acceptsNegotiation && (
              <div className="p-4 rounded-xl border-2 border-warning/20 bg-warning-light flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">⚠️</span>
                </div>
                <div className="text-sm text-warning-foreground">
                  Esta taxa de juros é muito alta para o mercado. Sua oferta pode ficar muito tempo sem interessados.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleNext}
          className="w-full rounded-full py-6 text-lg font-semibold transition-all duration-200 hover-scale"
        >
          {step === 4 ? 'Criar oferta ✓' : 'Continuar →'}
        </Button>
      </main>
    </div>
  );
};

export default CreateOffer;

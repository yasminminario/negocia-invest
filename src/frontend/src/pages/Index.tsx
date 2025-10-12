import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/common/Header';
import { NegotiationSlider } from '@/components/negotiation/NegotiationSlider';
import { ComparisonCard } from '@/components/negotiation/ComparisonCard';
import { ImpactDisplay } from '@/components/negotiation/ImpactDisplay';
import { NegotiationTimer } from '@/components/negotiation/NegotiationTimer';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateMonthlyPayment, calculateTotalAmount, calculateSavings } from '@/utils/calculations';

const Index = () => {
  const { activeProfile, setActiveProfile } = useProfile();
  const navigate = useNavigate();
  const [interestRate, setInterestRate] = useState(1.5);
  const [message, setMessage] = useState('');

  // Dados mockados para exemplo
  const amount = 192000;
  const installments = 48;
  const currentRate = 1.38;
  const suggestedMin = 1.30;
  const suggestedMax = 3.0;
  const expiresAt = new Date(Date.now() + 47 * 60 * 60 * 1000 + 51 * 60 * 1000);

  // Cálculos
  const currentMonthly = calculateMonthlyPayment(amount, currentRate, installments);
  const currentTotal = calculateTotalAmount(currentMonthly, installments);
  const proposedMonthly = calculateMonthlyPayment(amount, interestRate, installments);
  const proposedTotal = calculateTotalAmount(proposedMonthly, installments);
  const savings = calculateSavings(amount, currentRate, interestRate, installments);

  // Simular login (removed - now using real auth)

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton />
      
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Demo Controls */}
        <div className="p-4 bg-muted rounded-lg space-y-4">
          <h2 className="font-bold">Demo Controls</h2>
          <div className="flex gap-2">
            <Button onClick={() => setActiveProfile('borrower')} variant={activeProfile === 'borrower' ? 'default' : 'outline'}>
              Tomador
            </Button>
            <Button onClick={() => setActiveProfile('investor')} variant={activeProfile === 'investor' ? 'default' : 'outline'}>
              Investidor
            </Button>
          </div>
          <Button onClick={() => navigate('/auth/login')} variant="secondary" className="w-full">
            Ir para Login
          </Button>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>🤝</span>
            Contraproposta
          </h1>
        </div>

        {/* Timer */}
        <NegotiationTimer expiresAt={expiresAt} />

        {/* Valor Ofertado */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">Valor ofertado:</span>
          <span className="text-lg font-bold text-primary">R$192.000,00</span>
        </div>

        {/* Comparação de Propostas */}
        <div className="grid grid-cols-2 gap-4">
          <ComparisonCard
            type="current"
            label={activeProfile === 'borrower' ? 'Oferta do Tomador' : 'Oferta do Investidor'}
            interestRate={currentRate}
            monthlyPayment={currentMonthly}
            totalAmount={currentTotal}
            highlightColor={activeProfile === 'borrower' ? 'borrower' : 'investor'}
          />
          <ComparisonCard
            type="proposed"
            label="Sua Proposta"
            interestRate={interestRate}
            monthlyPayment={proposedMonthly}
            totalAmount={proposedTotal}
          />
        </div>

        {/* Slider de Negociação */}
        <div className="p-6 bg-card rounded-2xl border-2 border-primary/20 space-y-4">
          <h3 className="text-center text-sm font-medium text-muted-foreground">
            Qual seria a taxa de juros ideal?
          </h3>
          <NegotiationSlider
            value={interestRate}
            onChange={setInterestRate}
            min={1.25}
            max={10}
            suggestedMin={suggestedMin}
            suggestedMax={suggestedMax}
          />
        </div>

        {/* Impact Display */}
        <ImpactDisplay
          type={activeProfile === 'borrower' ? 'savings' : 'profit'}
          value={Math.abs(savings)}
        />

        {/* Mensagem */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Descrição da contraproposta
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 300))}
            placeholder="Deixe uma mensagem para o tomador..."
            className="resize-none h-24"
            maxLength={300}
          />
          <div className="text-xs text-muted-foreground text-right">
            {message.length}/300
          </div>
        </div>

        {/* Botão de Ação */}
        <Button className="w-full rounded-full py-6 text-lg font-semibold">
          Enviar contraproposta →
        </Button>
      </main>
    </div>
  );
};

export default Index;

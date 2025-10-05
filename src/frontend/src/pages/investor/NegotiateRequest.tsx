import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { NegotiationSlider } from '@/components/negotiation/NegotiationSlider';
import { ComparisonCard } from '@/components/negotiation/ComparisonCard';
import { ImpactDisplay } from '@/components/negotiation/ImpactDisplay';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { mockLoanRequests, mockActiveLoansInvestor, mockNegotiations } from '@/data/mockData';
import { calculateMonthlyPayment, calculateTotalAmount, calculateEstimatedProfit } from '@/utils/calculations';
import { Send, CheckCircle2, MessageSquare, Handshake } from 'lucide-react';

export const NegotiateRequest: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const request = mockLoanRequests.find(r => r.id === id);
  
  // Check if there's an existing negotiation for this request
  const existingNegotiation = mockNegotiations.find(n => n.loanRequestId === id);
  const isCounterProposal = !!existingNegotiation;

  const [proposedRate, setProposedRate] = useState(request?.interestRate || 1.5);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!request) {
    return <div>Solicitação não encontrada</div>;
  }

  const currentMonthly = calculateMonthlyPayment(request.amount, request.interestRate, request.installments);
  const currentTotal = calculateTotalAmount(currentMonthly, request.installments);

  const proposedMonthly = calculateMonthlyPayment(request.amount, proposedRate, request.installments);
  const proposedTotal = calculateTotalAmount(proposedMonthly, request.installments);

  const currentProfit = calculateEstimatedProfit(request.amount, request.interestRate, request.installments);
  const proposedProfit = calculateEstimatedProfit(request.amount, proposedRate, request.installments);
  const profitDiff = proposedProfit - currentProfit;

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-md flex-1 flex flex-col">
          <h1 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
            <Handshake className="w-6 h-6" />
            Iniciar negociação
          </h1>

          {/* Success Message */}
          <div className="bg-success/10 border-2 border-success/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
            <p className="font-semibold text-success">Negociação criada com sucesso!</p>
          </div>

          <p className="text-center text-muted-foreground mb-8">
            Fique atento a suas <span className="font-semibold">notificações</span> e nas suas caixas de produtos ativos para acompanhar o andamento da sua negociação.
          </p>

          {/* Reminder Section */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-muted/50 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Lembre-se</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Você pode <span className="font-semibold text-foreground">acompanhar seus empréstimos, ou negociações</span> clicando em um dos seus produtos ativos.
              </p>
            </div>

            {/* Products Count */}
            <div className="mb-4">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Produtos <span className="text-primary font-semibold">ofertados</span> ativos
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl p-6 border-2 border-border text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{mockActiveLoansInvestor.length}</div>
                  <div className="text-sm text-muted-foreground">Empréstimos</div>
                </div>
                <div className="bg-card rounded-2xl p-6 border-2 border-border text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{mockNegotiations.length}</div>
                  <div className="text-sm text-muted-foreground">Negociações</div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate('/investor/dashboard')}
            className="w-full rounded-full py-6 text-lg"
          >
            Voltar para tela inicial
          </Button>
        </main>
      </div>
    );
  }

  // Suggested zone for investor (higher rates)
  const suggestedMin = 1.30;
  const suggestedMax = 3.0;

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate(isCounterProposal ? '/investor/negotiations' : '/investor/find-requests')} />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-primary">
          {isCounterProposal ? 'Detalhes da negociação' : 'Iniciar negociação'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isCounterProposal ? 'Envie uma contraproposta para' : 'Proponha uma taxa de juros para'} {request.borrower.name}
        </p>

        {/* Current vs Proposed */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <ComparisonCard
            type="current"
            label="Solicitação atual"
            interestRate={request.interestRate}
            monthlyPayment={currentMonthly}
            totalAmount={currentTotal}
          />
          <ComparisonCard
            type="proposed"
            label="Sua proposta"
            interestRate={proposedRate}
            monthlyPayment={proposedMonthly}
            totalAmount={proposedTotal}
          />
        </div>

        {/* Impact Display */}
        <ImpactDisplay
          type="profit"
          value={profitDiff}
          className="mb-6"
        />

        {/* Negotiation Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Propor taxa de juros:
          </label>
          <NegotiationSlider
            value={proposedRate}
            onChange={setProposedRate}
            min={1.25}
            max={10}
            step={0.01}
            suggestedMin={suggestedMin}
            suggestedMax={suggestedMax}
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Zona verde = maior chance de aceitação
          </p>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Mensagem (opcional)
          </label>
          <Textarea
            placeholder="Explique o motivo da sua proposta..."
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 300))}
            className="min-h-[100px] resize-none"
            maxLength={300}
          />
          <div className="text-xs text-muted-foreground text-right mt-1">
            {message.length}/300
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border">
          <p className="text-xs text-muted-foreground">
            💡 <span className="font-medium">Dica:</span> Propostas dentro da zona verde têm maior taxa de aceitação. 
            A negociação expira em 48 horas se não houver resposta.
          </p>
        </div>

        {/* Submit Button */}
        <Button 
          className="w-full h-14 text-base rounded-full"
          onClick={handleSubmit}
        >
          <Send className="mr-2 h-5 w-5" />
          {isCounterProposal ? 'Enviar contraproposta' : 'Enviar proposta'}
        </Button>
      </main>
    </div>
  );
};

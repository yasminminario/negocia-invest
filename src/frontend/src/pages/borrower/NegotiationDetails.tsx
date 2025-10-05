import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { ProposalHistoryCard } from '@/components/negotiation/ProposalHistoryCard';
import { NegotiationTimer } from '@/components/negotiation/NegotiationTimer';
import { NegotiationSlider } from '@/components/negotiation/NegotiationSlider';
import { ImpactDisplay } from '@/components/negotiation/ImpactDisplay';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { mockNegotiations } from '@/data/mockData';
import { calculateMonthlyPayment, calculateTotalAmount, calculateSavings, formatCurrency } from '@/utils/calculations';
import { Handshake, MessageSquare, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NegotiationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const negotiation = mockNegotiations.find((n) => n.id === id);

  const [counterRate, setCounterRate] = useState(negotiation?.currentRate || 1.5);
  const [message, setMessage] = useState('');
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCounterForm, setShowCounterForm] = useState(false);

  if (!negotiation) {
    return <div>Negociação não encontrada</div>;
  }

  const currentProposal = negotiation.proposals[negotiation.proposals.length - 1];
  const isMyTurn = negotiation.currentProposer === 'investor';

  const currentMonthly = calculateMonthlyPayment(
    negotiation.amount,
    negotiation.currentRate,
    negotiation.installments
  );
  const currentTotal = calculateTotalAmount(currentMonthly, negotiation.installments);

  const counterMonthly = calculateMonthlyPayment(
    negotiation.amount,
    counterRate,
    negotiation.installments
  );
  const counterTotal = calculateTotalAmount(counterMonthly, negotiation.installments);

  const savings = calculateSavings(
    negotiation.amount,
    negotiation.currentRate,
    counterRate,
    negotiation.installments
  );

  const handleAccept = () => {
    toast({
      title: 'Proposta aceita!',
      description: 'O empréstimo foi ativado com sucesso.',
      variant: 'borrower',
    });
    navigate('/borrower/loans');
  };

  const handleReject = () => {
    toast({
      title: 'Proposta rejeitada',
      description: 'A negociação foi encerrada.',
      variant: 'destructive',
    });
    navigate('/borrower/negotiations');
  };

  const handleCounter = () => {
    toast({
      title: 'Contraproposta enviada!',
      description: 'Aguardando resposta do investidor.',
      variant: 'borrower',
    });
    navigate('/borrower/negotiations');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/borrower/negotiations')} />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Handshake className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Detalhes da negociação</h1>
        </div>

        {/* Timer */}
        <NegotiationTimer expiresAt={negotiation.expiresAt} />

        {/* Negotiation Info */}
        <div className="p-4 rounded-lg bg-card border-2 border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Investidor</div>
              <div className="text-lg font-bold text-foreground">{negotiation.investorName}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-lg font-bold text-primary">{negotiation.investorScore}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Valor</div>
              <div className="font-semibold text-foreground">{formatCurrency(negotiation.amount)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Parcelas</div>
              <div className="font-semibold text-foreground">{negotiation.installments}x</div>
            </div>
          </div>
        </div>

        {/* Status */}
        {isMyTurn ? (
          <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary">
            <p className="text-sm font-medium text-primary text-center">
              É a sua vez! Você pode aceitar, rejeitar ou fazer uma contraproposta.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-muted border-2 border-border">
            <p className="text-sm font-medium text-muted-foreground text-center">
              Aguardando resposta do investidor...
            </p>
          </div>
        )}

        {/* Proposal History */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Histórico de propostas
          </h2>
          <div className="space-y-3">
            {negotiation.proposals.map((proposal, index) => (
              <ProposalHistoryCard
                key={proposal.id}
                proposal={proposal}
                proposerName={
                  proposal.proposerType === 'borrower'
                    ? negotiation.borrowerName
                    : negotiation.investorName
                }
                isCurrentUser={proposal.proposerType === 'borrower'}
                isLatest={index === negotiation.proposals.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        {isMyTurn && !showCounterForm && (
          <div className="space-y-3">
            <Button
              className="w-full h-14 text-base rounded-full"
              onClick={() => setShowAcceptDialog(true)}
            >
              <Check className="mr-2 h-5 w-5" />
              Aceitar proposta
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 text-base rounded-full"
              onClick={() => setShowCounterForm(true)}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Fazer contraproposta
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 text-base rounded-full border-status-cancelled text-status-cancelled hover:bg-status-cancelled/10"
              onClick={() => setShowRejectDialog(true)}
            >
              <X className="mr-2 h-5 w-5" />
              Rejeitar proposta
            </Button>
          </div>
        )}

        {/* Counter Proposal Form */}
        {showCounterForm && (
          <div className="space-y-6 p-6 rounded-lg bg-card border-2 border-primary">
            <h3 className="text-lg font-bold text-primary">Fazer contraproposta</h3>

            <ImpactDisplay
              type="savings"
              value={savings}
            />

            <NegotiationSlider
              value={counterRate}
              onChange={setCounterRate}
              min={1.25}
              max={10}
              suggestedMin={1.30}
              suggestedMax={3.0}
            />

            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted">
              <div>
                <div className="text-sm text-muted-foreground">Parcela mensal</div>
                <div className="font-bold text-foreground">{formatCurrency(counterMonthly)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="font-bold text-foreground">{formatCurrency(counterTotal)}</div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Mensagem (opcional)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                placeholder="Explique o motivo da sua contraproposta..."
                className="min-h-[100px] resize-none"
                maxLength={300}
              />
              <div className="text-xs text-muted-foreground text-right mt-1">
                {message.length}/300
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCounterForm(false)}
              >
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleCounter}>
                Enviar contraproposta
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Accept Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent className="border-borrower/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-borrower">Aceitar proposta?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está aceitando a taxa de {negotiation.currentRate.toFixed(2)}% a.m. com
              parcelas de {formatCurrency(currentMonthly)} por {negotiation.installments} meses.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept} className="bg-borrower hover:bg-borrower/90 text-borrower-foreground">
              Confirmar aceitação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="border-destructive/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Rejeitar proposta?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está rejeitando a negociação. Isso encerrará permanentemente esta negociação
              e você não poderá reativá-la. Tem certeza?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Confirmar rejeição
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NegotiationDetails;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Search, SlidersHorizontal, Handshake } from 'lucide-react';
import { mockNegotiations } from '@/data/mockData';
import { formatCurrency, formatInterestRate } from '@/utils/calculations';

const Negotiations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/borrower/dashboard')} />
      
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Handshake className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Negociações</h1>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar"
              className="pl-10"
            />
          </div>
          <button className="px-4 py-2 rounded-lg border-2 border-border hover:border-primary transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Negotiations List */}
        <div className="space-y-4">
          {mockNegotiations.map((negotiation) => (
            <div
              key={negotiation.id}
              onClick={() => navigate(`/borrower/negotiation/${negotiation.id}`)}
              className="bg-card rounded-xl p-4 border border-border cursor-pointer hover:border-primary transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {negotiation.investorName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{negotiation.investorName}</p>
                    <p className="text-xs text-muted-foreground">Score: {negotiation.investorScore}</p>
                  </div>
                </div>
                <StatusBadge status={negotiation.status} />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Taxa atual</p>
                  <p className="text-sm font-bold text-primary">
                    {formatInterestRate(negotiation.currentRate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Período</p>
                  <p className="text-sm font-bold text-foreground">
                    {negotiation.installments} meses
                  </p>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-between text-sm pt-3 border-t border-border">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(negotiation.amount)}
                </span>
              </div>
            </div>
          ))}
          
          {/* Empty state */}
          {mockNegotiations.length === 0 && (
            <div className="text-center py-12">
              <Handshake className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Nenhuma negociação ativa</p>
            </div>
          )}
          
          {/* End indicator */}
          {mockNegotiations.length > 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              😊 Acaba aqui
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Negotiations;

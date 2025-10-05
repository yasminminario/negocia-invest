import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { DonutChart } from '@/components/charts/DonutChart';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, TrendingDown, Handshake, Wallet } from 'lucide-react';
import { mockInvestorMetrics } from '@/data/mockData';
import { formatCurrency } from '@/utils/calculations';

const InvestorDashboard = () => {
  const { user, setActiveProfile } = useProfile();
  const navigate = useNavigate();
  const metrics = mockInvestorMetrics;

  const chartData = [
    {
      label: 'Score Bom',
      value: (metrics.totalInvested * metrics.portfolioDiversification.goodScore) / 100,
      color: 'hsl(var(--investor))',
    },
    {
      label: 'Score Excelente',
      value: (metrics.totalInvested * metrics.portfolioDiversification.excellentScore) / 100,
      color: 'hsl(var(--borrower))',
    },
  ];

  const actionCards = [
    {
      icon: Search,
      title: 'Encontrar solicitações',
      description: 'Explore solicitações de crédito',
      action: () => navigate('/investor/find-requests'),
    },
    {
      icon: TrendingUp,
      title: 'Empréstimos ativos',
      description: 'Acompanhe seus investimentos',
      action: () => navigate('/investor/loans'),
    },
    {
      icon: Handshake,
      title: 'Negociações',
      description: 'Veja suas negociações em andamento',
      action: () => navigate('/investor/negotiations'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome */}
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                Olá, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-muted-foreground">Acompanhe seus investimentos</p>
            </div>

            {/* Balance Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-2 border-primary/40">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Saldo em Conta</span>
              </div>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(user?.balance || 0)}
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-investor/10 to-investor/5 border-2 border-investor/30">
                <div className="text-sm text-muted-foreground mb-1">Rentabilidade</div>
                <div className="text-2xl font-bold text-investor">{metrics.returnPercentage}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-positive/10 to-positive/5 border-2 border-positive/30">
                <div className="text-sm text-muted-foreground mb-1">Lucro Total</div>
                <div className="text-xl font-bold text-positive">{formatCurrency(metrics.totalReturn)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30">
                <div className="text-sm text-muted-foreground mb-1">Investido</div>
                <div className="text-xl font-bold text-primary">{formatCurrency(metrics.totalInvested)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-border">
                <div className="text-sm text-muted-foreground mb-1">Empréstimos</div>
                <div className="text-2xl font-bold">{metrics.activeLoans}</div>
              </div>
            </div>

            {/* Quick Action */}
            <Button
              onClick={() => navigate('/investor/create-offer')}
              className="w-full rounded-full py-6 text-lg font-semibold hover:scale-[1.02] transition-transform"
            >
              + Ofertar empréstimo
            </Button>

            {/* Action Cards */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Acesso rápido</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {actionCards.map((card, index) => (
                  <button
                    key={index}
                    onClick={card.action}
                    className="w-full p-4 rounded-2xl border-2 border-border hover:border-primary/50 transition-all bg-card text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <card.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{card.title}</div>
                        <div className="text-sm text-muted-foreground">{card.description}</div>
                      </div>
                      <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Chart & Info */}
          <div className="space-y-6">
            {/* Diversification Chart */}
            <div className="p-6 rounded-2xl border-2 bg-card sticky top-6">
              <h3 className="font-bold mb-4">Diversificação da carteira</h3>
              <DonutChart data={chartData} />
            </div>

            {/* Profile Switch */}
            <Button
              onClick={() => {
                setActiveProfile('borrower');
                navigate('/borrower/dashboard');
              }}
              variant="outline"
              className="w-full rounded-full bg-borrower/5 border-borrower text-borrower hover:bg-borrower/20 hover:border-borrower transition-colors"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Trocar para Tomador
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvestorDashboard;

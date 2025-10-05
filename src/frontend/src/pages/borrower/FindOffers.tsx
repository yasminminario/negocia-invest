import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { LoanCard } from '@/components/common/LoanCard';
import { LoanCardSkeleton } from '@/components/common/LoanCardSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterDialog } from '@/components/filters/FilterDialog';
import { useFilters } from '@/hooks/useFilters';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { mockLoanOffers } from '@/data/mockData';

const FindOffers = () => {
  const navigate = useNavigate();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    filteredAndSortedItems,
    resetFilters,
  } = useFilters(mockLoanOffers);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const hasActiveFilters = 
    filters.minAmount !== 1000 ||
    filters.maxAmount !== 500000 ||
    filters.minRate !== 0.5 ||
    filters.maxRate !== 5 ||
    filters.minInstallments !== 6 ||
    filters.maxInstallments !== 60 ||
    filters.minScore !== 300;

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={() => navigate('/borrower/dashboard')} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Search className="w-6 h-6 text-borrower" />
          <h1 className="text-2xl md:text-3xl font-bold text-borrower">Encontrar ofertas</h1>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome, valor ou ID"
              className="pl-10 h-12 rounded-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFilterDialogOpen(true)}
            className={`h-12 w-12 rounded-full ${hasActiveFilters ? 'border-primary' : ''}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Active Filters Badge */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-2">
              Filtros ativos
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={resetFilters}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedItems.length} oferta{filteredAndSortedItems.length !== 1 ? 's' : ''} encontrada{filteredAndSortedItems.length !== 1 ? 's' : ''}
        </div>

        {/* Offers Grid (Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <LoanCardSkeleton key={i} />
              ))}
            </>
          ) : filteredAndSortedItems.length === 0 ? (
            <div className="col-span-full text-center py-12 animate-fade-in">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Nenhuma oferta encontrada</p>
              <Button
                variant="outline"
                className="mt-4 rounded-full transition-all duration-200 hover-scale"
                onClick={resetFilters}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <>
              {filteredAndSortedItems.map((offer) => (
                <LoanCard
                  key={offer.id}
                  id={offer.id}
                  name={offer.investor.name}
                  score={offer.investor.scoreValue}
                  interestRate={offer.interestRate}
                  installments={offer.installments}
                  monthlyPayment={offer.monthlyPayment}
                  total={offer.totalAmount}
                  amount={offer.amount}
                  status={offer.status}
                  onClick={() => navigate(`/borrower/offer/${offer.id}`)}
                  className="transition-all duration-200 hover-scale animate-fade-in"
                />
              ))}
              
              {/* End indicator */}
              <div className="col-span-full text-center text-sm text-muted-foreground py-4">
                😊 Acaba aqui
              </div>
            </>
          )}
        </div>
      </main>

      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onApply={setFilters}
        onReset={resetFilters}
      />
    </div>
  );
};

export default FindOffers;

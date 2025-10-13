import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { LoanCard } from '@/components/common/LoanCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterDialog } from '@/components/filters/FilterDialog';
import { useFilters } from '@/hooks/useFilters';
import { Search, SlidersHorizontal, X, EyeOff, Eye } from 'lucide-react';
import { useLoanRequests } from '@/hooks/useLoanRequests';

const FindRequests = () => {
  const navigate = useNavigate();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const {
    requests,
    loading: isLoading,
    hideRequest,
    hiddenRequestIds,
    restoreHiddenRequests,
    error,
    refetch,
  } = useLoanRequests();

  const {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    filteredAndSortedItems,
    resetFilters,
  } = useFilters(requests);

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
      <Header showBackButton onBack={() => navigate('/investor/dashboard')} />

      <main className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Search className="w-6 h-6 text-investor" />
          <h1 className="text-2xl md:text-3xl font-bold text-investor">Encontrar solicitações</h1>
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
        {(hasActiveFilters || hiddenRequestIds.length > 0) && (
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
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
            )}
            {hiddenRequestIds.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-2">
                {hiddenRequestIds.length} solicitaç{hiddenRequestIds.length > 1 ? 'ões' : 'ão'} ocultada{hiddenRequestIds.length > 1 ? 's' : ''}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={restoreHiddenRequests}
                  aria-label="Mostrar solicitações ocultas"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}

        {/* Results Count / Error */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedItems.length} solicitaç{filteredAndSortedItems.length !== 1 ? 'ões' : 'ão'} encontrada{filteredAndSortedItems.length !== 1 ? 's' : ''}
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <span>{error}</span>
              <Button size="sm" variant="outline" className="rounded-full h-8" onClick={refetch}>
                Tentar novamente
              </Button>
            </div>
          )}
        </div>

        {/* Requests Grid (Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p className="text-muted-foreground">Carregando solicitações...</p>
            </div>
          ) : filteredAndSortedItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
              <Button
                variant="outline"
                className="mt-4 rounded-full"
                onClick={resetFilters}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <>
              {filteredAndSortedItems.map((request) => (
                <div key={request.id} className="relative group">
                  <LoanCard
                    id={request.id}
                    name={request.borrower.name}
                    score={request.borrower.scoreValue}
                    interestRate={request.interestRate}
                    installments={request.installments}
                    monthlyPayment={request.monthlyPayment}
                    total={request.totalAmount}
                    amount={request.amount}
                    status={request.acceptsNegotiation ? 'negotiable' : 'fixed'}
                    onClick={() => navigate(`/investor/request/${request.id}`)}
                    tone="investor"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Ocultar solicitação"
                    onClick={(event) => {
                      event.stopPropagation();
                      hideRequest(request.id);
                    }}
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
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

export default FindRequests;

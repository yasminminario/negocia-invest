import { useState, useMemo } from 'react';
import { FilterValues } from '@/components/filters/FilterDialog';
import { LoanOffer, LoanRequest } from '@/types';

const DEFAULT_FILTERS: FilterValues = {
  minAmount: 1000,
  maxAmount: 500000,
  minRate: 0.5,
  maxRate: 5,
  minInstallments: 6,
  maxInstallments: 60,
  minScore: 300,
  sortBy: 'recent',
  sortOrder: 'desc',
};

export const useFilters = <T extends LoanOffer | LoanRequest>(items: T[]) => {
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Apply filters
    result = result.filter((item) => {
      // Amount filter
      if (item.amount < filters.minAmount || item.amount > filters.maxAmount) {
        return false;
      }

      // Rate filter
      if (item.interestRate < filters.minRate || item.interestRate > filters.maxRate) {
        return false;
      }

      // Installments filter
      if (
        item.installments < filters.minInstallments ||
        item.installments > filters.maxInstallments
      ) {
        return false;
      }

      // Score filter
      const score = 'investor' in item ? item.investor.scoreValue : item.borrower.scoreValue;
      if (score < filters.minScore) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = 'investor' in item ? item.investor.name : item.borrower.name;
        const matchesName = name.toLowerCase().includes(query);
        const matchesAmount = item.amount.toString().includes(query);
        const matchesId = item.id.toLowerCase().includes(query);

        if (!matchesName && !matchesAmount && !matchesId) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'rate':
          comparison = a.interestRate - b.interestRate;
          break;
        case 'installments':
          comparison = a.installments - b.installments;
          break;
        case 'score':
          const scoreA = 'investor' in a ? a.investor.scoreValue : a.borrower.scoreValue;
          const scoreB = 'investor' in b ? b.investor.scoreValue : b.borrower.scoreValue;
          comparison = scoreA - scoreB;
          break;
        case 'recent':
          comparison = b.createdAt.getTime() - a.createdAt.getTime();
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [items, filters, searchQuery]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  };

  return {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    filteredAndSortedItems,
    resetFilters,
  };
};

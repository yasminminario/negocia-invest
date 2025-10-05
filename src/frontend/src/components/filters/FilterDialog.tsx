import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/calculations';

export interface FilterValues {
  minAmount: number;
  maxAmount: number;
  minRate: number;
  maxRate: number;
  minInstallments: number;
  maxInstallments: number;
  minScore: number;
  sortBy: 'amount' | 'rate' | 'installments' | 'score' | 'recent';
  sortOrder: 'asc' | 'desc';
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
  onReset: () => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  const handleApply = () => {
    onApply(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    onReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Range */}
          <div className="space-y-3">
            <Label>Valor do empréstimo</Label>
            <div className="space-y-2">
              <Slider
                value={[localFilters.minAmount, localFilters.maxAmount]}
                onValueChange={([min, max]) =>
                  setLocalFilters({ ...localFilters, minAmount: min, maxAmount: max })
                }
                min={1000}
                max={500000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(localFilters.minAmount)}</span>
                <span>{formatCurrency(localFilters.maxAmount)}</span>
              </div>
            </div>
          </div>

          {/* Interest Rate Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Taxa de juros (% a.m.)</Label>
              <span className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-500"></span>
                Zona sugerida: 1.5% - 2.5%
              </span>
            </div>
            <div className="space-y-2">
              <div className="relative">
                {/* Suggested zone background */}
                <div 
                  className="absolute h-2 rounded-full bg-green-100 dark:bg-green-950 border border-green-300 dark:border-green-800"
                  style={{
                    left: `${((1.5 - 0.5) / (5 - 0.5)) * 100}%`,
                    width: `${((2.5 - 1.5) / (5 - 0.5)) * 100}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 0
                  }}
                />
                <Slider
                  value={[localFilters.minRate, localFilters.maxRate]}
                  onValueChange={([min, max]) =>
                    setLocalFilters({ ...localFilters, minRate: min, maxRate: max })
                  }
                  min={0.5}
                  max={5}
                  step={0.1}
                  className="w-full relative z-10"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{localFilters.minRate.toFixed(1)}%</span>
                <span>{localFilters.maxRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Installments Range */}
          <div className="space-y-3">
            <Label>Número de parcelas</Label>
            <div className="space-y-2">
              <Slider
                value={[localFilters.minInstallments, localFilters.maxInstallments]}
                onValueChange={([min, max]) =>
                  setLocalFilters({ ...localFilters, minInstallments: min, maxInstallments: max })
                }
                min={6}
                max={60}
                step={6}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{localFilters.minInstallments}x</span>
                <span>{localFilters.maxInstallments}x</span>
              </div>
            </div>
          </div>

          {/* Score Filter */}
          <div className="space-y-3">
            <Label>Score mínimo</Label>
            <Slider
              value={[localFilters.minScore]}
              onValueChange={([value]) =>
                setLocalFilters({ ...localFilters, minScore: value })
              }
              min={300}
              max={1000}
              step={50}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground text-center">
              {localFilters.minScore}+
            </div>
          </div>

          {/* Sort Options */}
          <div className="space-y-3">
            <Label>Ordenar por</Label>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={localFilters.sortBy}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, sortBy: value as FilterValues['sortBy'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="amount">Valor</SelectItem>
                  <SelectItem value="rate">Taxa de juros</SelectItem>
                  <SelectItem value="installments">Parcelas</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={localFilters.sortOrder}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, sortOrder: value as FilterValues['sortOrder'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Crescente</SelectItem>
                  <SelectItem value="desc">Decrescente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Limpar
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

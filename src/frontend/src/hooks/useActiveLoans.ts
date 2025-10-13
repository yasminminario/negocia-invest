import { useCallback, useEffect, useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { negociacoesApi, usuariosApi } from '@/services/api.service';
import {
  calculateIntermediationFee,
  calculateInterestAmount,
  calculateMonthlyPayment,
  calculateTotalAmount,
} from '@/utils/calculations';
import type { ActiveLoan, LoanStatus, NegociacaoResponse, Usuario } from '@/types';

const STATUS_MAP: Record<string, LoanStatus> = {
  em_andamento: 'active',
  finalizada: 'concluded',
  cancelada: 'cancelled',
  em_negociacao: 'active',
  pendente: 'active',
  aceita: 'active',
};

const mapStatus = (status: string): LoanStatus => {
  return STATUS_MAP[status] ?? 'active';
};

const buildLoan = (
  negotiation: NegociacaoResponse,
  borrower: Usuario | null,
  investor: Usuario | null,
): ActiveLoan => {
  const amount = negotiation.valor ?? 0;
  const installments = negotiation.prazo ?? 0;
  const interestRate = negotiation.taxa ?? 0;
  const monthlyPayment = negotiation.parcela ?? calculateMonthlyPayment(amount, interestRate, installments || 1);
  const totalAmount = installments ? calculateTotalAmount(monthlyPayment, installments) : monthlyPayment;
  const interestAmount = calculateInterestAmount(totalAmount, amount);
  const intermediationFee = calculateIntermediationFee(amount);

  const startDate = negotiation.criado_em ? new Date(negotiation.criado_em) : new Date();
  const endDate = new Date(startDate);
  if (installments) {
    endDate.setMonth(endDate.getMonth() + installments);
  }

  return {
    id: String(negotiation.id),
    loanRequestId: undefined,
    loanOfferId: undefined,
    borrowerId: String(negotiation.id_tomador),
    borrowerName: borrower?.nome ?? `Usuário #${negotiation.id_tomador}`,
    investorId: String(negotiation.id_investidor),
    investorName: investor?.nome ?? `Usuário #${negotiation.id_investidor}`,
    amount,
    interestRate,
    installments,
    monthlyPayment,
    totalAmount,
    interestAmount,
    intermediationFee,
    status: mapStatus(negotiation.status),
    startDate,
    endDate,
  };
};

export const useActiveLoans = (userType: 'borrower' | 'investor') => {
  const { user } = useProfile();
  const [loans, setLoans] = useState<ActiveLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = useCallback(async () => {
    if (!user?.id) {
      setLoans([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const negociacoes = userType === 'borrower'
        ? await negociacoesApi.listarPorTomador(user.id)
        : await negociacoesApi.listarPorInvestidor(user.id);

      if (!negociacoes.length) {
        setLoans([]);
        return;
      }

      const uniqueUserIds = new Set<number>();
      negociacoes.forEach((neg) => {
        uniqueUserIds.add(neg.id_tomador);
        uniqueUserIds.add(neg.id_investidor);
      });

      const usuarios = await Promise.all(
        Array.from(uniqueUserIds).map(async (id) => {
          try {
            return await usuariosApi.obterPorId(id);
          } catch (err) {
            console.warn('Não foi possível carregar usuário', id, err);
            return null;
          }
        })
      );

      const usuariosMap = new Map<number, Usuario>();
      usuarios.forEach((item) => {
        if (item) {
          usuariosMap.set(item.id, item);
        }
      });

      const mapped = negociacoes.map((neg) =>
        buildLoan(neg, usuariosMap.get(neg.id_tomador) ?? null, usuariosMap.get(neg.id_investidor) ?? null),
      );

      setLoans(mapped);
    } catch (err) {
      console.error('Error loading loans:', err);
      const message = err instanceof Error ? err.message : 'Erro ao carregar empréstimos.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id, userType]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return { loans, loading, error, refetch: fetchLoans };
};

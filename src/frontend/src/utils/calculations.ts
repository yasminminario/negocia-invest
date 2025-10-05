/**
 * Calcula a parcela mensal de um empréstimo usando a fórmula Price
 * PMT = P * [i(1 + i)^n] / [(1 + i)^n - 1]
 */
export const calculateMonthlyPayment = (
  principal: number,
  monthlyRatePercent: number,
  installments: number
): number => {
  const monthlyRate = monthlyRatePercent / 100;
  
  if (monthlyRate === 0) {
    return principal / installments;
  }
  
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, installments)) /
    (Math.pow(1 + monthlyRate, installments) - 1);
  
  return Math.round(payment * 100) / 100;
};

/**
 * Calcula o valor total do empréstimo (parcela * número de parcelas)
 */
export const calculateTotalAmount = (
  monthlyPayment: number,
  installments: number
): number => {
  return Math.round(monthlyPayment * installments * 100) / 100;
};

/**
 * Calcula o total de juros pagos
 */
export const calculateInterestAmount = (
  totalAmount: number,
  principal: number
): number => {
  return Math.round((totalAmount - principal) * 100) / 100;
};

/**
 * Calcula a taxa de intermediação (4% do valor principal)
 */
export const calculateIntermediationFee = (
  principal: number,
  feePercentage: number = 4
): number => {
  return Math.round((principal * feePercentage / 100) * 100) / 100;
};

/**
 * Calcula o lucro estimado para o investidor
 */
export const calculateEstimatedProfit = (
  principal: number,
  monthlyRate: number,
  installments: number
): number => {
  const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, installments);
  const totalAmount = calculateTotalAmount(monthlyPayment, installments);
  return calculateInterestAmount(totalAmount, principal);
};

/**
 * Calcula a economia ao reduzir a taxa de juros (para o tomador)
 */
export const calculateSavings = (
  principal: number,
  oldRate: number,
  newRate: number,
  installments: number
): number => {
  const oldMonthly = calculateMonthlyPayment(principal, oldRate, installments);
  const newMonthly = calculateMonthlyPayment(principal, newRate, installments);
  const oldTotal = calculateTotalAmount(oldMonthly, installments);
  const newTotal = calculateTotalAmount(newMonthly, installments);
  return Math.round((oldTotal - newTotal) * 100) / 100;
};

/**
 * Formata valor em reais
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata taxa de juros (ex: 1.5% a.m.)
 */
export const formatInterestRate = (rate: number): string => {
  return `${rate.toFixed(2).replace('.', ',')}% a.m.`;
};

/**
 * Calcula o tempo restante de uma negociação em horas e minutos
 */
export const calculateTimeRemaining = (expiresAt: Date): string => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return '00:00';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

import {
  User,
  LoanRequest,
  LoanOffer,
  ActiveLoan,
  Negotiation,
  InvestorMetrics,
} from '@/types';
import {
  calculateMonthlyPayment,
  calculateTotalAmount,
  calculateInterestAmount,
  calculateIntermediationFee,
} from '@/utils/calculations';

// ============= MOCK USERS =============

export const mockBorrower: User = {
  id: 'user-borrower-1',
  name: 'Carlos Silva',
  email: 'carlos@example.com',
  creditScore: 'excellent',
  scoreValue: 850,
  activeProfile: 'borrower',
  balance: 15750.80,
};

export const mockInvestor: User = {
  id: 'user-investor-1',
  name: 'Sofia Mendes',
  email: 'sofia@example.com',
  creditScore: 'excellent',
  scoreValue: 920,
  activeProfile: 'investor',
  balance: 42500.50,
};

// ============= MOCK LOAN REQUESTS =============

// Calculando valores reais para req-1: R$ 10.000 com 1,5% a.m. por 12 meses
const req1Amount = 10000;
const req1Rate = 1.5;
const req1Installments = 12;
const req1Monthly = calculateMonthlyPayment(req1Amount, req1Rate, req1Installments);
const req1Total = calculateTotalAmount(req1Monthly, req1Installments);

// Calculando valores reais para req-2: R$ 25.000 com 2,2% a.m. por 18 meses
const req2Amount = 25000;
const req2Rate = 2.2;
const req2Installments = 18;
const req2Monthly = calculateMonthlyPayment(req2Amount, req2Rate, req2Installments);
const req2Total = calculateTotalAmount(req2Monthly, req2Installments);

export const mockLoanRequests: LoanRequest[] = [
  {
    id: 'req-1',
    borrowerId: 'user-borrower-1',
    borrower: {
      id: 'user-borrower-1',
      name: 'Carlos Silva',
      email: 'carlos@example.com',
      creditScore: 'excellent',
      scoreValue: 850,
      activeProfile: 'borrower',
    },
    amount: req1Amount,
    interestRate: req1Rate,
    installments: req1Installments,
    monthlyPayment: req1Monthly,
    totalAmount: req1Total,
    status: 'negotiable',
    createdAt: new Date('2025-10-01'),
    acceptsNegotiation: true,
    suggestedRateMin: 1.1,
    suggestedRateMax: 2.5,
  },
  {
    id: 'req-2',
    borrowerId: 'user-borrower-2',
    borrower: {
      id: 'user-borrower-2',
      name: 'Alberto N. Silva',
      email: 'alberto@example.com',
      creditScore: 'good',
      scoreValue: 597,
      activeProfile: 'borrower',
    },
    amount: req2Amount,
    interestRate: req2Rate,
    installments: req2Installments,
    monthlyPayment: req2Monthly,
    totalAmount: req2Total,
    status: 'fixed',
    createdAt: new Date('2025-09-28'),
    acceptsNegotiation: false,
    suggestedRateMin: 1.8,
    suggestedRateMax: 3.0,
  },
];

// ============= MOCK LOAN OFFERS =============

// Calculando valores reais para offer-1: R$ 50.000 com 1,8% a.m. por 24 meses
const offer1Amount = 50000;
const offer1Rate = 1.8;
const offer1Installments = 24;
const offer1Monthly = calculateMonthlyPayment(offer1Amount, offer1Rate, offer1Installments);
const offer1Total = calculateTotalAmount(offer1Monthly, offer1Installments);

// Calculando valores reais para offer-2: R$ 100.000 com 1,3% a.m. por 36 meses
const offer2Amount = 100000;
const offer2Rate = 1.3;
const offer2Installments = 36;
const offer2Monthly = calculateMonthlyPayment(offer2Amount, offer2Rate, offer2Installments);
const offer2Total = calculateTotalAmount(offer2Monthly, offer2Installments);

export const mockLoanOffers: LoanOffer[] = [
  {
    id: 'offer-1',
    investorId: 'user-investor-1',
    investor: {
      id: 'user-investor-1',
      name: 'Sofia Mendes',
      email: 'sofia@example.com',
      creditScore: 'excellent',
      scoreValue: 920,
      activeProfile: 'investor',
    },
    amount: offer1Amount,
    interestRate: offer1Rate,
    installments: offer1Installments,
    monthlyPayment: offer1Monthly,
    totalAmount: offer1Total,
    status: 'negotiable',
    createdAt: new Date('2025-09-25'),
    acceptsNegotiation: true,
    suggestedRateMin: 1.1,
    suggestedRateMax: 3.0,
  },
  {
    id: 'offer-2',
    investorId: 'user-investor-2',
    investor: {
      id: 'user-investor-2',
      name: 'QI Tech',
      email: 'qi@example.com',
      creditScore: 'excellent',
      scoreValue: 983,
      activeProfile: 'investor',
    },
    amount: offer2Amount,
    interestRate: offer2Rate,
    installments: offer2Installments,
    monthlyPayment: offer2Monthly,
    totalAmount: offer2Total,
    status: 'negotiable',
    createdAt: new Date('2025-09-20'),
    acceptsNegotiation: true,
    suggestedRateMin: 1.0,
    suggestedRateMax: 2.5,
  },
];

// ============= MOCK ACTIVE LOANS =============

// Calculando valores reais para loan-1: R$ 75.000 com 1,4% a.m. por 36 meses
const loan1Amount = 75000;
const loan1Rate = 1.4;
const loan1Installments = 36;
const loan1Monthly = calculateMonthlyPayment(loan1Amount, loan1Rate, loan1Installments);
const loan1Total = calculateTotalAmount(loan1Monthly, loan1Installments);
const loan1Interest = calculateInterestAmount(loan1Total, loan1Amount);
const loan1Fee = calculateIntermediationFee(loan1Amount);

// Calculando valores reais para loan-2: R$ 30.000 com 1,6% a.m. por 18 meses
const loan2Amount = 30000;
const loan2Rate = 1.6;
const loan2Installments = 18;
const loan2Monthly = calculateMonthlyPayment(loan2Amount, loan2Rate, loan2Installments);
const loan2Total = calculateTotalAmount(loan2Monthly, loan2Installments);
const loan2Interest = calculateInterestAmount(loan2Total, loan2Amount);
const loan2Fee = calculateIntermediationFee(loan2Amount);

export const mockActiveLoansBorrower: ActiveLoan[] = [
  {
    id: 'loan-1',
    loanRequestId: 'req-1',
    borrowerId: 'user-borrower-1',
    borrowerName: 'Carlos Silva',
    investorId: 'user-investor-1',
    investorName: 'QI Tech',
    amount: loan1Amount,
    interestRate: loan1Rate,
    installments: loan1Installments,
    monthlyPayment: loan1Monthly,
    totalAmount: loan1Total,
    interestAmount: loan1Interest,
    intermediationFee: loan1Fee,
    status: 'active',
    startDate: new Date('2025-09-01'),
    endDate: new Date('2028-09-01'),
  },
  {
    id: 'loan-2',
    loanRequestId: 'req-2',
    borrowerId: 'user-borrower-1',
    borrowerName: 'Carlos Silva',
    investorId: 'user-investor-2',
    investorName: 'BTG Pactual',
    amount: loan2Amount,
    interestRate: loan2Rate,
    installments: loan2Installments,
    monthlyPayment: loan2Monthly,
    totalAmount: loan2Total,
    interestAmount: loan2Interest,
    intermediationFee: loan2Fee,
    status: 'cancelled',
    startDate: new Date('2025-08-01'),
    endDate: new Date('2026-02-01'),
  },
];

// Calculando valores reais para loan-3: R$ 15.000 com 1,7% a.m. por 12 meses
const loan3Amount = 15000;
const loan3Rate = 1.7;
const loan3Installments = 12;
const loan3Monthly = calculateMonthlyPayment(loan3Amount, loan3Rate, loan3Installments);
const loan3Total = calculateTotalAmount(loan3Monthly, loan3Installments);
const loan3Interest = calculateInterestAmount(loan3Total, loan3Amount);
const loan3Fee = calculateIntermediationFee(loan3Amount);

// Calculando valores reais para loan-4: R$ 45.000 com 1,2% a.m. por 24 meses
const loan4Amount = 45000;
const loan4Rate = 1.2;
const loan4Installments = 24;
const loan4Monthly = calculateMonthlyPayment(loan4Amount, loan4Rate, loan4Installments);
const loan4Total = calculateTotalAmount(loan4Monthly, loan4Installments);
const loan4Interest = calculateInterestAmount(loan4Total, loan4Amount);
const loan4Fee = calculateIntermediationFee(loan4Amount);

export const mockActiveLoansInvestor: ActiveLoan[] = [
  {
    id: 'loan-3',
    loanOfferId: 'offer-1',
    borrowerId: 'user-borrower-3',
    borrowerName: 'Alberto N. Silva',
    investorId: 'user-investor-1',
    investorName: 'Sofia Mendes',
    amount: loan3Amount,
    interestRate: loan3Rate,
    installments: loan3Installments,
    monthlyPayment: loan3Monthly,
    totalAmount: loan3Total,
    interestAmount: loan3Interest,
    intermediationFee: loan3Fee,
    status: 'active',
    startDate: new Date('2025-09-15'),
    endDate: new Date('2026-09-15'),
  },
  {
    id: 'loan-4',
    loanOfferId: 'offer-2',
    borrowerId: 'user-borrower-4',
    borrowerName: 'Marcela Santos',
    investorId: 'user-investor-1',
    investorName: 'Sofia Mendes',
    amount: loan4Amount,
    interestRate: loan4Rate,
    installments: loan4Installments,
    monthlyPayment: loan4Monthly,
    totalAmount: loan4Total,
    interestAmount: loan4Interest,
    intermediationFee: loan4Fee,
    status: 'concluded',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2026-08-01'),
  },
];

// ============= MOCK NEGOTIATIONS =============

// Calculando valores reais para neg-1: R$ 80.000 por 30 meses
const neg1Amount = 80000;
const neg1Installments = 30;
const neg1Rate1 = 1.6; // Taxa inicial proposta pelo investidor
const neg1Rate2 = 1.45; // Contraproposta do tomador
const neg1Monthly1 = calculateMonthlyPayment(neg1Amount, neg1Rate1, neg1Installments);
const neg1Total1 = calculateTotalAmount(neg1Monthly1, neg1Installments);
const neg1Monthly2 = calculateMonthlyPayment(neg1Amount, neg1Rate2, neg1Installments);
const neg1Total2 = calculateTotalAmount(neg1Monthly2, neg1Installments);

export const mockNegotiations: Negotiation[] = [
  {
    id: 'neg-1',
    loanRequestId: 'req-1',
    borrowerId: 'user-borrower-1',
    borrowerName: 'Carlos Silva',
    borrowerScore: 850,
    investorId: 'user-investor-1',
    investorName: 'Sofia Mendes',
    investorScore: 920,
    amount: neg1Amount,
    installments: neg1Installments,
    currentRate: neg1Rate2,
    currentProposer: 'borrower',
    proposals: [
      {
        id: 'prop-1',
        proposerId: 'user-investor-1',
        proposerType: 'investor',
        proposedRate: neg1Rate1,
        message: 'Olá! Gostaria de propor esta taxa considerando seu excelente perfil de crédito.',
        createdAt: new Date('2025-10-03T10:00:00'),
        monthlyPayment: neg1Monthly1,
        totalAmount: neg1Total1,
      },
      {
        id: 'prop-2',
        proposerId: 'user-borrower-1',
        proposerType: 'borrower',
        proposedRate: neg1Rate2,
        message: 'Aceito reduzir um pouco. Que tal 1.45%?',
        createdAt: new Date('2025-10-04T14:30:00'),
        monthlyPayment: neg1Monthly2,
        totalAmount: neg1Total2,
      },
    ],
    status: 'em_negociacao',
    createdAt: new Date('2025-10-03T10:00:00'),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 horas a partir de agora
    suggestedRateMin: 1.2,
    suggestedRateMax: 2.2,
  },
];

// ============= MOCK INVESTOR METRICS =============

export const mockInvestorMetrics: InvestorMetrics = {
  totalInvested: 500000,
  totalReturn: 75000,
  returnPercentage: 15.0,
  activeLoans: 12,
  portfolioDiversification: {
    goodScore: 40,
    excellentScore: 60,
  },
};

export const calculateMonthly = (principal: number, annualRatePercent: number, months: number) => {
    if (months <= 0) return 0;
    const monthlyRate = annualRatePercent / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    return principal * (numerator / denominator);
};

export const totalPayment = (monthly: number, months: number) => {
    return monthly * months;
};

export const totalInterest = (principal: number, totalPaid: number) => {
    return totalPaid - principal;
};

import { MortgageInputs, MortgageResults, AnnualAmortization, PaymentBreakdownMonthly } from '../types';

export function toCurrency(n: number): number {
  return Math.round(n * 100) / 100;
}

export function sanitizeInputs(raw: MortgageInputs): Required<MortgageInputs> {
  const homePrice = Math.max(0, Number(raw.homePrice) || 0);
  const downPaymentIsPercent = !!raw.downPaymentIsPercent;
  let downPayment = Math.max(0, Number(raw.downPayment) || 0);
  if (downPaymentIsPercent) {
    downPayment = (downPayment / 100) * homePrice;
  }
  const principal = Math.max(0, homePrice - downPayment);

  const loanTermYears = Math.max(1, Math.floor(Number(raw.loanTermYears) || 30));
  const annualInterestRate = Math.max(0, Number(raw.annualInterestRate) || 0);

  const propertyTaxIsPercent = !!raw.propertyTaxIsPercent;
  let propertyTaxAnnual = Math.max(0, Number(raw.propertyTaxAnnual) || 0);
  if (propertyTaxIsPercent) {
    propertyTaxAnnual = (propertyTaxAnnual / 100) * homePrice;
  }

  const homeInsuranceAnnual = Math.max(0, Number(raw.homeInsuranceAnnual) || 0);
  const includeHOA = !!raw.includeHOA;
  const hoaMonthly = includeHOA ? Math.max(0, Number(raw.hoaMonthly) || 0) : 0;

  const grossMonthlyIncome = Math.max(0, Number(raw.grossMonthlyIncome) || 0);
  const monthlyDebtPayments = Math.max(0, Number(raw.monthlyDebtPayments) || 0);

  return {
    homePrice,
    downPayment,
    downPaymentIsPercent,
    loanTermYears,
    annualInterestRate,
    propertyTaxAnnual,
    propertyTaxIsPercent,
    homeInsuranceAnnual,
    hoaMonthly,
    includeHOA,
    grossMonthlyIncome,
    monthlyDebtPayments,
  };
}

export function monthlyPaymentPI(principal: number, annualRatePct: number, years: number): number {
  if (principal <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return toCurrency(principal / n);
  const pmt = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  return toCurrency(pmt);
}

export function amortizationScheduleMonthly(
  principal: number,
  annualRatePct: number,
  years: number
): PaymentBreakdownMonthly[] {
  const schedule: PaymentBreakdownMonthly[] = [];
  let balance = principal;
  const n = years * 12;
  const pmt = monthlyPaymentPI(principal, annualRatePct, years);
  const r = annualRatePct / 100 / 12;
  for (let m = 1; m <= n; m++) {
    const interest = toCurrency(balance * r);
    const principalPortion = toCurrency(Math.min(pmt - interest, balance));
    balance = toCurrency(balance - principalPortion);
    schedule.push({
      month: m,
      interest,
      principal: principalPortion,
      remainingBalance: Math.max(0, balance),
      totalPAndI: pmt,
    });
  }
  return schedule;
}

export function amortizationAnnual(
  principal: number,
  annualRatePct: number,
  years: number
): AnnualAmortization[] {
  const monthly = amortizationScheduleMonthly(principal, annualRatePct, years);
  const byYear: AnnualAmortization[] = [];
  for (let y = 1; y <= years; y++) {
    const start = (y - 1) * 12;
    const slice = monthly.slice(start, start + 12);
    const totalInterest = toCurrency(slice.reduce((s, r) => s + r.interest, 0));
    const totalPrincipal = toCurrency(slice.reduce((s, r) => s + r.principal, 0));
    const endingBalance = slice.length ? slice[slice.length - 1].remainingBalance : 0;
    byYear.push({ year: y, totalInterest, totalPrincipal, endingBalance });
  }
  return byYear;
}

export function computeResults(raw: MortgageInputs): MortgageResults {
  const input = sanitizeInputs(raw);
  const principal = Math.max(0, input.homePrice - input.downPayment);
  const monthlyPI = monthlyPaymentPI(principal, input.annualInterestRate, input.loanTermYears);

  const monthlyTax = toCurrency(input.propertyTaxAnnual / 12);
  const monthlyInsurance = toCurrency(input.homeInsuranceAnnual / 12);
  const monthlyHOA = toCurrency(input.hoaMonthly || 0);

  const totalMonthly = toCurrency(monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA);

  const amortization = amortizationAnnual(principal, input.annualInterestRate, input.loanTermYears);
  const totalInterestPaid = toCurrency(amortization.reduce((s, a) => s + a.totalInterest, 0));
  const totalCostOverTerm = toCurrency(
    monthlyPI * input.loanTermYears * 12 + // total P&I
      input.propertyTaxAnnual * input.loanTermYears +
      input.homeInsuranceAnnual * input.loanTermYears +
      monthlyHOA * 12 * input.loanTermYears
  );

  let dti: MortgageResults['dti'] = undefined;
  if (input.grossMonthlyIncome > 0) {
    const totalDebts = totalMonthly + input.monthlyDebtPayments;
    const ratio = totalDebts / input.grossMonthlyIncome;
    const recommendedMaxPayment = toCurrency(input.grossMonthlyIncome * 0.3);
    let warning: string | null = null;
    if (ratio > 0.43) warning = 'Warning: DTI exceeds 43% (common underwriting cap).';
    else if (ratio > 0.36) warning = 'Caution: DTI above 36% may limit options.';
    else if (totalMonthly > recommendedMaxPayment)
      warning = 'Monthly payment exceeds 30% of income guideline.';
    dti = { ratio, warning, recommendedMaxPayment };
  }

  return {
    monthlyPI,
    monthlyTax,
    monthlyInsurance,
    monthlyHOA,
    totalMonthly,
    totalCostOverTerm,
    totalInterestPaid,
    amortizationAnnual: amortization,
    dti,
  };
}

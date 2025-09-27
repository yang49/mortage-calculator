export type RateType = 'fixed' | 'adjustable';

export interface MortgageInputs {
  homePrice: number; // total price of the home
  downPayment: number; // amount in dollars
  downPaymentIsPercent?: boolean; // if true, downPayment is % (0-100)
  loanTermYears: number;
  annualInterestRate: number; // percent, e.g., 6.5
  propertyTaxAnnual: number; // annual amount in dollars or percent if propertyTaxIsPercent
  propertyTaxIsPercent?: boolean; // if true, tax is % of home price
  homeInsuranceAnnual: number; // dollars
  hoaMonthly?: number; // dollars
  includeHOA?: boolean;
  grossMonthlyIncome?: number; // for DTI guidance
  monthlyDebtPayments?: number; // other debts
}

export interface PaymentBreakdownMonthly {
  month: number; // 1..N
  interest: number;
  principal: number;
  remainingBalance: number;
  totalPAndI: number;
}

export interface AnnualAmortization {
  year: number; // 1..loanTermYears
  totalInterest: number;
  totalPrincipal: number;
  endingBalance: number;
}

export interface MortgageResults {
  monthlyPI: number; // principal + interest
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalMonthly: number;
  totalCostOverTerm: number;
  totalInterestPaid: number;
  amortizationAnnual: AnnualAmortization[];
  dti?: {
    ratio: number; // 0..1
    warning: string | null;
    recommendedMaxPayment: number | null;
  };
}

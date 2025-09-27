import React from 'react';
import { MortgageInputs } from '../types';

interface Props {
  values: MortgageInputs;
  onChange: (update: Partial<MortgageInputs>) => void;
}

export default function InputForm({ values, onChange }: Props) {
  const handleNumber = (key: keyof MortgageInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange({ [key]: v === '' ? ('' as unknown as number) : Number(v) } as Partial<MortgageInputs>);
  };

  const handleCheckbox = (key: keyof MortgageInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [key]: e.target.checked } as Partial<MortgageInputs>);
  };

  const handlePercentToggle = (key: keyof MortgageInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [key]: e.target.checked } as Partial<MortgageInputs>);
  };

  return (
    <form className="card" aria-label="Mortgage Inputs" onSubmit={(e)=> e.preventDefault()}>
      <h2>Mortgage Inputs</h2>

      <div className="form-row">
        <label htmlFor="homePrice">Home price</label>
        <input id="homePrice" type="number" min={0} value={values.homePrice}
               onChange={handleNumber('homePrice')} />
      </div>

      <div className="form-row">
        <label htmlFor="downPayment">Down payment {values.downPaymentIsPercent ? '(%)' : '($)'} </label>
        <input id="downPayment" type="number" min={0} value={values.downPayment}
               onChange={handleNumber('downPayment')} />
        <label className="inline">
          <input type="checkbox" checked={!!values.downPaymentIsPercent}
                 onChange={handlePercentToggle('downPaymentIsPercent')} />
          Enter as %
        </label>
      </div>

      <div className="form-row">
        <label htmlFor="term">Loan term (years)</label>
        <input id="term" type="number" min={1} step={1} value={values.loanTermYears}
               onChange={handleNumber('loanTermYears')} />
      </div>

      <div className="form-row">
        <label htmlFor="rate">Interest rate (%)</label>
        <input id="rate" type="number" min={0} step={0.01} value={values.annualInterestRate}
               onChange={handleNumber('annualInterestRate')} />
      </div>

      <div className="form-row">
        <label htmlFor="tax">Property tax {values.propertyTaxIsPercent ? '(%)' : '(annual $)'} </label>
        <input id="tax" type="number" min={0} step={0.01} value={values.propertyTaxAnnual}
               onChange={handleNumber('propertyTaxAnnual')} />
        <label className="inline">
          <input type="checkbox" checked={!!values.propertyTaxIsPercent}
                 onChange={handlePercentToggle('propertyTaxIsPercent')} />
          Enter as % of price
        </label>
      </div>

      <div className="form-row">
        <label htmlFor="ins">Home insurance (annual $)</label>
        <input id="ins" type="number" min={0} step={1} value={values.homeInsuranceAnnual}
               onChange={handleNumber('homeInsuranceAnnual')} />
      </div>

      <div className="form-row">
        <label className="inline">
          <input type="checkbox" checked={!!values.includeHOA} onChange={handleCheckbox('includeHOA')} />
          Include HOA/maintenance
        </label>
        <input aria-label="HOA monthly" type="number" min={0} step={1} disabled={!values.includeHOA}
               value={values.hoaMonthly ?? 0}
               onChange={handleNumber('hoaMonthly')} />
      </div>

      <fieldset className="fieldset">
        <legend>Affordability (optional)</legend>
        <div className="form-row">
          <label htmlFor="income">Gross monthly income</label>
          <input id="income" type="number" min={0} step={1} value={values.grossMonthlyIncome ?? 0}
                 onChange={handleNumber('grossMonthlyIncome')} />
        </div>
        <div className="form-row">
          <label htmlFor="debts">Other monthly debt payments</label>
          <input id="debts" type="number" min={0} step={1} value={values.monthlyDebtPayments ?? 0}
                 onChange={handleNumber('monthlyDebtPayments')} />
        </div>
      </fieldset>

      <p className="help">All values update instantly. Negative inputs are clamped to zero.</p>
    </form>
  );
}

import React from 'react';
import { MortgageInputs } from '../types';
import MoneyInput from './MoneyInput';
import { trackEvent } from '../analytics';

interface Props {
  values: MortgageInputs;
  onChange: (update: Partial<MortgageInputs>) => void;
}

export default function InputForm({ values, onChange }: Props) {

  const handleNumber = (key: keyof MortgageInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange({ [key]: v === '' ? ('' as unknown as number) : Number(v) } as Partial<MortgageInputs>);
    const numeric = v === '' ? 0 : Number(v);
    trackEvent('number_input_change', { field: String(key), value: numeric });
  };

  const handleCheckbox = (key: keyof MortgageInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [key]: e.target.checked } as Partial<MortgageInputs>);
    trackEvent('toggle_change', { field: String(key), value: e.target.checked });
  };

  const handlePercentToggle = (key: keyof MortgageInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [key]: e.target.checked } as Partial<MortgageInputs>);
    trackEvent('toggle_change', { field: String(key), value: e.target.checked });
  };

  const onMoney = (key: keyof MortgageInputs) => (val: number) => onChange({ [key]: val } as Partial<MortgageInputs>);
  const onMoneyCommit = (key: keyof MortgageInputs) => (val: number) =>
    trackEvent('money_input_commit', { field: String(key), value: val });

  return (
    <form className="card" aria-label="Mortgage Inputs" onSubmit={(e)=> e.preventDefault()}>
      <h2>Mortgage Inputs</h2>

      <div className="form-row">
        <label htmlFor="homePrice">Home price</label>
        <MoneyInput id="homePrice" value={values.homePrice} onChange={onMoney('homePrice')} onCommit={onMoneyCommit('homePrice')} allowDecimals={false} />
      </div>

      <div className="form-row">
        <label htmlFor="downPayment">Down payment {values.downPaymentIsPercent ? '(%)' : '($)'} </label>
        {values.downPaymentIsPercent ? (
          <input id="downPayment" type="number" min={0} value={values.downPayment}
                 onChange={handleNumber('downPayment')} />
        ) : (
          <MoneyInput id="downPayment" value={values.downPayment} onChange={onMoney('downPayment')} onCommit={onMoneyCommit('downPayment')} allowDecimals={false} />
        )}
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
        {values.propertyTaxIsPercent ? (
          <input id="tax" type="number" min={0} step={0.01} value={values.propertyTaxAnnual}
                 onChange={handleNumber('propertyTaxAnnual')} />
        ) : (
          <MoneyInput id="tax" value={values.propertyTaxAnnual} onChange={onMoney('propertyTaxAnnual')} onCommit={onMoneyCommit('propertyTaxAnnual')} allowDecimals={true} />
        )}
        <label className="inline">
          <input type="checkbox" checked={!!values.propertyTaxIsPercent}
                 onChange={handlePercentToggle('propertyTaxIsPercent')} />
          Enter as % of price
        </label>
      </div>

      <div className="form-row">
        <label htmlFor="ins">Home insurance (annual $)</label>
        <MoneyInput id="ins" value={values.homeInsuranceAnnual} onChange={onMoney('homeInsuranceAnnual')} onCommit={onMoneyCommit('homeInsuranceAnnual')} allowDecimals={false} />
      </div>

      <div className="form-row">
        <label className="inline">
          <input type="checkbox" checked={!!values.includeHOA} onChange={handleCheckbox('includeHOA')} />
          Include HOA/maintenance
        </label>
        <MoneyInput aria-label="HOA monthly" disabled={!values.includeHOA}
                    value={values.hoaMonthly ?? 0}
                    onChange={onMoney('hoaMonthly')}
                    onCommit={onMoneyCommit('hoaMonthly')} allowDecimals={false} />
      </div>

      <fieldset className="fieldset">
        <legend>Affordability (optional)</legend>
        <div className="form-row">
          <label htmlFor="income">Gross monthly income</label>
          <MoneyInput id="income" value={values.grossMonthlyIncome ?? 0} onChange={onMoney('grossMonthlyIncome')} onCommit={onMoneyCommit('grossMonthlyIncome')} allowDecimals={false} />
        </div>
        <div className="form-row">
          <label htmlFor="debts">Other monthly debt payments</label>
          <MoneyInput id="debts" value={values.monthlyDebtPayments ?? 0} onChange={onMoney('monthlyDebtPayments')} onCommit={onMoneyCommit('monthlyDebtPayments')} allowDecimals={false} />
        </div>
      </fieldset>

      <p className="help">All values update instantly. Negative inputs are clamped to zero.</p>
    </form>
  );
}

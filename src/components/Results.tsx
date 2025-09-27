import React from 'react';
import { MortgageResults } from '../types';

function fmtCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n || 0);
}

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

interface Props {
  results: MortgageResults;
}

export default function Results({ results }: Props) {
  return (
    <section className="card" aria-label="Results">
      <h2>Results</h2>
      <div className="results-grid">
        <div className="result">
          <div className="label">Monthly P&I</div>
          <div className="value">{fmtCurrency(results.monthlyPI)}</div>
        </div>
        <div className="result">
          <div className="label">Monthly Tax</div>
          <div className="value">{fmtCurrency(results.monthlyTax)}</div>
        </div>
        <div className="result">
          <div className="label">Monthly Insurance</div>
          <div className="value">{fmtCurrency(results.monthlyInsurance)}</div>
        </div>
        <div className="result">
          <div className="label">Monthly HOA</div>
          <div className="value">{fmtCurrency(results.monthlyHOA)}</div>
        </div>
        <div className="result highlight">
          <div className="label">Total Monthly</div>
          <div className="value big">{fmtCurrency(results.totalMonthly)}</div>
        </div>
      </div>

      <div className="totals-row">
        <div>
          <div className="label">Total interest over term</div>
          <div className="value">{fmtCurrency(results.totalInterestPaid)}</div>
        </div>
        <div>
          <div className="label">Total cost over term</div>
          <div className="value">{fmtCurrency(results.totalCostOverTerm)}</div>
        </div>
      </div>

      {results.dti && (
        <div className="dti card-subtle" role="note" aria-live="polite">
          <div>
            <strong>DTI:</strong> {pct(results.dti.ratio)}
          </div>
          {results.dti.recommendedMaxPayment !== null && (
            <div>
              <strong>30% guideline:</strong> {fmtCurrency(results.dti.recommendedMaxPayment)}
            </div>
          )}
          {results.dti.warning && (
            <div className="warning" role="alert">{results.dti.warning}</div>
          )}
        </div>
      )}
    </section>
  );
}

import React from 'react';
import { AnnualAmortization } from '../types';

function fmtCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
}

interface Props {
  data: AnnualAmortization[];
}

export default function AmortizationTable({ data }: Props) {
  return (
    <section className="card" aria-label="Amortization schedule">
      <h2>Amortization (annual)</h2>
      <div className="table-wrapper">
        <table className="table" role="table">
          <thead>
            <tr>
              <th scope="col">Year</th>
              <th scope="col">Principal</th>
              <th scope="col">Interest</th>
              <th scope="col">Ending Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{fmtCurrency(row.totalPrincipal)}</td>
                <td>{fmtCurrency(row.totalInterest)}</td>
                <td>{fmtCurrency(row.endingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

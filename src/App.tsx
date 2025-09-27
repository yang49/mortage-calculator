import React from 'react';
import './App.css';
import { MortgageInputs } from './types';
import { computeResults } from './utils/calc';
import InputForm from './components/InputForm';
import Results from './components/Results';
import AmortizationTable from './components/AmortizationTable';

function App() {
  const [inputs, setInputs] = React.useState<MortgageInputs>({
    homePrice: 500000,
    downPayment: 20,
    downPaymentIsPercent: true,
    loanTermYears: 30,
    annualInterestRate: 6.5,
    propertyTaxAnnual: 1.1,
    propertyTaxIsPercent: true,
    homeInsuranceAnnual: 1200,
    includeHOA: true,
    hoaMonthly: 150,
    grossMonthlyIncome: 10000,
    monthlyDebtPayments: 500,
  });

  const onChange = (update: Partial<MortgageInputs>) => {
    setInputs((prev) => ({ ...prev, ...update }));
  };

  const results = computeResults(inputs);

  return (
    <div className="app-container">
      <header className="topbar">
        <h1>Mortgage Calculator</h1>
        <p className="subtitle">Instant results with amortization and affordability guidance</p>
      </header>
      <main className="grid">
        <div className="left">
          <InputForm values={inputs} onChange={onChange} />
        </div>
        <div className="right">
          <Results results={results} />
          <AmortizationTable data={results.amortizationAnnual} />
        </div>
      </main>
      <footer className="footer">
        <small>All calculations are estimates. Consult a lender for exact figures.</small>
      </footer>
    </div>
  );
}

export default App;

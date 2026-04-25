import React, { useState, useEffect } from 'react';
import { DollarSign, Info, TrendingUp } from 'lucide-react';

function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [ratePerAnnum, setRatePerAnnum] = useState(7.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, ratePerAnnum, tenure]);

  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = ratePerAnnum / 12 / 100;
    const months = tenure * 12;

    if (rate === 0) {
      const emiValue = principal / months;
      setEmi(emiValue.toFixed(2));
      setTotalPayable(principal.toFixed(2));
      setTotalInterest(0);
      return;
    }

    const emiValue = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalPayableValue = emiValue * months;
    const totalInterestValue = totalPayableValue - principal;

    setEmi(emiValue.toFixed(2));
    setTotalPayable(totalPayableValue.toFixed(2));
    setTotalInterest(totalInterestValue.toFixed(2));
  };

  const getAmortizationSchedule = () => {
    const principal = loanAmount;
    const rate = ratePerAnnum / 12 / 100;
    const months = tenure * 12;
    const emiValue = parseFloat(emi);

    let balance = principal;
    const schedule = [];

    for (let i = 1; i <= Math.min(months, 12); i++) {
      const interestPayment = balance * rate;
      const principalPayment = emiValue - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month: i,
        emi: emiValue.toFixed(2),
        principal: principalPayment.toFixed(2),
        interest: interestPayment.toFixed(2),
        balance: Math.max(0, balance).toFixed(2)
      });
    }

    return schedule;
  };

  const amortizationSchedule = getAmortizationSchedule();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <DollarSign size={32} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">EMI Calculator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl">Calculate your monthly EMI for home loan, personal loan, or any installment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calculator Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <Info size={24} className="text-blue-400" />
                Loan Details
              </h2>

              <div className="space-y-8">
                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-slate-300 font-semibold">Loan Amount (NPR)</label>
                    <span className="text-xl font-bold text-blue-400">{loanAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="50000000"
                    step="100000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>1 Lakh</span>
                    <span>5 Crore</span>
                  </div>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                    className="w-full mt-3 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter loan amount"
                  />
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-slate-300 font-semibold">Interest Rate (% per annum)</label>
                    <span className="text-xl font-bold text-green-400">{ratePerAnnum.toFixed(2)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={ratePerAnnum}
                    onChange={(e) => setRatePerAnnum(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                  <input
                    type="number"
                    value={ratePerAnnum}
                    onChange={(e) => setRatePerAnnum(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    className="w-full mt-3 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter interest rate"
                  />
                </div>

                {/* Tenure */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-slate-300 font-semibold">Loan Tenure (Years)</label>
                    <span className="text-xl font-bold text-purple-400">{tenure} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>1 Year</span>
                    <span>40 Years</span>
                  </div>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(parseInt(e.target.value) || 1)}
                    className="w-full mt-3 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tenure in years"
                  />
                </div>
              </div>
            </div>

            {/* Amortization Schedule */}
            {amortizationSchedule.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp size={24} className="text-blue-400" />
                  First Year Amortization
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-700/50 border-b border-slate-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-slate-300 font-semibold">Month</th>
                        <th className="px-4 py-3 text-right text-slate-300 font-semibold">EMI</th>
                        <th className="px-4 py-3 text-right text-slate-300 font-semibold">Principal</th>
                        <th className="px-4 py-3 text-right text-slate-300 font-semibold">Interest</th>
                        <th className="px-4 py-3 text-right text-slate-300 font-semibold">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {amortizationSchedule.map((row, idx) => (
                        <tr key={idx} className="text-slate-300 hover:bg-slate-700/30">
                          <td className="px-4 py-3">{row.month}</td>
                          <td className="px-4 py-3 text-right font-semibold text-blue-400">₹{parseFloat(row.emi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="px-4 py-3 text-right text-green-400">₹{parseFloat(row.principal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="px-4 py-3 text-right text-red-400">₹{parseFloat(row.interest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="px-4 py-3 text-right font-semibold text-purple-400">₹{parseFloat(row.balance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {/* EMI Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-blue-100 mb-6">Monthly Payment</h3>
              <div>
                <p className="text-blue-200 text-sm font-medium mb-2">Monthly EMI</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">₹</span>
                  <span className="text-3xl font-bold text-yellow-300">{parseFloat(emi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary Cards */}
            <div className="space-y-4">
              {/* Total Payable */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
                <p className="text-slate-300 text-sm font-medium mb-2">Total Amount Payable</p>
                <p className="text-2xl font-bold text-white">₹{parseFloat(totalPayable).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-slate-400 mt-2">Over {tenure} years</p>
              </div>

              {/* Total Interest */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
                <p className="text-slate-300 text-sm font-medium mb-2">Total Interest Payable</p>
                <p className="text-2xl font-bold text-red-400">₹{parseFloat(totalInterest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-slate-400 mt-2">{((parseFloat(totalInterest) / loanAmount) * 100).toFixed(1)}% of principal</p>
              </div>

              {/* Loan Amount */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
                <p className="text-slate-300 text-sm font-medium mb-2">Principal Amount</p>
                <p className="text-2xl font-bold text-green-400">₹{loanAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>

            {/* Information */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">📊 Information</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <p>This calculator helps you estimate your monthly EMI (Equated Monthly Installment).</p>
                <p className="text-xs text-slate-400">Note: Actual EMI may vary based on bank policies, processing fees, and insurance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EMICalculator;

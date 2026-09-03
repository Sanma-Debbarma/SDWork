import React, { useState } from 'react';
import { DollarSign, ArrowDownToLine, TrendingUp, ShieldCheck, Wallet, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const EarningsView: React.FC = () => {
  const [withdrawnSuccess, setWithdrawnSuccess] = useState(false);

  const transactions = [
    {
      id: 'tx-1',
      project: 'YouTube Tech Review Dynamic Motion Edit',
      client: 'Marques Media Labs',
      date: 'Today, 2:40 PM',
      amount: '+$1,200.00',
      status: 'Cleared',
    },
    {
      id: 'tx-2',
      project: 'Minimalist Fintech Brand Identity Kit',
      client: 'AuraPay Capital',
      date: 'Yesterday',
      amount: '+$825.00',
      status: 'In Escrow',
    },
    {
      id: 'tx-3',
      project: 'iOS Habit Tracker UI/UX Prototype',
      client: 'Zenith Health Labs',
      date: 'Aug 28, 2026',
      amount: '+$2,400.00',
      status: 'Cleared',
    },
    {
      id: 'tx-4',
      project: 'Withdrawal to Chase Bank (****4912)',
      client: 'Direct Deposit',
      date: 'Aug 24, 2026',
      amount: '-$3,500.00',
      status: 'Completed',
    },
    {
      id: 'tx-5',
      project: 'E-commerce Headless Storefront',
      client: 'Nordic Apparel Co.',
      date: 'Aug 19, 2026',
      amount: '+$4,200.00',
      status: 'Cleared',
    },
  ];

  const handleWithdraw = () => {
    setWithdrawnSuccess(true);
    setTimeout(() => setWithdrawnSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>Freelancer Earnings</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Channel revenue, escrow balances, and direct payouts for Ani Vex
          </p>
        </div>

        <button
          onClick={handleWithdraw}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95 self-start sm:self-auto"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Withdraw Available Funds</span>
        </button>
      </div>

      {withdrawnSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Withdrawal of $4,250.00 initiated to your connected primary account (Chase ****4912).</span>
        </div>
      )}

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Total Revenue Earned</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">$18,450.00</div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1.5 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% from last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold text-emerald-900">Available for Payout</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">$4,250.00</div>
          <span className="text-[11px] text-gray-500 block mt-1.5">
            Instant withdrawal ready
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">In Escrow / Milestone</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">$3,600.00</div>
          <span className="text-[11px] text-blue-600 font-medium block mt-1.5">
            Protected across 3 active jobs
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Pending Clearance</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">$2,800.00</div>
          <span className="text-[11px] text-gray-500 block mt-1.5">
            Releases within 2-3 business days
          </span>
        </div>
      </div>

      {/* Monthly Bar Chart Breakdown */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Earnings Overview (2026)</h3>
          <span className="text-xs text-gray-500">Average: $3,690 / month</span>
        </div>

        <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-gray-100">
          {[
            { month: 'Mar', amount: 2400, height: '40%' },
            { month: 'Apr', amount: 3100, height: '52%' },
            { month: 'May', amount: 3800, height: '64%' },
            { month: 'Jun', amount: 2900, height: '48%' },
            { month: 'Jul', amount: 4500, height: '76%' },
            { month: 'Aug', amount: 5900, height: '98%', highlight: true },
            { month: 'Sep (Est)', amount: 4250, height: '72%' },
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10.5px] font-semibold text-gray-600 opacity-0 group-hover:opacity-100 transition">
                ${bar.amount}
              </span>
              <div
                className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 ${
                  bar.highlight ? 'bg-purple-600 shadow-sm' : 'bg-purple-200 hover:bg-purple-300'
                }`}
                style={{ height: bar.height }}
              />
              <span className="text-[11px] font-medium text-gray-500">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Recent Transactions</h3>
            <p className="text-xs text-gray-500">Payouts, escrow releases, and bank transfers</p>
          </div>
          <button className="text-xs font-semibold text-purple-600 hover:text-purple-700">
            Export CSV
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-50/70 transition"
            >
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{tx.project}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{tx.client}</span>
                  <span>•</span>
                  <span>{tx.date}</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-bold block ${
                    tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                >
                  {tx.amount}
                </span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 mt-1">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

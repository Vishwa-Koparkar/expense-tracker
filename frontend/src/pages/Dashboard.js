import React from "react";
import { useExpenses } from "../context/ExpenseContext";
import { formatCurrency, CATEGORY_COLORS } from "../utils/constants";
import Charts from "../components/Charts";

export default function Dashboard() {
  const { stats, expenses } = useExpenses();

  const topCategory = stats.byCategory[0];
  const avgExpense =
    expenses.length > 0 ? stats.total / expenses.length : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl text-ink-dark mb-1">Overview</h1>
        <p className="text-sm text-ink-light font-sans">
          Your personal finance at a glance
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard
          label="Total Spent"
          value={formatCurrency(stats.total)}
          sub="all time"
        />
        <StatCard
          label="Transactions"
          value={expenses.length}
          sub="logged entries"
        />
        <StatCard
          label="Avg. per Entry"
          value={formatCurrency(avgExpense)}
          sub="average spend"
        />
        <StatCard
          label="Top Category"
          value={topCategory?._id?.split(" ")[0] || "—"}
          sub={topCategory ? formatCurrency(topCategory.total) : "no data"}
          color={topCategory ? CATEGORY_COLORS[topCategory._id] : undefined}
        />
      </div>

      {/* Charts */}
      <div className="bg-cream-50 border border-cream-200 rounded-2xl p-8 mb-8">
        <Charts />
      </div>

      {/* Category breakdown table */}
      {stats.byCategory.length > 0 && (
        <div className="bg-cream-50 border border-cream-200 rounded-2xl p-8">
          <h2 className="font-serif text-xl text-ink-dark mb-5">Category Breakdown</h2>
          <div className="space-y-3">
            {stats.byCategory.map((item) => {
              const pct = stats.total ? ((item.total / stats.total) * 100).toFixed(1) : 0;
              const color = CATEGORY_COLORS[item._id] || "#999087";
              return (
                <div key={item._id} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-sm font-sans text-ink w-36 flex-shrink-0">{item._id}</span>
                  <div className="flex-1 bg-cream-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-xs text-ink-light font-sans w-10 text-right">{pct}%</span>
                  <span className="font-sans font-medium text-ink-dark text-sm w-28 text-right">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-cream-50 border border-cream-200 rounded-xl p-5">
      <p className="text-xs font-sans font-medium text-ink-light uppercase tracking-widest mb-2">
        {label}
      </p>
      <p
        className="font-serif text-2xl font-semibold text-ink-dark"
        style={color ? { color } : {}}
      >
        {value}
      </p>
      <p className="text-xs font-sans text-ink-light mt-1">{sub}</p>
    </div>
  );
}

import React from "react";
import ExpenseList from "../components/ExpenseList";
import FilterBar from "../components/FilterBar";
import { useExpenses } from "../context/ExpenseContext";
import { formatCurrency } from "../utils/constants";

export default function ExpensesPage() {
  const { expenses, stats } = useExpenses();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink-dark mb-1">Expenses</h1>
          <p className="text-sm text-ink-light font-sans">
            {expenses.length} {expenses.length === 1 ? "entry" : "entries"} ·{" "}
            {formatCurrency(stats.total)} total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-cream-100 border border-cream-200 rounded-xl px-5 py-4 mb-6">
        <FilterBar />
      </div>

      {/* List */}
      <ExpenseList />
    </div>
  );
}

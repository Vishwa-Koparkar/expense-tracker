import React, { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { formatCurrency, formatDate, CATEGORY_COLORS } from "../utils/constants";
import ExpenseForm from "./ExpenseForm";

export default function ExpenseList() {
  const { expenses, loading, error, deleteExpense, fetchStats, filters } = useExpenses();
  const [editExpense, setEditExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setDeletingId(id);
    await deleteExpense(id);
    fetchStats(filters);
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-6 h-6 border-2 border-cream-300 border-t-ink-light rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-ink-light font-sans">Loading expenses…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 text-sm font-sans">
        Error: {error}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-serif text-2xl text-ink-light mb-2">No expenses yet</p>
        <p className="text-sm text-ink-light font-sans">Add your first entry to get started.</p>
      </div>
    );
  }

  return (
    <>
      {/* Edit modal overlay */}
      {editExpense && (
        <div className="fixed inset-0 bg-ink-dark bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <ExpenseForm
              editExpense={editExpense}
              onClose={() => setEditExpense(null)}
              onSuccess={() => setEditExpense(null)}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {expenses.map((expense) => {
          const color = CATEGORY_COLORS[expense.category] || "#999087";
          return (
            <div
              key={expense._id}
              className="bg-cream-50 border border-cream-200 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-cream-300 transition-colors group"
            >
              {/* Color dot */}
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium text-ink-dark text-sm truncate">
                  {expense.title}
                </p>
                <p className="text-xs text-ink-light font-sans mt-0.5">
                  {expense.category} · {formatDate(expense.date)}
                  {expense.note && (
                    <span className="ml-2 italic text-ink-light opacity-70">
                      — {expense.note}
                    </span>
                  )}
                </p>
              </div>

              {/* Amount */}
              <span className="font-serif text-lg font-semibold text-ink-dark flex-shrink-0">
                {formatCurrency(expense.amount)}
              </span>

              {/* Actions (visible on hover) */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => setEditExpense(expense)}
                  className="text-xs font-sans text-ink-light hover:text-ink border border-cream-300 rounded px-2.5 py-1 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
                  disabled={deletingId === expense._id}
                  className="text-xs font-sans text-red-400 hover:text-red-600 border border-red-200 rounded px-2.5 py-1 transition-colors disabled:opacity-50"
                >
                  {deletingId === expense._id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

import React, { useState } from "react";
import ExpenseForm from "../components/ExpenseForm";

export default function AddExpensePage({ onSuccess }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-ink-dark mb-1">Add Expense</h1>
        <p className="text-sm text-ink-light font-sans">
          Record a new entry to your personal ledger
        </p>
      </div>

      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-3 text-sm font-sans mb-6">
          ✓ Expense added successfully!
        </div>
      )}

      <ExpenseForm onSuccess={handleSuccess} />
    </div>
  );
}

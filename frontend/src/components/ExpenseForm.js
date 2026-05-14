import React, { useState, useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORIES } from "../utils/constants";

const emptyForm = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

export default function ExpenseForm({ editExpense, onClose, onSuccess }) {
  const { addExpense, updateExpense } = useExpenses();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill form if editing
  useEffect(() => {
    if (editExpense) {
      setForm({
        title: editExpense.title,
        amount: editExpense.amount,
        category: editExpense.category,
        date: editExpense.date.split("T")[0],
        note: editExpense.note || "",
      });
    }
  }, [editExpense]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!form.category) newErrors.category = "Select a category";
    if (!form.date) newErrors.date = "Date is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const payload = { ...form, amount: parseFloat(form.amount) };

    const result = editExpense
      ? await updateExpense(editExpense._id, payload)
      : await addExpense(payload);

    setSubmitting(false);

    if (result.success) {
      setForm(emptyForm);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } else {
      setErrors({ submit: result.message });
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm font-sans text-ink bg-cream-50 focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? "border-red-300 focus:ring-red-100"
        : "border-cream-300 focus:ring-cream-200 focus:border-cream-300"
    }`;

  return (
    <div className="bg-cream-50 rounded-2xl border border-cream-200 p-8 max-w-lg mx-auto">
      <h2 className="font-serif text-2xl text-ink-dark mb-1">
        {editExpense ? "Edit Expense" : "Log an Expense"}
      </h2>
      <p className="text-sm text-ink-light font-sans mb-7">
        {editExpense ? "Update the details below" : "Record a new expense to your ledger"}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <div className="mb-5">
          <label className="block text-xs font-sans font-medium text-ink-light uppercase tracking-widest mb-2">
            Description
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Dinner at Taj"
            className={inputClass("title")}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Amount + Category row */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-sans font-medium text-ink-light uppercase tracking-widest mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              className={inputClass("amount")}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-ink-light uppercase tracking-widest mb-2">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass("category")}
            >
              <option value="">Select…</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Date */}
        <div className="mb-5">
          <label className="block text-xs font-sans font-medium text-ink-light uppercase tracking-widest mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={inputClass("date")}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Note */}
        <div className="mb-7">
          <label className="block text-xs font-sans font-medium text-ink-light uppercase tracking-widest mb-2">
            Note <span className="normal-case tracking-normal font-light">(optional)</span>
          </label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Any additional details…"
            rows={2}
            className={`${inputClass("note")} resize-none`}
          />
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {errors.submit}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-ink-dark text-cream-50 py-2.5 rounded-lg text-sm font-sans font-medium hover:bg-ink transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving…" : editExpense ? "Save Changes" : "Add Expense"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-cream-300 rounded-lg text-sm font-sans text-ink-light hover:text-ink hover:border-cream-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

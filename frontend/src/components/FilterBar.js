import React from "react";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORIES } from "../utils/constants";

export default function FilterBar() {
  const { filters, setFilters, fetchExpenses, fetchStats } = useExpenses();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    fetchExpenses(newFilters);
    fetchStats(newFilters);
  };

  const clearFilters = () => {
    const reset = { category: "All", startDate: "", endDate: "" };
    setFilters(reset);
    fetchExpenses(reset);
    fetchStats(reset);
  };

  const isFiltered =
    filters.category !== "All" || filters.startDate || filters.endDate;

  const selectClass =
    "border border-cream-300 rounded-lg px-3 py-2 text-sm font-sans text-ink bg-cream-50 focus:outline-none focus:ring-2 focus:ring-cream-200";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-ink-light font-sans uppercase tracking-widest">
          Category
        </label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className={selectClass}
        >
          <option value="All">All</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Date range */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-ink-light font-sans uppercase tracking-widest">
          From
        </label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          className={selectClass}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-ink-light font-sans uppercase tracking-widest">
          To
        </label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          className={selectClass}
        />
      </div>

      {/* Clear button */}
      {isFiltered && (
        <button
          onClick={clearFilters}
          className="text-xs font-sans text-ink-light hover:text-ink border border-cream-300 rounded-lg px-3 py-2 transition-colors"
        >
          Clear filters ×
        </button>
      )}
    </div>
  );
}

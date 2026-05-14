import React from "react";

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-cream-50 border-b border-cream-300 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-serif font-semibold text-ink-dark tracking-tight">
            Ledger
          </span>
          <span className="text-xs font-sans text-ink-light border border-cream-300 rounded px-2 py-0.5">
            Personal Finance
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-cream-200 rounded-lg p-1">
          {["Dashboard", "Expenses", "Add Expense"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-sans transition-all duration-150 ${
                activeTab === tab
                  ? "bg-cream-50 text-ink-dark shadow-sm font-medium"
                  : "text-ink-light hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

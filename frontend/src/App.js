import React, { useState, useEffect } from "react";
import { ExpenseProvider, useExpenses } from "./context/ExpenseContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ExpensesPage from "./pages/ExpensesPage";
import AddExpensePage from "./pages/AddExpensePage";

function AppContent() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { fetchExpenses, fetchStats, filters } = useExpenses();

  // Load data on mount
  useEffect(() => {
    fetchExpenses(filters);
    fetchStats(filters);
  }, []); // eslint-disable-line

  const handleAddSuccess = () => {
    fetchExpenses(filters);
    fetchStats(filters);
    setActiveTab("Expenses");
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main>
        {activeTab === "Dashboard" && <Dashboard />}
        {activeTab === "Expenses" && <ExpensesPage />}
        {activeTab === "Add Expense" && (
          <AddExpensePage onSuccess={handleAddSuccess} />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 mt-8 border-t border-cream-200">
        <p className="text-xs font-sans text-ink-light text-center">
          Ledger — Personal Expense Tracker · Built with React, Node.js & MongoDB
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

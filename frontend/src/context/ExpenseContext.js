import React, { createContext, useContext, useReducer, useCallback } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "";

// Attach secret key to every request
axios.defaults.headers.common["x-api-key"] = process.env.REACT_APP_API_SECRET;

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  expenses: [],
  stats: { total: 0, byCategory: [] },
  loading: false,
  error: null,
  filters: {
    category: "All",
    startDate: "",
    endDate: "",
  },
};

// ─── Action Types ─────────────────────────────────────────────────────────────
const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_EXPENSES: "SET_EXPENSES",
  SET_STATS: "SET_STATS",
  ADD_EXPENSE: "ADD_EXPENSE",
  UPDATE_EXPENSE: "UPDATE_EXPENSE",
  DELETE_EXPENSE: "DELETE_EXPENSE",
  SET_FILTERS: "SET_FILTERS",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function expenseReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case ACTIONS.SET_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ACTIONS.SET_EXPENSES:
      return { ...state, loading: false, expenses: action.payload };

    case ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };

    case ACTIONS.ADD_EXPENSE:
      return { ...state, expenses: [action.payload, ...state.expenses] };

    case ACTIONS.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e._id === action.payload._id ? action.payload : e
        ),
      };

    case ACTIONS.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter((e) => e._id !== action.payload),
      };

    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Fetch all expenses (with current filters)
  const fetchExpenses = useCallback(async (filters = {}) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "All") params.append("category", filters.category);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const res = await axios.get(`${API_BASE}/api/expenses?${params.toString()}`);
      dispatch({ type: ACTIONS.SET_EXPENSES, payload: res.data.data });
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.response?.data?.message || "Failed to fetch expenses" });
    }
  }, []);

  // Fetch stats/summary
  const fetchStats = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const res = await axios.get(`${API_BASE}/api/expenses/stats/summary?${params.toString()}`);
      dispatch({ type: ACTIONS.SET_STATS, payload: res.data.data });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  // Add a new expense
  const addExpense = useCallback(async (expenseData) => {
    try {
      const res = await axios.post(`${API_BASE}/api/expenses`, expenseData);
      dispatch({ type: ACTIONS.ADD_EXPENSE, payload: res.data.data });
      fetchStats(state.filters);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to add expense" };
    }
  }, [fetchStats, state.filters]);

  // Update an expense
  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      const res = await axios.put(`${API_BASE}/api/expenses/${id}`, expenseData);
      dispatch({ type: ACTIONS.UPDATE_EXPENSE, payload: res.data.data });
      fetchStats(state.filters);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to update expense" };
    }
  }, [fetchStats, state.filters]);

  // Delete an expense
  const deleteExpense = useCallback(async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/expenses/${id}`);
      dispatch({ type: ACTIONS.DELETE_EXPENSE, payload: id });
      fetchStats(state.filters);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to delete expense" };
    }
  }, [fetchStats, state.filters]);

  // Update filters
  const setFilters = useCallback((newFilters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        ...state,
        fetchExpenses,
        fetchStats,
        addExpense,
        updateExpense,
        deleteExpense,
        setFilters,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

// Custom hook for easy access
export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("useExpenses must be used inside ExpenseProvider");
  return context;
}
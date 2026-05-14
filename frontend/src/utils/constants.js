export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Housing",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Education",
  "Travel",
  "Utilities",
  "Other",
];

// Colors for charts — warm, editorial palette
export const CATEGORY_COLORS = {
  "Food & Dining":   "#c4855a",
  "Transportation":  "#6b8fa3",
  "Housing":         "#8a7968",
  "Entertainment":   "#b07d8c",
  "Healthcare":      "#6a9e7f",
  "Shopping":        "#c4a55a",
  "Education":       "#7a7eb0",
  "Travel":          "#5a9ea0",
  "Utilities":       "#a07060",
  "Other":           "#999087",
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

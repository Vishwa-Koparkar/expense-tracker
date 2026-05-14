const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const expenseRoutes = require("./routes/expenses");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// API key protection — blocks anyone without the secret
app.use("/api", (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (key !== process.env.API_SECRET) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
});

// Routes
app.use("/api/expenses", expenseRoutes);

// Health check (unprotected, so Render can ping it)
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running!" });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
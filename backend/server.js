const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const expenseRoutes = require("./routes/expenses");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL, // Add your Vercel URL here after deploying
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Routes
app.use("/api/expenses", expenseRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running!" });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

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
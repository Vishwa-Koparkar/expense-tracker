const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// GET all expenses (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    // Build filter object
    const filter = {};
    if (category && category !== "All") {
      filter.category = category;
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate + "T23:59:59.999Z");
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single expense by ID
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new expense
router.post("/", async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update expense
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE expense
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET summary stats (total, by category)
router.get("/stats/summary", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate + "T23:59:59.999Z");
    }

    const byCategory = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalResult = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      success: true,
      data: {
        total: totalResult[0]?.total || 0,
        byCategory,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

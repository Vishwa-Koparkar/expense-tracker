# Ledger — Personal Expense Tracker

A full-stack personal finance tracker built with React, Node.js, Express, MongoDB, Recharts, and Tailwind CSS.

---

## Features
- Log, edit, and delete expenses
- Categorize expenses (Food, Travel, Housing, etc.)
- Filter by category and date range
- Interactive pie and bar charts (Recharts)
- MongoDB persistence
- Global state with React Context API

---

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, Tailwind CSS, Recharts, Axios |
| Backend   | Node.js, Express.js           |
| Database  | MongoDB (Mongoose ODM)        |

---

## Prerequisites — Install These First

1. **Node.js** (v18 or newer)
   - Download from: https://nodejs.org → choose "LTS" version
   - Verify: open Terminal/Command Prompt and type `node -v`

2. **MongoDB Community Edition**
   - Download from: https://www.mongodb.com/try/download/community
   - Follow the installer for your OS
   - Verify: type `mongod --version` in terminal

---

## Project Structure

```
expense-tracker/
├── backend/
│   ├── models/
│   │   └── Expense.js        ← MongoDB schema
│   ├── routes/
│   │   └── expenses.js       ← API routes (GET, POST, PUT, DELETE)
│   ├── .env                  ← Environment variables (DB connection)
│   ├── server.js             ← Express app entry point
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Charts.js         ← Pie + bar charts
    │   │   ├── ExpenseForm.js    ← Add/edit form
    │   │   ├── ExpenseList.js    ← List with edit/delete
    │   │   ├── FilterBar.js      ← Category + date filters
    │   │   └── Navbar.js         ← Top navigation
    │   ├── context/
    │   │   └── ExpenseContext.js ← React Context + useReducer
    │   ├── pages/
    │   │   ├── Dashboard.js      ← Stats + charts page
    │   │   ├── ExpensesPage.js   ← All expenses page
    │   │   └── AddExpensePage.js ← Add expense page
    │   ├── utils/
    │   │   └── constants.js      ← Categories, colors, formatters
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## Setup Instructions (Step by Step)

### Step 1 — Start MongoDB

**Mac:**
```bash
brew services start mongodb-community
```

**Windows:**
- Open "Services" (search in Start menu)
- Find "MongoDB" → right-click → Start
- OR open Command Prompt as Admin and run: `net start MongoDB`

**Linux:**
```bash
sudo systemctl start mongod
```

---

### Step 2 — Set Up the Backend

Open a terminal and run:

```bash
cd expense-tracker/backend
npm install
npm run dev
```

You should see:
```
✅ Connected to MongoDB
✅ Server running on http://localhost:5001
```

> **Keep this terminal open.** The backend must stay running.

---

### Step 3 — Set Up the Frontend

Open a **second terminal** and run:

```bash
cd expense-tracker/frontend
npm install
npm start
```

Your browser will automatically open at:
```
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/expenses                   | Get all expenses (with filters) |
| GET    | /api/expenses/:id               | Get single expense       |
| POST   | /api/expenses                   | Create new expense       |
| PUT    | /api/expenses/:id               | Update expense           |
| DELETE | /api/expenses/:id               | Delete expense           |
| GET    | /api/expenses/stats/summary     | Get totals by category   |

---

## How to Use

1. Click **"Add Expense"** in the nav to log a new expense
2. View all entries on the **"Expenses"** tab — hover to edit or delete
3. Use the **filter bar** to narrow by category or date range
4. See charts and totals on the **"Dashboard"** tab


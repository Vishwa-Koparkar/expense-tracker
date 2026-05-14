import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORY_COLORS, formatCurrency } from "../utils/constants";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-cream-50 border border-cream-200 rounded-lg px-3 py-2 text-sm font-sans shadow-sm">
        <p className="font-medium text-ink-dark">{payload[0].name || payload[0].payload.category}</p>
        <p className="text-ink-light">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Charts() {
  const { stats } = useExpenses();

  const pieData = stats.byCategory.map((item) => ({
    name: item._id,
    value: item.total,
  }));

  const barData = stats.byCategory.map((item) => ({
    category: item._id.split(" ")[0], // Shorten for bar label
    fullName: item._id,
    total: item.total,
  }));

  if (!stats.byCategory.length) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-ink-light font-sans">
          Add expenses to see charts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Pie Chart */}
      <div>
        <h3 className="font-serif text-lg text-ink-dark mb-4">By Category</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] || "#999087"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {pieData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[entry.name] || "#999087" }}
              />
              <span className="text-xs text-ink-light font-sans">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div>
        <h3 className="font-serif text-lg text-ink-dark mb-4">Spending Breakdown</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ede4d0" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: "#6b6659", fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b6659", fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f0e4" }} />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {barData.map((entry) => (
                <Cell
                  key={entry.fullName}
                  fill={CATEGORY_COLORS[entry.fullName] || "#999087"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  CartesianGrid,
} from "recharts";

export default function AttritionByMonth({ data }) {
  const years = Object.keys(data);
  const [selectedYear, setSelectedYear] = useState("All Years");

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // ✅ Prepare data for "All Years"
  const totalPerYear = years.map((year) => {
    const total = months.reduce(
      (sum, month) => sum + (data[year][month] || 0),
      0
    );
    return { year, total };
  });

  // ✅ Prepare data for selected year
  const chartData = selectedYear !== "All Years"
    ? months.map((month) => ({
        month,
        attrition: data[selectedYear][month] || 0,
      }))
    : totalPerYear;

  return (
    <div className="chart-container1">
      <h3>Attrition by {selectedYear === "All Years" ? "Year" : "Month"}</h3>

      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        style={{ marginBottom: "1rem" }}
      >
        <option value="All Years">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={selectedYear === "All Years" ? "year" : "month"}
            interval={0}
            angle={-45}
            tick={{ fontSize: 12 }}
            dy={10}
          >
            <Label
              value={selectedYear === "All Years" ? "Year" : "Month"}
              offset={-35}
              position="insideBottom"
              style={{ fontWeight: "bold" }}
            />
          </XAxis>
          <YAxis>
            <Label
              value={selectedYear === "All Years" ? "Total Employees Left" : "No. of Employees Left"}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle", fontWeight: "bold" }}
            />
          </YAxis>
          <Tooltip />
          <Line
            type="monotone"
            dataKey={selectedYear === "All Years" ? "total" : "attrition"}
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

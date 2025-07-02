import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label // ✅ You need this!
} from "recharts";

export default function AttritionByMonth({ data }) {
  const years = Object.keys(data);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleLegendClick = (e) => {
    const { dataKey } = e;
    if (selectedYear === dataKey) {
      // If clicked again, show all years
      setSelectedYear(null);
    } else {
      setSelectedYear(dataKey);
    }
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Format data for recharts
  const chartData = months.map((month) => {
    const row = { month };
    years.forEach((year) => {
      row[year] = data[year][month] || 0;
    });
    return row;
  });

  return (
    <div className="chart-container1">
      <h3>Attrition by Month</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis>
             <Label
                value="No. of Employees Left"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle", fontWeight: "bold" }}
              />
          </YAxis>
          <Tooltip />
          <Legend onClick={handleLegendClick} />
          {years.map((year) => {
            const isVisible = !selectedYear || selectedYear === year;
            return (
              <Line
                key={year}
                type="monotone"
                dataKey={year}
                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                strokeWidth={2}
                opacity={isVisible ? 1 : 0}
                hide={!isVisible}
                dot={{ r: 4 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

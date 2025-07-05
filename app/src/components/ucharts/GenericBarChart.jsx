// GenericBarChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Label,
  Cell
} from "recharts";

export default function GenericBarChart({ data, xKey, yKey, title }) {
  // Example color palette
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#d8854f"
  ];

  return (
    <div className="chart-container1">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey}>
          </XAxis>
          <YAxis>
            <Label
              value="Salary ($)"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle", fontWeight: "bold" }}
            />
          </YAxis>
          <Tooltip />
          <Bar dataKey={yKey}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
            <LabelList dataKey={yKey} position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

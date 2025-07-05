// GenericBarChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Label,
  Cell
} from "recharts";

export default function GenericBarChart2({ data, xKey, yKey, title }) {
  // Example color palette
  const colors = [
    "#d0ed57",
    "#d8854f"
  ];

  return (
    <div className="chart-container5">
      <h3>{title}</h3>
      <ResponsiveContainer height={180} width={290} style={{ marginTop: '2rem' }}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis>
            <Label
              value="No. of Trainings"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle", fontWeight: "bold" }}
            />
          </YAxis>
          {/* <Tooltip /> */}
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

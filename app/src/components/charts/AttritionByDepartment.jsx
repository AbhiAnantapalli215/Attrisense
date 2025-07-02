import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label // ✅ You need this!
} from "recharts";

export default function AttritionByDepartment({ data }) {
  const chartData = Object.entries(data).map(([department, value]) => ({
    department,
    attrition: value
  }));

  return (
    <div className="chart-container1">
      <h3>Attrition by Department</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // ✅ Add margin for X label
        >
          <YAxis type="number">
            <Label
              value="No. of Employees Left"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle", fontWeight: "bold" }}
            />
          </YAxis>
          <XAxis dataKey="department" type="category">
            <Label
              value="Department"
              offset={-25}
              position="insideBottom"
              style={{ fontWeight: "bold" }}
            />
          </XAxis>
          <Tooltip />
          <Bar dataKey="attrition" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

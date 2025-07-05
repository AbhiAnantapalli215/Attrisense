import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";

export default function AttritionByManagerDeptChart({ data }) {
  const departments = Object.keys(data || {});
  const [selectedDept, setSelectedDept] = useState(departments[0] || "");

  if (!selectedDept) return <div>No data available</div>;

  // ✅ Prepare chart data with attritionRate, attritionCount, totalReports
  const chartData = Object.entries(data[selectedDept]).map(
    ([managerId, mgrData]) => ({
      ManagerID: `MGR${managerId.toString().padStart(4, "0")}`,
      attritionRate: mgrData.attritionRate,          // % for bar height
      attritionCount: mgrData.attritionCount,        // absolute #
      totalReports: mgrData.totalReports,            // absolute #
    })
  );

  return (
    <div className="chart-container2">
      <h3>Attrition Rate by Manager ID & Department</h3>

      <select
        onChange={(e) => setSelectedDept(e.target.value)}
        value={selectedDept}
      >
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="ManagerID"
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 11 }}
            >
              <Label
                value="Manager ID"
                offset={-35}
                position="insideBottom"
                style={{ fontWeight: "bold" }}
              />
            </XAxis>
            <YAxis
              domain={[0, 100]}
              tickFormatter={(tick) => `${tick}%`}
            >
              <Label
                value="Attrition Rate (%)"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle", fontWeight: "bold" }}
              />
            </YAxis>
            <Tooltip
              formatter={(value, name, props) => {
                const { payload } = props; // Get full data point
                if (name === "Attrition Rate") {
                  return [
                    `${payload.attritionCount} left / ${payload.totalReports} total = ${value.toFixed(2)}%`,
                    "Attrition",
                  ];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `ManagerID: ${label}`}
            />
            <Bar
              dataKey="attritionRate"
              fill="#82ca9d"
              name="Attrition Rate"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

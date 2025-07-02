import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label, // ✅ Make sure you import Label too!
} from "recharts";

export default function AttritionByManagerDeptChart({ data }) {
  const departments = Object.keys(data || {});
  const [selectedDept, setSelectedDept] = useState(departments[0] || "");

  if (!selectedDept) return <div>No data available</div>;

  // Prepare chart data
  const chartData = Object.entries(data[selectedDept]).map(
    ([managerId, count]) => ({
      managerId,
      attrition: count,
    })
  );

  return (
    <div className="chart-container2">
      <h3>Attrition by Manager ID & Department</h3>

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
            <XAxis dataKey="managerId" angle={-45} textAnchor="end" interval={0}>
              <Label value="Manager ID" offset={-35} position="insideBottom" style={{ fontWeight: 'bold' }}/>
            </XAxis>
            <YAxis>
              <Label
                value="No. of employee left"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle",fontWeight: 'bold' }}
              />
            </YAxis>
            <Tooltip />
            <Bar dataKey="attrition" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

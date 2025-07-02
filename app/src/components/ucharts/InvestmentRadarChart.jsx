// InvestmentRadarChart.jsx
import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function InvestmentRadarChart({ data }) {
  return (
    <div className="chart-container4">
      <h3>Career Investment & Alignment</h3>
      <ResponsiveContainer width="100%" height={250} style={{ marginTop: '2rem' }}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <Radar
            name="You"
            dataKey="value"
            stroke="#4b0082"
            fill="#4b0082"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

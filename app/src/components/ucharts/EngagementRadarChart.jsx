// EngagementRadarChart.jsx
import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function EngagementRadarChart({ data }) {
  return (
    <div className="chart-container4">
      <h3>Engagement & Satisfaction</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <defs>
            <radialGradient id="radarGradient" cx="53%" cy="61%" r="80%">
              <stop offset="0%" stopColor="#ffc61a" stopOpacity="1" /> 
              <stop offset="40%" stopColor="#ffc61a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffc61a" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <Radar
            name="You"
            dataKey="value"
            stroke="#ffc61a"
            fill="url(#radarGradient)"
            fillOpacity={1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

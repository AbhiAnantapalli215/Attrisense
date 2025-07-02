import { TrendingUp, TrendingDown, Footprints, Map } from "lucide-react";

export default function KpiCards({ data }) {
  if (!data) return null;

  // ✅ Attrition Rate KPI
  const attritionRate = {
    label: "Attrition Risk",
    value: `${Math.round((data.monitor.prediction || 0) * 100)}%`,
    isNegative: data.monitor.prediction >= 0.3,
    icon: data.monitor.prediction >= 0.3 ? (
      <TrendingUp color="red" />
    ) : (
      <TrendingDown color="green" />
    ),
    description: "Chance of employee leaving"
  };

  // ✅ Education KPI
  const educationLevel = data.Education || 0; // 1 to 5
  const educationField = data.EducationField || "N/A";
  const maxLevel = 5;

  const percentage = Math.min((educationLevel / maxLevel) * 100, 100);
  const radius = 40;
  const circumference = Math.PI * radius;
  const dashOffset = circumference * (1 - percentage / 100);

  // ✅ Distance KPI
  const distanceFromHome = data.DistanceFromHome || 0;
  const travelFrequency = data.BusinessTravel || "N/A";

  return (
      <div className="kpi-cards">
        {/* ✅ Attrition KPI Card */}
        <div
          className={`kpi-card ${attritionRate.isNegative ? "negative" : "positive"}`}
        >
          <div className="kpi-header">
            {attritionRate.icon}
            <h4>{attritionRate.label}</h4>
          </div>
          <p className="kpi-value">{attritionRate.value}</p>
          <p className="kpi-description">{attritionRate.description}</p>
        </div>

        {/* ✅ Education KPI Card with Semi-Circle Gauge */}
        <div className="kpi-card">
          <div className="kpi-header">
            <h4>Education Level</h4>
          </div>

          <svg width="100" height="60">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#eee"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset="0"
              transform="rotate(-180 50 50)"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#6c5ce7"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-180 50 50)"
              strokeLinecap="round"
            />
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fontSize="14"
              fill="#333"
              fontWeight="bold"
            >
              {`${educationLevel}`}
            </text>
          </svg>

          <p className="kpi-description">Field: {educationField}</p>
        </div>

        {/* ✅ Distance KPI Card */}
        <div className="kpi-card">
          <div className="kpi-header">
            <Footprints color="green" style={{ fontSize: "4px" }} />
            <h4>Distance From Home</h4>
          </div>
          <p className="kpi-value">{distanceFromHome} km</p>
          <div className="kpi-description">
            {travelFrequency}
          </div>
        </div>
      </div>
  );
}

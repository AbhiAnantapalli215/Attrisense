import { TrendingUp, TrendingDown } from "lucide-react";

export default function KPICards({ data }) {
  if (!data) return null;

  const atrate=
    {
      label: "Attrition Rate",
      value: `${data.attritionRate?.toFixed(2) || 0}%`,
      isNegative: data.attritionRate < 20, // Example threshold
      icon: data.attritionRate < 20 ? <TrendingUp color="red" /> : <TrendingDown color="blue" />,
      description: "Higher means more employees leaving."
    }
  const kpis = [
    {
      label: "Avg Years at Company",
      value: `${data.averageYears?.toFixed(1) || 0}`,
      isNegative: data.averageYears < 5, // Example threshold
      icon:  data.averageYears < 5 ? <TrendingDown color="red"/>:<TrendingUp color="blue" />,
      description: "Average tenure in years."
    },
    {
      label: "Years Since Promotion",
      value: `${data.avgYearsSinceLastPromotion?.toFixed(1) || 0} yrs`,
      isNegative: data.avgYearsSinceLastPromotion < 2, // Example threshold
      icon:  data.avgYearsSinceLastPromotion < 2 ? <TrendingDown color="red"/>:<TrendingUp color="blue" />,
      description: "Average time since last promotion."
    },
    {
      label: "Avg Satisfaction",
      value: `${data.avgSatisfaction?.toFixed(2) || 0}/5`,
      isNegative: data.avgSatisfaction < 3,
      icon:  data.avgSatisfaction < 3 ? <TrendingDown color="red"/>:<TrendingUp color="blue" />,
      description: "Average job satisfaction score."
    },
    {
      label: "Avg Performance",
      value: `${data.avgPerformance?.toFixed(2) || 0}/5`,
      isNegative: data.avgPerformance < 3,
      icon:  data.avgPerformance < 3 ? <TrendingDown color="red"/>:<TrendingUp color="blue" />,
      description: "Average employee performance score."
    }
  ];

  return (
    <div className="kpicardsholder">
      <div className="kpi-card-attrition">
        <div
          className={`kpi-card ${atrate.isNegative ? "negative" : "positive"}`}
        >
          <div className="kpi-header">
            {atrate.icon}
            <h4>{atrate.label}</h4>
          </div>
          <p className="kpi-value">{atrate.value}</p>
          <p className="kpi-description">{atrate.description}</p>
        </div>
      </div>
      <div className="kpi-cards-grid">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className={`kpi-card ${kpi.isNegative ? "negative" : "positive"}`}
        >
          <div className="kpi-header">
            {kpi.icon}
            <h4>{kpi.label}</h4>
          </div>
          <p className="kpi-value">{kpi.value}</p>
          <p className="kpi-description">{kpi.description}</p>
        </div>
      ))}
    </div>
    </div>
  );
}

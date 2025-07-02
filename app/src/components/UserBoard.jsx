import { useNavigate } from 'react-router-dom';
import useDashboardMetrics from "../hooks/useDashboardMetrics.js";

import GenericBarChart from "../components/ucharts/GenericBarChart";
import GenericBarChart2 from "../components/ucharts/GenericBarChart2";
import EngagementRadarChart from "../components/ucharts/EngagementRadarChart";
import InvestmentRadarChart from "../components/ucharts/InvestmentRadarChart";
import KpiCards from './ucharts/KpiCards.jsx';

export default function UserBoard({ employee, employeeId }) {
  const navigate = useNavigate();
  const { metrics, loading } = useDashboardMetrics();

  if (loading) return <div>Loading...</div>;
  if (!metrics || !employee) return <div>No data available</div>;

  const goBackToDetails = () => {
    navigate('/list');
  };

  // ✅ Combined Salary Comparison
  const salaryComparisonData = [
    { group: "Employee", value: employee.MonthlyIncome },
    {
      group: `In Same Dept`,
      value: metrics.averageSalaryByDepartment?.[employee.Department] || 0
    },
    {
      group: `In Same Role`,
      value: metrics.averageSalaryByJobRole?.[employee.JobRole] || 0
    },
    {
      group: `In Same EduLevel`,
      value: metrics.averageSalaryByEducation?.[employee.Education] || 0
    }
  ];

  // ✅ Engagement Radar
  const engagementData = [
    { metric: "EnvSatisfaction", value: employee.EnvironmentSatisfaction * 20 },
    { metric: "JobSatisfaction", value: employee.JobSatisfaction * 20 },
    { metric: "RelationshipSatisfaction", value: employee.RelationshipSatisfaction * 20 },
    { metric: "WorkLifeBalance", value: employee.WorkLifeBalance * 20 },
    { metric: "JobInvolvement", value: employee.JobInvolvement * 20 },
    { metric: "PerformanceRating", value: employee.PerformanceRating * 20 },
  ];

  // ✅ Investment Radar
  const investmentData = [
    {
      metric: `YearsAtCompany (${employee.YearsAtCompany})`,
      value: Math.min((employee.YearsAtCompany / metrics.kpis.averageYears) * 100, 100)
    },
    {
      metric: `YearsSinceLastPromotion (${employee.YearsSinceLastPromotion})`,
      value: Math.max(100 - (employee.YearsSinceLastPromotion / metrics.kpis.avgYearsSinceLastPromotion) * 100, 0)
    },
    { metric: `StockOptionLevel (${employee.StockOptionLevel})`, value: employee.StockOptionLevel * 25 }
  ];

  // ✅ Training vs Dept Avg
  const trainingData = [
    { group: "Employee", value: employee.TrainingTimesLastYear },
    {
      group: "Department's Avg",
      value: metrics.averageTrainingByDepartment?.[employee.Department] || 0
    }
  ];
  const isAttritionTrue=employee.Attrition=="Yes";
  return (
    <div className="dashboard">
      <div className="dash-title">
        <h1>Employee Dashboard: {employee.Name} ({employeeId})</h1>
        <p>Role: {employee.JobRole} | Dept: {employee.Department}</p>
        {isAttritionTrue && (<p className='bad-negative'>Resignee | Left in {employee.TerminationDate}</p>)}
      </div>

      <div className="chart-grid">
        <EngagementRadarChart data={engagementData} />
        <div className="kpi-cards-grid">
          <GenericBarChart2
            data={trainingData}
            xKey="group"
            yKey="value"
            title="Training Sessions Attended Last Year vs Department's Avg"
          />
        </div>
        <KpiCards data={employee} />
        <GenericBarChart
          data={salaryComparisonData}
          xKey="group"
          yKey="value"
          title="Employee's Salary Compared to his Peers"
        />
        <InvestmentRadarChart data={investmentData} />
      </div>

      <div className="back-button-container">
        <button onClick={goBackToDetails} className="back-button">
          ← Back to Details
        </button>
      </div>
    </div>
  );
}

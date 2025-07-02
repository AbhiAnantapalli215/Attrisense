// charts/AverageSalaryByJobRoleChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AvgsalbyJobRole = ({ data }) => {
  if (!data) return <p>Loading...</p>;
  const entries = Object.entries(data);
  const sortedEntries = entries.sort(([a], [b]) => a.localeCompare(b));
  const labels = sortedEntries.map(([key]) => key);
  const values = sortedEntries.map(([, value]) => value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Average Salary by Job Role",
        data: values,
        backgroundColor: "#1cc88a",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Salary",
          font: {
            weight: 'bold',
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="chart-container1">
      <h3>Average Salary by Job Role</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AvgsalbyJobRole;

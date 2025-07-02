// charts/AttritionByJobRoleChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AttritionByJobRole = ({ data }) => {
  if (!data) return <p>Loading...</p>;

  const entries = Object.entries(data);
  const sortedEntries = entries.sort(([a], [b]) => a.localeCompare(b));
  const labels = sortedEntries.map(([key]) => key);
  const values = sortedEntries.map(([, value]) => value);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: "Attrition by Job Role",
        data: values,
        backgroundColor: "#4e73df",
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
          text: "No. of Employees Left",
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
      <h3>Attrition by Job Role</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AttritionByJobRole;

// src/components/PieChart.js
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Đảm bảo rằng các thành phần cần thiết đã được đăng ký
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: ["Căn hộ", "Chung cư mini", "Ở ghép"],
    datasets: [
      {
        data: data,
        backgroundColor: ["rgb(48 135 58)", "rgb(41 120 173)", "#092756"],
        hoverBackgroundColor: ["rgb(48 135 58)", "rgb(41 120 173)", "#092756"],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;

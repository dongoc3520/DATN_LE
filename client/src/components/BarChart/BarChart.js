import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đảm bảo rằng các thành phần cần thiết đã được đăng ký
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  const chartData = {
    labels: ["Căn hộ", "Chung cư mini", "Ở ghép"],
    datasets: [
      {
        label: "Giá tiền trung bình (VND)",
        data: data,
        backgroundColor: "#4BC0C0",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} options={{ responsive: true }} />;
};

export default BarChart;

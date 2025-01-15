import React from "react";
import "../StatisticsBox/StaticsBox.css";
import { useNavigate } from "react-router-dom";

const StatisticsBox = ({ title, count, color, type }) => {
  const navigate = useNavigate();
  const handleStaticBox = () => {
    navigate(`/dashboard/${parseInt(type)}`);
  };
  return (
    <div
      className="statistics-box"
      style={{ backgroundColor: color }}
      onClick={handleStaticBox}
    >
      <h4>{title}</h4>
      <p>{count} bài đăng</p>
    </div>
  );
};

export default StatisticsBox;

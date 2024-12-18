// import "./Home.css";
import React from "react";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";
function NotFound() {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/1");
  };
  return (
    <div className="notfound">
      <div> Trang không tồn tại</div>
      <div className="btnHome" onClick={goToHome}>Trang chủ</div>
    </div>
  );
}

export default NotFound;

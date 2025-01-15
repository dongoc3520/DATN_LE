import { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./layout.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { getCookie } from "../Cookie";
function DefaultLayout({ children }) {
  const idUser = getCookie("idUser");
  const [key, setKey] = useState(0);
  const handleCuonLen = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Hiệu ứng cuộn mượt
    });
  };
  const handleReload = () => {
    setKey((prevKey) => prevKey + 1); // Tăng key để reload lại component.
  };
  return (
    <div className="layout">
      <div className="layout_navbar">
        <Link
          to="/1"
          className="layout_navbar_item"
          data-tooltip-id="home-tooltip"
          data-tooltip-content="Căn hộ"
        >
          <i className="fa-solid fa-house icon_home"></i>
        </Link>
        <Link
          to="/2"
          className="layout_navbar_item"
          data-tooltip-id="hotel-tooltip"
          data-tooltip-content="Chung cư mini"
        >
          <i className="fa-solid fa-hotel icon_home"></i>
        </Link>
        <Link
          to="/3"
          className="layout_navbar_item"
          data-tooltip-id="user-tooltip"
          data-tooltip-content="Ở ghép"
        >
          <i className="fa-solid fa-user-group icon_home"></i>
        </Link>

        {/* Tooltip Components */}
        <Tooltip id="home-tooltip" place="right" />
        <Tooltip id="hotel-tooltip" place="right" />
        <Tooltip id="user-tooltip" place="right" />
      </div>

      <div
        style={{
          paddingTop: "",
        }}
        className="layout_container"
      >
        <Header onReload={handleReload} />
        {children}
        <div className="cuonlen" onClick={handleCuonLen}>
          <i class="fa-solid fa-up-long"></i>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default DefaultLayout;

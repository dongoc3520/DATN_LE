import { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./layout.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function DefaultLayout({ children }) {
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
        <Link to="/" className="layout_navbar_item">
          <i class="fa-solid fa-house icon_home"></i>
        </Link>
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

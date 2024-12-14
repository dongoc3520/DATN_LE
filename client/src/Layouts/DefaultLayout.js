import { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./layout.css";
import { useState } from "react";
import { Link } from "react-router-dom";
function DefaultLayout({ children }) {
  const [key, setKey] = useState(0);

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
        <Footer />
      </div>
    </div>
  );
}

export default DefaultLayout;

import Header from "./Header";
import "./layout.css";
import { Link } from "react-router-dom";
function DefaultLayout({ children }) {
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
        <Header />
        {children}
      </div>
    </div>
  );
}

export default DefaultLayout;

import "./Header.css";
import logoImage from "../img/nhatro.png";
import { Link } from "react-router-dom";
import { getCookie } from "../Cookie";
const idUser = getCookie("idUser");
function Header() {
  return (
    <>
      <header>
        <a href="" class="logo">
          <img src={logoImage} alt="Shenlik Tech Logo" />
        </a>
        <input className="searchPT" placeholder="" />
        <ul class="navbarr">
          <Link to="/" className="nav-link">
            Căn hộ
          </Link>
          <Link to="/" className="nav-link">
            Chung cư mini
          </Link>
          <Link to="/" className="nav-link">
            Ở ghép
          </Link>
        </ul>

        <div class="mainn">
          <div className="Person">
            <img
              src="https://cdnphoto.dantri.com.vn/lWbNf1jAm5A1aQriE5UO0SAuuYg=/2024/01/15/co-gai-xinh-dep2-edited-edited-1705310658178.jpeg"
              alt=""
            />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;

import "./Header.css";
import logoImage from "../img/nhatro.png";
import { Link } from "react-router-dom";
import { getCookie } from "../Cookie";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deleteAllCookies } from "../Cookie";
import { url } from "../url";
import axios from "axios";
const idUser = getCookie("idUser");
function Header({ onReload }) {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [showLinkBox, setShowLinkBox] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    age: 0,
    likes: 0,
    image: "",
    role: "",
  });
  const personRef = useRef(null); // Sử dụng ref để tham chiếu tới thẻ .Person
  const linkBoxRef = useRef(null); // Sử dụng ref để tham chiếu tới thẻ .linkBox
  const handleProfileClick = () => {
    navigate(`/profile/${idUser}`, { replace: true });
    if (onReload) {
      onReload(); // Gọi hàm reload từ parent component.
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/user/profile/${idUser}`, {
        withCredentials: true,
      });
      setProfile({
        name: res.data.user.name,
        age: res.data.user.age,
        likes: 0,
        image: res.data.user.avatar,
        role: res.data.user.role,
      });
      console.log("hehe", profile);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleLinkBox = () => {
    setShowLinkBox(!showLinkBox);
  };
  const logout = () => {
    deleteAllCookies();
    window.location.reload();
  };
  // Hàm đóng box khi nhấn ra ngoài
  const handleClickOutside = (event) => {
    if (
      personRef.current &&
      !personRef.current.contains(event.target) &&
      linkBoxRef.current &&
      !linkBoxRef.current.contains(event.target)
    ) {
      setShowLinkBox(false); // Ẩn box khi nhấn ra ngoài
    }
  };

  // Thêm event listener khi component mount và cleanup khi component unmount
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <header>
        <Link href="" class="logo">
          <img src={logoImage} alt="Shenlik Tech Logo" />
        </Link>
        <input className="searchPT" placeholder="" />
        <ul class="navbarr">
          <Link to="/1" className="nav-link" style={{ color: "#1773ea" }}>
            <i class="fa-solid fa-house" style={{ marginRight: "5px" }}></i>
            Căn hộ
          </Link>
          <Link to="/2" className="nav-link" style={{ color: "#1773ea" }}>
            <i class="fa-solid fa-hotel" style={{ marginRight: "5px" }}></i>
            Chung cư mini
          </Link>
          <Link to="/3" className="nav-link" style={{ color: "#1773ea" }}>
            <i
              class="fa-solid fa-user-group"
              style={{ marginRight: "5px" }}
            ></i>
            Ở ghép
          </Link>
        </ul>

        <div className="mainn">
          <div className="Person" onClick={toggleLinkBox} ref={personRef}>
            <img src={profile.image} alt="Person" />
            {showLinkBox && (
              <div className="linkBox">
                <div onClick={handleProfileClick}>
                  <i class="fa-solid fa-user"></i>
                  Trang cá nhân
                </div>
                <div onClick={logout}>
                  <i class="fa-solid fa-right-from-bracket"></i>
                  Đăng xuất
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;

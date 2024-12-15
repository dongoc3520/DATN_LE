import "./Header.css";
import logoImage from "../img/nhatro.png";
import { Link } from "react-router-dom";
import { getCookie } from "../Cookie";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deleteAllCookies } from "../Cookie";
const idUser = getCookie("idUser");
function Header({ onReload }) {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [showLinkBox, setShowLinkBox] = useState(false);
  const personRef = useRef(null); // Sử dụng ref để tham chiếu tới thẻ .Person
  const linkBoxRef = useRef(null); // Sử dụng ref để tham chiếu tới thẻ .linkBox
  const handleProfileClick = () => {
    navigate(`/profile/${idUser}`, { replace: true });
    if (onReload) {
      onReload(); // Gọi hàm reload từ parent component.
    }
  };
  // Hàm toggle để mở/đóng box
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
          <Link to="/1" className="nav-link">
            Căn hộ
          </Link>
          <Link to="/2" className="nav-link">
            Chung cư mini
          </Link>
          <Link to="/3" className="nav-link">
            Ở ghép
          </Link>
        </ul>

        <div className="mainn">
          <div className="Person" onClick={toggleLinkBox} ref={personRef}>
            <img
              src="https://th.bing.com/th/id/R.d930651664e60ab0a9873be8e2aa3e81?rik=EBlnjyuPTTRdNg&riu=http%3a%2f%2fwww.hdwallpapersfreedownload.com%2fuploads%2flarge%2fcartoons%2fdoraemon-full.jpg&ehk=bMkOVg25D1cJaXdXQdJOjvkUi5JVCeq9jQJw6sIeDKU%3d&risl=&pid=ImgRaw&r=0"
              alt="Person"
            />
            {showLinkBox && (
              <div className="linkBox">
                <div onClick={handleProfileClick}>
                  {/* <Link to={`/profile/${idUser}`} className=""> */}
                  <i class="fa-solid fa-user"></i>
                  Trang cá nhân
                  {/* </Link> */}
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

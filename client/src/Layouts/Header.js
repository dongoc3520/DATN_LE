import "./Header.css";
import logoImage from "../img/nhatro.png";
import { Link } from "react-router-dom";
import { getCookie } from "../Cookie";
import { useState, useEffect, useRef } from "react";
const idUser = getCookie("idUser");
function Header() {
  const [showLinkBox, setShowLinkBox] = useState(false);
  const personRef = useRef(null); // Sử dụng ref để tham chiếu tới thẻ .Person
  const linkBoxRef = useRef(null); // Sử dụng ref để tham chiếu tới thẻ .linkBox

  // Hàm toggle để mở/đóng box
  const toggleLinkBox = () => {
    setShowLinkBox(!showLinkBox);
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

        <div className="mainn">
          <div className="Person" onClick={toggleLinkBox} ref={personRef}>
            <img
              src="https://th.bing.com/th/id/R.d930651664e60ab0a9873be8e2aa3e81?rik=EBlnjyuPTTRdNg&riu=http%3a%2f%2fwww.hdwallpapersfreedownload.com%2fuploads%2flarge%2fcartoons%2fdoraemon-full.jpg&ehk=bMkOVg25D1cJaXdXQdJOjvkUi5JVCeq9jQJw6sIeDKU%3d&risl=&pid=ImgRaw&r=0"
              alt="Person"
            />
            {showLinkBox && (
              <div className="linkBox" ref={linkBoxRef}>
                <div>
                  <Link to={`/profile/${idUser}`} className="">
                    <i class="fa-solid fa-user"></i>
                    Trang cá nhân
                  </Link>
                </div>
                <div>
                  <Link to="" className="">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    Đăng xuất
                  </Link>
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

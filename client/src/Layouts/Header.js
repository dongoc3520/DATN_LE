import "./Header.css";
import logoImage from "../img/nhatro.png";
import { Link } from "react-router-dom";
import { getCookie } from "../Cookie";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { deleteAllCookies } from "../Cookie";
import { url } from "../url";
import axios from "axios";
import ChatBox from "../components/Chatbox/Chatbox";
import { useMessageContext } from "../MessageContext";

const idUser = getCookie("idUser");

function Header({ onReload }) {
  const navigate = useNavigate();
  const [showLinkBox, setShowLinkBox] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const { showMessageBox1, toggleMessageBox1 } = useMessageContext();
  const [profile, setProfile] = useState({
    name: "",
    age: 0,
    likes: 0,
    image: "",
    role: "",
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const personRef = useRef(null);
  const linkBoxRef = useRef(null);
  const messageRef = useRef(null);

  const [currentChat, setCurrentChat] = useState(null); // Lưu người đang chat

  const handleMessageItemClick = (user) => {
    setCurrentChat(user); // Hiển thị hộp chat với người đã click
    setShowMessageBox(false); // Ẩn danh sách tin nhắn
  };

  const closeChatBox = () => {
    setCurrentChat(null); // Đóng hộp chat
  };

  const handleProfileClick = () => {
    navigate(`/profile/${idUser}`, { replace: true });
    if (onReload) {
      onReload();
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
    } catch (err) {
      console.error(err);
    }
  };
  const [fakeMessages, setFakeMessages] = useState([]);
  const fetchRecentMessages = async () => {
    // Fake API dữ liệu tin nhắn
    // const fakeMessages = [
    //   {
    //     id: 1,
    //     avatar:
    //       "https://th.bing.com/th/id/OIP.9uRXtvNbvPHbtOPA6FTaQwHaLG?rs=1&pid=ImgDetMain", // URL giả ảnh đại diện
    //     name: "Nguyễn Văn A",
    //     text: "Xin chào! Hôm nay bạn thế nào?",
    //   },
    //   {
    //     id: 1,
    //     avatar:
    //       "https://th.bing.com/th/id/OIP.HsGHymmj1VAtNMgWzcmQ6gHaNs?pid=ImgDet&w=474&h=876&rs=1",
    //     name: "Lê Thu Hương",
    //     text: "Hi",
    //   },
    //   {
    //     id: 3,
    //     avatar:
    //       "https://th.bing.com/th/id/OIP.JOFMlfTiIMFMuUd-TMcwCgHaJQ?pid=ImgDet&w=474&h=592&rs=1",
    //     name: "Lê Văn C",
    //     text: "Hẹn gặp bạn vào lúc 3 giờ nhé!",
    //   },
    //   {
    //     id: 4,
    //     avatar:
    //       "https://pbs.twimg.com/profile_images/1463326625970352132/vUrHQSPd_400x400.jpg",
    //     name: "Phạm Văn D",
    //     text: "Cảm ơn bạn rất nhiều!",
    //   },
    //   {
    //     id: 5,
    //     avatar:
    //       "https://i.pinimg.com/736x/b2/97/2a/b2972a47827633c16a5a9bbfc9ec563c.jpg",
    //     name: "Hoàng Thị E",
    //     text: "Tin nhắn quan trọng, hãsh tra!",
    //   },
    //   {
    //     id: 6,
    //     avatar:
    //       "https://i.pinimg.com/736x/0c/8b/84/0c8b841585ac25f461dba0f356859808.jpg",
    //     name: "Vũ Văn F",
    //     text: "Đừng quên cuộc họp nhé dsafasdfsadfasdfasdfsadfasdfasdffsad!",
    //   },
    // ];
    try {
      const response = await axios.get(`${url}/friend/friends`, {
        withCredentials: true,
      });
      if (response && response.data) {
        console.log(response.data.friendsWithMessages);
        // Lọc và chuyển dữ liệu về định dạng mong muốn
        setFakeMessages(response.data.friendsWithMessages);
        // console.log("lklk");
        setRecentMessages(response.data.friendsWithMessages);

        // console.log("Danh sách bạn bè đã được định dạng:", formattedData);
      } else {
        console.error("Dữ liệu không hợp lệ hoặc không có bạn bè");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    // Giả lập delay giống API thật
  };

  useEffect(() => {
    fetchUsers();
    fetchRecentMessages();
  }, []);

  const toggleLinkBox = () => {
    setShowLinkBox(!showLinkBox);
  };

  const toggleMessageBox = () => {
    setShowMessageBox(!showMessageBox);
  };

  const logout = () => {
    deleteAllCookies();
    window.location.reload();
  };

  const handleClickOutside = (event) => {
    if (
      personRef.current &&
      !personRef.current.contains(event.target) &&
      linkBoxRef.current &&
      !linkBoxRef.current.contains(event.target)
    ) {
      setShowLinkBox(false);
    }
    if (messageRef.current && !messageRef.current.contains(event.target)) {
      setShowMessageBox(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header>
        <Link href="" className="logo">
          <img src={logoImage} alt="Shenlik Tech Logo" />
        </Link>
        <input className="searchPT" placeholder="" />
        <ul className="navbarr">
          <Link to="/1" className="nav-link" style={{ color: "#1773ea" }}>
            <i className="fa-solid fa-house" style={{ marginRight: "5px" }}></i>
            Căn hộ
          </Link>
          <Link to="/2" className="nav-link" style={{ color: "#1773ea" }}>
            <i className="fa-solid fa-hotel" style={{ marginRight: "5px" }}></i>
            Chung cư mini
          </Link>
          <Link to="/3" className="nav-link" style={{ color: "#1773ea" }}>
            <i
              className="fa-solid fa-user-group"
              style={{ marginRight: "5px" }}
            ></i>
            Ở ghép
          </Link>
        </ul>

        <div className="mainn">
          {/* Tin nhắn */}
          <div
            className="message_soc"
            data-tooltip-id="mess-tooltip"
            data-tooltip-content="Tin nhắn"
            onClick={toggleMessageBox}
          >
            <i className="fa-regular fa-comment"></i>
          </div>
          <Tooltip id="mess-tooltip" place="left" />
          {showMessageBox && !currentChat && (
            <div className="messageBox recent-messages" ref={messageRef}>
              <h4>
                Đoạn chat{" "}
                <i
                  class="fa-regular fa-message"
                  style={{ position: "absolute", right: "40px" }}
                ></i>{" "}
                <i
                  class="fa-solid fa-ellipsis"
                  style={{ position: "absolute", right: "10px" }}
                ></i>
              </h4>
              <div className="messageList  ">
                {recentMessages.map((message, index) => (
                  <div
                    key={index}
                    className="messageItem"
                    onClick={() => handleMessageItemClick(message)}
                  >
                    <img src={message.avatar} alt={message.name} />
                    <div className="messageDetails">
                      <span className="messageName">{message.name}</span>
                      <span className="messageText">{message.content}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trang cá nhân */}
          <div className="Person" onClick={toggleLinkBox} ref={personRef}>
            <img src={profile.image} alt="Person" />
            {showLinkBox && (
              <div className="linkBox" ref={linkBoxRef}>
                <div onClick={handleProfileClick}>
                  <i className="fa-solid fa-user"></i>
                  Trang cá nhân
                </div>
                <div onClick={logout}>
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Đăng xuất
                </div>
                <button
                  onClick={() => {
                    console.log(fakeMessages);
                  }}
                >
                  kjasjhdfkads
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {currentChat && <ChatBox chatWith={currentChat} onClose={closeChatBox} mavatar = {profile.image}/>}
    </>
  );
}

export default Header;

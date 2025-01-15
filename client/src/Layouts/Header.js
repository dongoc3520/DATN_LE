import "./Header.css";
import logoImage from "../img/nhatro.png";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "../Cookie";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { deleteAllCookies } from "../Cookie";
import { url } from "../url";
import axios from "axios";
import ChatBox from "../components/Chatbox/Chatbox";
import io from "socket.io-client"; // Import socket.io-client

// import { useMessageContext } from "../DataContext";

import { DataContext } from "../DataContext";

const idUser = getCookie("idUser");
const role = getCookie("role");

function Header({ onReload }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const navigate = useNavigate();
  const socket = io(`${url}`); // URL server backend của bạn
  const [showLinkBox, setShowLinkBox] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const { mydata, setMydata } = useContext(DataContext);
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
  const handleSendMessage2 = () => {
    const messageData = {
      idUser: parseInt(idUser),
      receiverId: parseInt(mydata.id),
      content: mydata.content1,
      senderAvatar: mydata.avatar,
    };
    const messageData2 = {
      idUser: parseInt(idUser),
      receiverId: parseInt(mydata.id),
      content: mydata.content2,
      senderAvatar: mydata.avatar,
    };
    socket.emit("newMess", messageData2);
    socket.emit("newMess", messageData);
    console.log("new mess nay nay");
  };
  const handleMessageItemClick = (user) => {
    console.log(user);
    setCurrentChat(user);
    setShowMessageBox(false);
  };

  const closeChatBox = () => {
    setCurrentChat(null);
    setMydata(null);
    setShowMessageBox(false);
  };
  const childRef = React.createRef();
  const handleClick = () => {
    console.log("Button clicked in Parent!");
    childRef.current.childFunction();
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
      //alert("Het han");
      // console.log("loi nay ");
      console.error(err);
    }
  };
  const [out, setOut] = useState(false);
  const [fakeMessages, setFakeMessages] = useState([]);
  const fetchRecentMessages = async () => {
    try {
      const response = await axios.get(`${url}/friend/friends`, {
        withCredentials: true,
      });
      if (response && response.data) {
        console.log(response.data.friendsWithMessages);

        setFakeMessages(response.data.friendsWithMessages);

        setRecentMessages(response.data.friendsWithMessages);
      } else {
        console.error("Dữ liệu không hợp lệ hoặc không có bạn bè");
      }
    } catch (error) {
      if (error.response.data.errCode === 5) {
        setOut(true);
      }
      console.log("Error fetchin", error);
      //console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRecentMessages();
  }, [showMessageBox]);

  useEffect(() => {
    if (mydata) {
      console.log("data cua toi", mydata);
      setCurrentChat(mydata);
      handleSendMessage2();
      setShowMessageBox(false);
    }
  }, [mydata]);

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

  const fetchsearch = async () => {
    try {
      const body = {
        search: debouncedQuery,
      };
      const response = await axios.post(`${url}/user/search`, body, {
        withCredentials: true,
      });
      setResults([...response.data.data]);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      fetchsearch();
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSwapTab = (mId) => {
    setResults([]);
    setQuery("");
    navigate(`/profile/${mId}`);
  };

  return (
    <>
      {out && (
        <div className="out">
          <div className="out_text">
            Tài khoản hết hạn, vui lòng đăng nhập lại
            <br />
            <button onClick={logout}>Đăng nhập lại</button>
          </div>
        </div>
      )}
      <header>
        <Link href="" className="logo">
          <img src={logoImage} alt="Shenlik Tech Logo" />
        </Link>
        <div className="input_search" style={{ flex: "1" }}>
          <input
            className="searchPT"
            placeholder="Tên người dùng..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <i class="fa-solid fa-magnifying-glass"></i>
          {results.length > 0 && (
            <div className="sub_user_search">
              {results.map((user) => (
                <div
                  className="user_item"
                  onClick={() => {
                    handleSwapTab(user.id);
                  }}
                >
                  <img
                    src={user.avatar} /* Thay bằng link ảnh thật */
                    alt="User Avatar"
                    className="user_avatar"
                  />
                  <span className="user_name">{user.name}</span>
                  <span className="user_name" style={{ color: "#0056b3" }}>
                    @{user.userName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

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
                {recentMessages.length === 0 && (
                  <span className="chuacotin" style={{ padding: "10px 5px" }}>
                    Chưa có tin nhắn nào
                  </span>
                )}
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
                  {role === "99" ? <>Dashboard</> : <>Trang cá nhân</>}
                </div>
                <div onClick={logout}>
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Đăng xuất
                </div>
                {/* <button
                  onClick={() => {
                    console.log(currentChat);
                  }}
                >
                  kjasjhdfkads
                </button> */}
              </div>
            )}
          </div>
        </div>
      </header>
      {currentChat && (
        <ChatBox
          chatWith={currentChat}
          onClose={closeChatBox}
          mavatar={profile.image}
        />
      )}
    </>
  );
}

export default Header;

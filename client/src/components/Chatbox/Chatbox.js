import { useState, useEffect } from "react";
import axios from "axios";
import { MdSend } from "react-icons/md";
import io from "socket.io-client"; // Import socket.io-client
import "./Chatbox.css";
import { getCookie } from "../../Cookie";
import { url } from "../../url";
import { useRef } from "react";

const socket = io("http://localhost:5555"); // URL server backend của bạn

function ChatBox({ chatWith, onClose, mavatar }) {
  const chatBodyRef = useRef(null);
  const lastMessageRef = useRef(null);
  const idUser = getCookie("idUser");
  const avatarU = getCookie("avatarU");
  // console.log("day la id", idUser);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newMessageNotification, setNewMessageNotification] = useState(false);
  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(`${url}/mess/get`, {
        params: {
          receiverId: parseInt(chatWith.id),
        },
        withCredentials: true,
      });
      console.log("Tin nhắn:", res.data.data);
      const formattedMessages = res.data.data.map((msg) => ({
        id: msg.id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        senderAvatar: msg.usersender.avatar,
        receiverAvatar: msg.userreceiver.avatar,
        time: msg.createdAt,
        content: msg.content,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to fetch chat history", error);
    }
  };

  useEffect(() => {
    // console.log("chat with", chatWith);
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    console.log("newMessage", newMessage);
    if (!newMessage.trim()) return;

    const messageData = {
      idUser: parseInt(idUser),
      receiverId: parseInt(chatWith.id),
      content: newMessage,
      senderAvatar: mavatar,
    };
    socket.emit("newMess", messageData);
    console.log("new mess ne");

    setNewMessage("");
  };

  // const handleSendMessage2 = async () => {
  //   const messageData = {
  //     idUser: parseInt(idUser),
  //     receiverId: parseInt(chatWith.id),
  //     content: chatWith.content1,
  //     senderAvatar: mavatar,
  //   };
  //   const messageData2 = {
  //     idUser: parseInt(idUser),
  //     receiverId: parseInt(chatWith.id),
  //     content: chatWith.content2,
  //     senderAvatar: mavatar,
  //   };
  //   socket.emit("newMess", messageData2);
  //   socket.emit("newMess", messageData);
  //   // fetchChatHistory();
  //   console.log("new mess nay nay");
  // };
  // useEffect(() => {
  //   console.log("chat with", chatWith);
  //   if (chatWith.content1 && chatWith.content2) {
  //     console.log("co vao day");
  //     handleSendMessage2();
  //   }
  // }, [chatWith]);
  useEffect(() => {
    fetchChatHistory();
    const roomData = {
      idUser: parseInt(idUser),
      receiverId: parseInt(chatWith.id),
    };
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("joinRoom", roomData);
    socket.on("newMess", (newMessage) => {
      console.log("this is new", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (newMessage.senderId !== parseInt(idUser)) {
        setNewMessageNotification(true); // Hiển thị chấm đỏ nếu tin nhắn gửi từ người khác
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [chatWith.id]);
  const isImageURL = (content) => {
    // Kiểm tra nếu content bắt đầu với "http" hoặc "https"
    return content.startsWith("http://") || content.startsWith("https://");
  };
  return (
    <div className="chat-box">
      <div className="chat-header">
        <img src={chatWith.avatar} alt={chatWith.name} />
        <span style={{ width: "60%", textAlign: "left" }}>{chatWith.name}</span>
        <button onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.senderId === parseInt(idUser) ? "sent" : "received"
            }`}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            {msg.senderId !== parseInt(idUser) && (
              <div className="message-avatar">
                <img src={msg.senderAvatar} alt="avatar" />
              </div>
            )}

            <div className="message-text">
              {isImageURL(msg.content) ? (
                <img
                  src={msg.content}
                  alt="sent-image"
                  style={{ maxWidth: "200px", borderRadius: "8px" }}
                />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={handleSendMessage}
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          <MdSend />
        </button>
      </div>
      {newMessageNotification && (
        <span className="new-message-notification">
          {/* <i class="fa-solid fa-bell"></i> */}
        </span>
      )}
    </div>
  );
}

export default ChatBox;

import { useState, useEffect } from "react";
import axios from "axios";
import { MdSend } from "react-icons/md";
import io from "socket.io-client"; // Import socket.io-client
import "./Chatbox.css";
import { getCookie } from "../../Cookie";
import { url } from "../../url";

const socket = io("http://localhost:5555"); // URL server backend của bạn

function ChatBox({ chatWith, onClose }) {
  const idUser = getCookie("idUser");
  console.log("day la id", idUser);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(`${url}/mess/get`, {
        params: {
          receiverId: parseInt(chatWith.id), // Truyền receiverId vào query
        },
        withCredentials: true, // Nếu server yêu cầu xác thực qua cookie
      });
      console.log("Tin nhắn:", res.data.data); // Dựa trên response của API
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

  const ngoc = () => {
    console.log(messages);
  };

  useEffect(() => {
    // Fetch chat history từ API

    fetchChatHistory();

    // Join room khi mở chat
    const roomData = {
      idUser: parseInt(idUser), // Thay bằng ID người dùng hiện tại
      receiverId: parseInt(chatWith.id),
    };
    socket.emit("joinRoom", roomData);

    // Lắng nghe sự kiện "newMess" từ server
    socket.on("newMess", (newMessage) => {
      console.log("this is new", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup khi component unmount
    return () => {
      socket.disconnect();
    };
  }, [chatWith]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      idUser: parseInt(idUser), // Thay bằng ID người dùng hiện tại
      receiverId: parseInt(chatWith.id),
      content: newMessage,
    };

    // Gửi tin nhắn qua socket
    socket.emit("newMess", messageData);

    // Tạm thời thêm tin nhắn vào danh sách (optimistic UI)
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        senderId: parseInt(idUser),
        text: newMessage,
        avatar: "your-avatar-url",
      },
    ]);
    setNewMessage(""); // Reset input
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
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.senderId === parseInt(idUser) ? "sent" : "received"
            }`}
          >
            {msg.senderId !== parseInt(idUser) && (
              <div className="message-avatar">
                <img src={msg.senderAvatar} alt="avatar" />
              </div>
            )}
            <div className="message-text">{msg.content}</div>
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
      <button
        onClick={() => {
          ngoc();
        }}
      >
        ÁKHDFKDASF
      </button>
    </div>
  );
}

export default ChatBox;

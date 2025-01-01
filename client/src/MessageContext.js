import React, { createContext, useState, useContext } from "react";

// Tạo Context
const MessageContext = createContext();

// Tạo Provider để bao phủ các component cần chia sẻ trạng thái
export function MessageProvider({ children }) {
  const [showMessageBox1, setShowMessageBox1] = useState(false);

  const toggleMessageBox1 = () => {
    setShowMessageBox1((prev) => !prev);
  };

  return (
    <MessageContext.Provider value={{ showMessageBox1, toggleMessageBox1 }}>
      {children}
    </MessageContext.Provider>
  );
}

// Hook custom để sử dụng Context dễ dàng
export const useMessageContext = () => useContext(MessageContext);

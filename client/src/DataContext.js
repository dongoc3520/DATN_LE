import React, { createContext, useState } from "react";

// Tạo Context
export const DataContext = createContext();

// Provider Component
export const DataProvider = ({ children }) => {
  const [mydata, setMydata] = useState(null);

  return (
    <DataContext.Provider value={{ mydata, setMydata }}>
      {children}
    </DataContext.Provider>
  );
};

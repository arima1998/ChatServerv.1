"use client";
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);
  return (
    <UserContext.Provider value={{ username, setUsername, socket, setSocket }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

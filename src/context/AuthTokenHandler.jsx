import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [Storeduser, setStoredUser] = useState(
    localStorage.getItem("userInfromation") || null
  );

  const login = (token) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
  };

  const logout = () => {
    setAccessToken(null);
    setStoredUser(null);
    localStorage.removeItem("userInformation");
    localStorage.removeItem("accessToken");
  };

  const [showLogin, setShowLogin] = useState(true);

  const user = (userInformation) => {
    setStoredUser(userInformation);
    localStorage.setItem("userInformation", JSON.stringify(userInformation));
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        showLogin,
        setShowLogin,
        user,
        Storeduser,
        setStoredUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

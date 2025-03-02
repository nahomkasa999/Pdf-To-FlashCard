import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Home from "./pages/Home/Home";
import Landing from "./pages/landing/landing";
import QuestionPage from "./components/QuestionPage/QuestionPage";
import { AuthProvider } from "./context/AuthTokenHandler"; // Import AuthProvider
import { AuthContext } from "./context/AuthTokenHandler"; // Import useAuth hook

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthWrapper />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Home" element={<Home />} />
          <Route
            path="/:userId/question/:questionId"
            element={<QuestionPage />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function AuthWrapper() {
  const { showLogin, accessToken } = useContext(AuthContext);
  return showLogin && !accessToken && <LoginPopup />;
}

export default App;

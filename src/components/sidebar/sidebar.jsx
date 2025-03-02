import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthTokenHandler";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, setShowLogin } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const storedUserInformation = localStorage.getItem("userInformation");
  const userInformation = storedUserInformation
    ? JSON.parse(storedUserInformation)
    : null;
  const token = localStorage.getItem("accessToken");

  const getQuestions = async () => {
    if (!userInformation) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/app/${userInformation.userId}/getquestions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error.message);
      setError("Failed to load questions. Please try again later.");
    }
  };

  useEffect(() => {
    if (userInformation) {
      getQuestions();
    }
  }, [userInformation]);

  const handleGetStartedClick = (questionId) => {
    navigate(`/${userInformation.userId}/question/${questionId}`);
  };

  const formatFileName = (name) => {
    const maxLength = 25;
    return name.length > maxLength
      ? `${name.slice(0, 7)}...${name.slice(-9)}`
      : name;
  };

  const handleLogin = () => setShowLogin(true);

  const handleLogout = () => {
    logout();
    setShowLogin(false);
    navigate("/Home");
  };

  const handleDeleteNote = async (questionId) => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("userInformation");
    const userId = JSON.parse(user).userId;

    try {
      axios.delete(
        `http://localhost:5000/app/${userId}/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to delete question. Please try again later");
    }
  };

  return (
    <>
      <div className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </div>

      <div className="home" onClick={() => navigate("/Home")}>
        <p>Home</p>
      </div>

      {!userInformation ? (
        <div className="user-info">
          <button className="auth-button" onClick={handleLogin}>
            Login
          </button>
        </div>
      ) : (
        <div className="user-info">
          <span>{userInformation.userName}</span>
          <button className="auth-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef}>
        <div className="sidebar-content">
          <h3>Saved FlashCards</h3>
          <hr />
          {error && <p className="error">{error}</p>}
          {questions.length ? (
            questions.map((question) => (
              <div key={question._id} className="question">
                <h3 onClick={() => handleGetStartedClick(question._id)}>
                  {formatFileName(question.name)}
                </h3>
                <button
                  onClick={() => handleDeleteNote(question._id)}
                  className="delete"
                >
                  {" "}
                  Delete{" "}
                </button>
              </div>
            ))
          ) : (
            <p>No questions found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

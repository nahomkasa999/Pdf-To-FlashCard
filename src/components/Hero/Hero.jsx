import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/Home");
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
          Transform PDFs into Interactive Flashcards
        </h1>
        <p className="hero-subtitle">
          Simplify your study sessions by turning dense documents into
          bite-sized learning tools. Start your journey to smarter learning
          today!
        </p>
        <div className="hero-buttons">
          <button
            className="hero-signin-button"
            onClick={handleGetStartedClick}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

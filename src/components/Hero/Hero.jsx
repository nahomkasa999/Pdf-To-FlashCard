import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

import "./Hero.css";

const Hero = () => {
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
          <SignInButton>
            <button className="hero-signin-button">Get Started</button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
};

export default Hero;

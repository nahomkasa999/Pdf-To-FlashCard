import React from "react";
import "./Navigation.css";

function Navigation() {
  return (
    <div className="Navigation">
      <div className="Navigation_container">
        <a href="#Home">Home</a>
        <a href="#About">About</a>
        <a href="#HowToUse">How To use</a>
        <a href="#Testimonials">Testimonials</a>
        <a href="#Footer">Contact Me</a>
      </div>
    </div>
  );
}

export default Navigation;

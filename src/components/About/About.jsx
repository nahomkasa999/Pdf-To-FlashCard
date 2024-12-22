import React from "react";
import "./About.css";
import gridItems from "../../assets/AboutGrid";

function About() {
  return (
    <div className="About" id="About">
      <h1>Why Use This Tool?</h1>
      <div className="AboutwhyElementContainer">
        {gridItems.gridItems.map((item) => (
          <div className="grid-item" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;

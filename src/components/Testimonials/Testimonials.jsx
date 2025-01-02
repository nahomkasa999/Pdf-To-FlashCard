import React from "react";
import "./Testimonials.css";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      feedback: "This app has completely transformed how I manage my tasks!",
      avatar: "https://via.placeholder.com/100",
    },
    {
      name: "Jane Smith",
      feedback: "Amazing tool, easy to use and super effective!",
      avatar: "https://via.placeholder.com/100",
    },
    {
      name: "Alex Johnson",
      feedback:
        "Highly recommend this to anyone looking to boost productivity!",
      avatar: "https://via.placeholder.com/100",
    },
  ];

  return (
    <div className="testimonials-section" id="Testimonials">
      <h2>What Our Users Say</h2>
      <div className="testimonials">
        {testimonials.map((testimonial, index) => (
          <div className="testimonial" key={index}>
            <img src={testimonial.avatar} alt={`${testimonial.name} avatar`} />
            <p className="feedback">"{testimonial.feedback}"</p>
            <p className="name">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

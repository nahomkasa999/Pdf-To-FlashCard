import React from "react";
import Navigation from "../../components/Navigation/Navigation";
import Hero from "../../components/Hero/Hero";
import About from "../../components/About/About";
import HowToUse from "../../components/HowToUse/HowToUse";
import Footer from "../../components/Footer/Footer";
import { Testimonials } from "../../components/Testimonials/Testimonials";
import "./Landing.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Landing = () => {
  return (
    <div className="landing-page">
      <Navigation />
      <div className="hero-section">
        <Hero />
      </div>
      <About />
      <HowToUse />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Landing;

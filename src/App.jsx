import React from "react";
import Navigation from "./components/Navigation/Navigation";
import Header from "./components/Header/Header";
import About from "./components/About/About";
import HowToUse from "./components/HowToUse/HowToUse";
import Footer from "./components/Footer/Footer";
import Question from "./components/Question/Question";

function App() {
  return (
    <div>
      <Navigation />
      <Header />
      {Object.keys(Question) === 0 ? "" : <Question />}
      <About />
      <HowToUse />
      <Footer />
    </div>
  );
}

export default App;

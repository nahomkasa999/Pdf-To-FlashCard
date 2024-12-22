import React, { useState } from "react";
import Questions from "../../assets/Question";
import "./Question.css";

function Question() {
  const [showDetails, setShowDetails] = useState(
    Questions.map(() => ({ showAnswer: false, showExtra: false }))
  );

  const toggleAnswer = (index) => {
    setShowDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, showAnswer: !detail.showAnswer } : detail
      )
    );
  };

  const toggleExtra = (index) => {
    setShowDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, showExtra: !detail.showExtra } : detail
      )
    );
  };

  return (
    <div className="Question" id="Question">
      <h1>FlashCard Generated:</h1>
      {Questions.map((question, index) => (
        <div className="QuestionBox" key={index}>
          <h3>Q: {question.Q}</h3>
          {showDetails[index].showAnswer && <p>A: {question.A}</p>}
          {showDetails[index].showAnswer && showDetails[index].showExtra && (
            <p>Extra: {question.Extra}</p>
          )}
          <>
            <button onClick={() => toggleAnswer(index)}>
              {showDetails[index].showAnswer ? "Hide" : "Show Answer"}
            </button>

            {showDetails[index].showAnswer && (
              <button onClick={() => toggleExtra(index)}>
                {showDetails[index].showExtra ? "Hide Extra" : "Show Extra"}
              </button>
            )}
          </>
        </div>
      ))}
    </div>
  );
}

export default Question;

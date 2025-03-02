import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import "./QuestionPage.css";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { userId, questionId } = useParams();
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReading, setIsReading] = useState(true); // Toggle state
  const [showDetails, setShowDetails] = useState([]); // Controls visibility of answers & extra info

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/app/${userId}/getsinglequestion/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestionData(response.data);
        setShowDetails(
          new Array(response.data.questions.length).fill({
            showAnswer: false,
            showExtra: false,
          })
        );
      } catch (err) {
        setError("Failed to fetch question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [userId, questionId]);

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

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
    return (
      <>
        <div className="home" onClick={() => navigate("/Home")}>
          <p>Home</p>
        </div>
        <p>
          Failed to load questions. Please try again later. Return to{" "}
          <b onClick={() => navigate("/Home")}>Home</b>
        </p>
      </>
    );
  }
  if (!questionData || !questionData.questions)
    return <p>No questions available</p>;

  return (
    <>
      <Sidebar />
      <div>
        <div className="btnnav">
          <h1>{questionData.name}</h1>
          <>
            {/* Toggle Button for Reading Mode */}
            <button onClick={() => setIsReading(!isReading)}>
              {isReading ? "Study Mode" : "Reading Mode"}
            </button>
          </>
        </div>

        <div className="questions">
          {questionData.questions.map((question, index) => (
            <div key={index} className={`question-box`}>
              <h3>{question.Q}</h3>

              {isReading ? (
                <>
                  <p>A: {question.A}</p>
                  {question.Extra && (
                    <p>
                      <strong>Extra:</strong> {question.Extra}
                    </p>
                  )}
                </>
              ) : (
                <>
                  {/* Show/Hide Answer */}
                  {showDetails[index]?.showAnswer && <p>A: {question.A}</p>}
                  {showDetails[index]?.showExtra && (
                    <p>
                      <strong>Extra:</strong> {question.Extra}
                    </p>
                  )}

                  {/* Button Container (Always at the Bottom) */}
                  <div className="button-container">
                    {showDetails[index]?.showAnswer ? (
                      <button onClick={() => toggleAnswer(index)}>
                        Hide Answer
                      </button>
                    ) : (
                      <button onClick={() => toggleAnswer(index)}>
                        Show Answer
                      </button>
                    )}

                    {showDetails[index]?.showAnswer &&
                      (showDetails[index]?.showExtra ? (
                        <button onClick={() => toggleExtra(index)}>
                          Hide Extra
                        </button>
                      ) : (
                        <button onClick={() => toggleExtra(index)}>
                          Show Extra
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuestionPage;

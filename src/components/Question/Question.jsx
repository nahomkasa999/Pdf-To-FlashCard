import React, { useState, useContext, useEffect } from "react";
import { TextExtractedContext } from "../../context/TextExtractedContext";
import toast, { Toaster } from "react-hot-toast";
import "./Question.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthTokenHandler";

function Question() {
  const {
    TextExtracted,
    BeginGeneration,
    setBeginGeneration,
    setDownloadReady,
    startDownload,
    setStartDownload,
    generateReady,
    setGenerateReady,
    fileName,
    pageNumbers,
  } = useContext(TextExtractedContext);

  const { login, setShowLogin, user } = useContext(AuthContext);

  const [Questions, setQuestions] = useState([]);
  const [showDetails, setShowDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    if (BeginGeneration) {
      let userChoice = true;
      if (Questions.length > 0) {
        userChoice = window.confirm(
          "Do you want to add new flashcards to the existing ones? Click 'Cancel' to replace the existing flashcards."
        );
      }

      if (!userChoice) {
        setQuestions([]);
        setShowDetails([]);
      }
      setIsLoading(true);
      const values = TextExtracted.map((PageTextExtracted) => {
        return fetch("http://localhost:5000/generate/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Text: [PageTextExtracted],
          }),
        });
      });

      Promise.all(values)
        .then((responses) => {
          if (responses.every((response) => response.ok)) {
            return Promise.all(responses.map((response) => response.json()));
          } else {
            throw new Error("An error occurred while generating content.");
          }
        })
        .then((data) => {
          // Assuming 'data' is the array of flashcard objects
          const newQuestions = data.map((flashcardsReceived) => {
            const questions = flashcardsReceived.flashcard;
            questions.map((question) => {
              return {
                Q: question.Q, // Use 'Q' directly
                A: question.A, // Use 'A' directly
                Extra: question.Extra || "", // 'Extra' can be empty if not provided
              };
            });
            return questions;
          });

          let flatArray = [].concat(...newQuestions);
          console.log(flatArray);

          setQuestions(flatArray);

          setShowDetails(
            flatArray.map(() => ({ showAnswer: false, showExtra: false }))
          );

          // Resetting states
          setBeginGeneration(false);
          setDownloadReady(true);
        })
        .catch((error) => {
          setPopup(true);
          setGenerateReady(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [BeginGeneration, TextExtracted, setBeginGeneration, Questions]);

  // Toggle answer visibility
  const toggleAnswer = (index) => {
    setShowDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, showAnswer: !detail.showAnswer } : detail
      )
    );
  };

  // Toggle extra details visibility
  const toggleExtra = (index) => {
    setShowDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, showExtra: !detail.showExtra } : detail
      )
    );
  };

  const generateCsvDownload = () => {
    if (Questions.length === 0) {
      alert("No questions available to generate CSV.");
      return;
    }

    const escapeCSV = (text) => {
      if (!text) return '""';
      return `"${text.replace(/"/g, '""').replace(/\n/g, "<br>")}"`;
    };

    const csvRows = [];
    const header = ["#separator:,", "#html:true", "Question,Answer,Tags"];
    csvRows.push(...header);

    Questions.forEach((question) => {
      const answerWithExtra = question.Extra
        ? `${question.A}<hr><div class="extra"><hr><br>${question.Extra}</div>`
        : question.A;

      const row = [
        escapeCSV(question.Q),
        escapeCSV(answerWithExtra),
        '"Gemini-Generated"',
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "\ufeff" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `flashcards_${timestamp}.csv`;

    const link = document.createElement("a");
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    alert(`Successfully generated CSV file: ${filename}`);
  };

  useEffect(() => {
    if (startDownload) {
      generateCsvDownload();
      setStartDownload(false);
    }
  }, [startDownload, setStartDownload]);

  const handleReGenerate = () => {
    setQuestions([]);
    setShowDetails([]);
    setBeginGeneration(true);
    setPopup(false);
  };

  const [bookmarked, setBookmarked] = useState([]);

  const toggleBookmark = (index) => {
    setBookmarked((prevBookmarked) => {
      const updatedBookmarked = [...prevBookmarked];
      updatedBookmarked[index] = !updatedBookmarked[index];
      return updatedBookmarked;
    });
  };
  //"questions":[{Q:"question",A:"answer",Extra:"extra"},{Q:"question",A:"answer",Extra:"extra"}]
  const handleSave = async () => {
    const user = localStorage.getItem("userInformation");

    if (!user) {
      toast.error("You must be logged in to save questions", {
        duration: 4000,
        style: {
          background: "white",
          border: "2px solidrgb(251, 111, 111)",
          color: "#6a41af",
          padding: "16px",
          borderRadius: "8px",
        },
      });
      setShowLogin(true);
      return;
    }

    const userId = JSON.parse(user).userId;
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post(
        `http://localhost:5000/app/${userId}/savequestions`,
        {
          name: `${fileName}-(${pageNumbers.startPage} - ${pageNumbers.endPage})`,
          questions: Questions,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Questions saved successfully", {
        duration: 4000,
        style: {
          background: "white",
          color: "#6a41af",
          padding: "16px",
          borderRadius: "8px",
        },
      });
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to save questions. Please try again later.", {
        duration: 4000,
        style: {
          background: "white",
          color: "#6a41af",
          padding: "16px",
          borderRadius: "8px",
        },
      });
    }
  };

  return (
    <div className="Question" id="Question">
      <h1>FlashCards Generated:</h1>

      <div>
        {isLoading && !popup && <div class="loader"></div>}
        {popup ? (
          <div className="popup">
            <h2>
              Hmmmm... There is a lot of page, minimizing might help and try
              again{" "}
            </h2>
            <button className="active" onClick={handleReGenerate}>
              Re-Generate Flashcard
            </button>
          </div>
        ) : (
          " "
        )}
      </div>

      {Questions.length > 0 ? (
        <>
          <div>
            {" "}
            <button className="active" onClick={handleSave}>
              save
            </button>
            <Toaster />
          </div>

          {Questions.map((question, index) => (
            <div
              className={`QuestionBox ${bookmarked[index] ? "bookmarked" : ""}`}
              key={index}
              onClick={() => toggleBookmark(index)} // Clicking the question box toggles the bookmark
            >
              <h3>Q: {question.Q}</h3>
              {showDetails[index]?.showAnswer && <p>A: {question.A}</p>}
              {showDetails[index]?.showAnswer &&
                showDetails[index]?.showExtra && <p>Extra: {question.Extra}</p>}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAnswer(index);
                }}
              >
                {showDetails[index]?.showAnswer ? "Hide" : "Show Answer"}
              </button>
              {showDetails[index]?.showAnswer && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExtra(index);
                  }}
                >
                  {showDetails[index]?.showExtra ? "Hide Extra" : "Show Extra"}
                </button>
              )}
            </div>
          ))}
        </>
      ) : (
        <p>No flashcards generated yet.</p>
      )}
    </div>
  );
}

export default Question;

import React, { useState, useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { TextExtractedContext } from "../../context/TextExtractedContext";
import "./Question.css";

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
  } = useContext(TextExtractedContext);
  const { isSignedIn, user, isLoaded } = useUser();

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
      console.log(user);
      setIsLoading(true);
      const values = TextExtracted.map((PageTextExtracted) => {
        return fetch("http://localhost:5000/gemini", {
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
            console.log(questions);
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

  // Trigger CSV download when startDownload is true
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
        Questions.map((question, index) => (
          <div className="QuestionBox" key={index}>
            <h3>Q: {question.Q}</h3>
            {showDetails[index]?.showAnswer && <p>A: {question.A}</p>}
            {showDetails[index]?.showAnswer &&
              showDetails[index]?.showExtra && <p>Extra: {question.Extra}</p>}
            <button onClick={() => toggleAnswer(index)}>
              {showDetails[index]?.showAnswer ? "Hide" : "Show Answer"}
            </button>
            {showDetails[index]?.showAnswer && (
              <button onClick={() => toggleExtra(index)}>
                {showDetails[index]?.showExtra ? "Hide Extra" : "Show Extra"}
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No flashcards generated yet.</p>
      )}
    </div>
  );
}

export default Question;

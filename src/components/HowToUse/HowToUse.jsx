import React from "react";
import "./HowToUse.css";
import { Images } from "../../assets/HowToUseJson";
function HowToUse() {
  return (
    <div className="HowToUse" id="HowToUse">
      <h1>How To Use</h1>
      <div className="HowToUseStepContainer">
        <div className="HowToUseContainer">
          <h3>1. Upload Your PDF</h3>
          <div className="ImageTextContainer">
            <div className="image">
              <img src={Images.DragDrop} alt="" srcSet="" />
              <img src={Images.StartEnd} alt="" srcset="" />
            </div>
            <div className="text">
              <p>
                Enter the <b>starting</b> and <b>ending page</b> numbers for
                flashcard generation. Example: If unit 5 starts at '50/300' and
                ends at '80/300', input [5] (start) and [80] (for end).
              </p>
              <p>
                {" "}
                <b>Note:</b> Use display page numbers (e.g., 50/300), not
                textbook page numbers. Also{" "}
                <b>
                  <i>
                    {" "}
                    Starting page must be greater the ending page by at least
                    one page
                  </i>
                </b>
              </p>
            </div>
          </div>
        </div>
        <div className="HowToUseContainer">
          <h3>2. Click 'Generate Flashcards'</h3>
          <div className="ImageTextContainer">
            <img src={Images.Generate} alt="" srcSet="" />
            <p>Click 'Generate Flashcards' and wait 10–20 seconds.</p>
          </div>
        </div>
        <div className="HowToUseContainer">
          <h3>3. Preview Flashcards</h3>
          <div className="ImageTextContainer">
            <img src={Images.FlashCard} alt="" srcset="" />
            <p>Review the flashcards to ensure accuracy.</p>
          </div>
        </div>
        <div className="HowToUseContainer">
          <h3>4. Download the CSV File</h3>
          <div className="ImageTextContainer">
            <img src={Images.Download} alt="" srcSet="" />
            <p>Download and save the flashcard CSV file to your device.</p>
          </div>
        </div>
        <h3>5. Import into Anki</h3>
        <div className="ImageTextContainerfive">
          <div className="sectionOne">
            <img src={Images.Anki} alt="" srcSet="" />
            <p>Open the Anki app.</p>
          </div>
          <div className="sectionOne">
            <p>Click the three dots (menu)</p>
            <img src={Images.AnkiDot} alt="" />
          </div>
          <div className="sectionOne">
            <img src={Images.AnkiImport} alt="" srcSet="" />
            <p>Select 'Import' and upload the downloaded CSV file.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowToUse;

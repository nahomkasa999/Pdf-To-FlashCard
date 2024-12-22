import Anki from "./Anki.jpg";
import AnkiDot from "./Anki-Dot.jpg";
import AnkiImport from "./Anki-Import.jpg";
import DragDrop from "./DragDrop.jpg";
import Generate from "./Generate.jpg";
import Download from "./Download.jpg";
import StartEnd from "./StartEnd.PNG";
import FlashCard from "./FlashCard.PNG";

const HowToUseJson = [
  {
    heading: "1. Upload Your PDF",
    text: "Enter the starting and ending page numbers for flashcard generation. Example: If unit 5 starts at '50/300' and ends at '80/300', input [5] (start) and [80] (for end). Note: Use display page numbers (e.g., 50/300), not textbook page numbers.",
    image: Anki,
  },
  {
    heading: "2. Click 'Generate Flashcards'",
    text: "Click 'Generate Flashcards' and wait 10–20 seconds.",
    image: "",
  },
  {
    heading: "3. Preview Flashcards",
    text: "Review the flashcards to ensure accuracy.",
    image: "",
  },
  {
    heading: "4. Download the CSV File",
    text: "Download and save the flashcard CSV file to your device.",
    image: "",
  },
];

export default HowToUseJson;

export const Images = {
  Anki,
  AnkiDot,
  AnkiImport,
  Download,
  Generate,
  DragDrop,
  StartEnd,
  FlashCard,
};

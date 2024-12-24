import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"; // Import GlobalWorkerOptions
import "./Header.css";
import Question from "../Question/Question";

function Header(props) {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [generateReady, setGenerateReady] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [startPage, setStartPage] = useState(75);
  const [endPage, setEndPage] = useState(86);

  const TextExtracted = [];

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      maxFiles: 1,
      accept: ".pdf",
      onDrop: () => {
        setFileUploaded(true);
      },
    });

  // Set the path for the worker script to resolve the 'No "GlobalWorkerOptions.workerSrc" specified' error
  useEffect(() => {
    // Path to the worker script
    GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs"; // Update this to your actual path or use a CDN path
  }, []);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = function () {
        const typedArray = new Uint8Array(this.result);
        const loadingTask = getDocument(typedArray);
        loadingTask.promise
          .then((pdf) => {
            for (let i = startPage; i <= endPage; i++) {
              const page = pdf.getPage(i);
              page.then((pages) => {
                pages.getTextContent().then((text) => {
                  const PageSeparateText = text.items.map((item) => item.str); // this returns an array of text from the page
                  const PageText = PageSeparateText.join(" "); // this joins the array of text into a single string
                  if (PageText.length > 100) {
                    const divisor = Math.floor(PageText.length / 100);
                    for (let i = 0; i < divisor; i++) {
                      TextExtracted.push(
                        PageText.substring(i * 100, (i + 1) * 100)
                      );
                    }
                  }
                });
              });
            }
            setGenerateReady(true);
            console.log(TextExtracted);
          })
          .catch((error) => {
            console.error("Error loading PDF:", error);
            setGenerateReady(false);
          });
      };
      reader.readAsArrayBuffer(file);
    }
  }, [acceptedFiles]);

  // Mapping accepted files to display
  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  // Handling rejected files (e.g., if a non-PDF file is uploaded)
  const rejectedFiles = fileRejections.map(({ file }) => (
    <li key={file.name}>{file.name} - Rejected (not a PDF)</li>
  ));

  return (
    <div className="Header" id="Home">
      <div className="HeaderContainer">
        <div className="HeaderTitle">
          <h1>PDF To FlashCard</h1>
          <p>Turn PDFs into FlashCards - Fast, Simple, Effective</p>
        </div>
        <div className="Drag_Drop_container">
          <div
            {...getRootProps({
              className: "dropzone",
            })}
          >
            <input {...getInputProps()} />
            {files.length <= 0 ? (
              <p>Drag 'n' drop some files here, or click to select files</p>
            ) : (
              <h3> {files} </h3>
            )}
          </div>
          <aside>
            {rejectedFiles.length > 0 && (
              <div>
                <h4 className={rejectedFiles.length > 0 ? "Rejected" : "hide"}>
                  Rejected Files
                </h4>
                <ul className={rejectedFiles.length > 0 ? "Rejected" : "hide"}>
                  {rejectedFiles}
                </ul>
              </div>
            )}
          </aside>
          <div className="PdfAction">
            <div className="InputsContainer">
              <input
                type="number"
                className="startPage PageInput"
                placeholder="Start page"
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
              />
              <input
                type="number"
                className="endPage PageEnd"
                placeholder="End page"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
              />
            </div>
            <div className="ActionBtn">
              <button
                className={
                  generateReady ? "generateFlashcard active" : "inactive"
                }
              >
                Generate Flashcard
              </button>
              <button
                onClick={() => {
                  setDownloadReady(true);
                }}
                className={
                  downloadReady && generateReady
                    ? "DownloadCSV active"
                    : "inactive"
                }
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;

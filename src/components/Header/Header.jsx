import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "./Header.css";

function Header(props) {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [generateReady, setGenerateReady] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      maxFiles: 1,
      accept: ".pdf",
      onDrop: () => {
        setFileUploaded(true);
      },
    });

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

  // Update generateReady state when conditions change
  useEffect(() => {
    if (fileUploaded && startPage && endPage && startPage < endPage) {
      setGenerateReady(true);
    } else {
      setGenerateReady(false);
    }
  }, [fileUploaded, startPage, endPage]);

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
                  downloadReady & generateReady
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

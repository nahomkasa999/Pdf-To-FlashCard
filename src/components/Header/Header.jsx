import React, { useState, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import "./Header.css";
import { TextExtractedContext } from "../../context/TextExtractedContext";

function Header() {
  const [fileUploaded, setFileUploaded] = useState(false);

  const {
    setTextExtracted,
    setBeginGeneration,
    startPage: contextStartPage,
    setStartPage,
    endPage: contextEndPage,
    setEndPage,
    setDownloadReady,
    downloadReady,
    setStartDownload,
    generateReady,
    setGenerateReady,
    fileName,
    setFileName,
    setPageNumbers,
  } = useContext(TextExtractedContext);

  const [startPage, setLocalStartPage] = useState(
    parseInt(contextStartPage) || 1
  );
  const [endPage, setLocalEndPage] = useState(parseInt(contextEndPage) || 1);
  const [inputError, setInputError] = useState({
    manypage: false,
    negativeValue: false,
    WrongFormat: false,
  });

  useEffect(() => {
    setInputError({
      manypage: endPage - startPage > 15,
      negativeValue: endPage < startPage,
      WrongFormat: startPage <= 0 || endPage <= 0,
    });
  }, [startPage, endPage]);

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      maxFiles: 1,
      accept: ".pdf",
      onDrop: () => setFileUploaded(true),
    });

  useEffect(() => {
    GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";
  }, []);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const loadingTask = getDocument(typedArray);

        try {
          const pdf = await loadingTask.promise;
          if (
            startPage > 0 &&
            endPage >= startPage &&
            endPage <= pdf.numPages &&
            endPage - startPage < 15
          ) {
            const extractedText = [];
            for (let i = startPage; i <= endPage; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item) => item.str)
                .join(" ");
              extractedText.push(pageText);
            }
            setTextExtracted(extractedText);
            setGenerateReady(true);
            setPageNumbers((prev) => ({
              ...prev,
              startPage: startPage,
              endPage: endPage,
            }));
          } else {
            setGenerateReady(false);
            setInputError((prev) => ({ ...prev, WrongFormat: true }));
          }
        } catch (error) {
          console.error("Error loading PDF:", error);
          setGenerateReady(false);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  }, [acceptedFiles, startPage, endPage, setTextExtracted]);

  const files = acceptedFiles.map(
    (file) => (
      setFileName(file.name),
      (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      )
    )
  );

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
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            {files.length <= 0 ? (
              <p>Drag 'n' drop some files here, or click to select files</p>
            ) : (
              <h3>{files}</h3>
            )}
          </div>
          <aside>
            {rejectedFiles.length > 0 && (
              <div>
                <h4 className="Rejected">Rejected Files</h4>
                <ul className="Rejected">{rejectedFiles}</ul>
              </div>
            )}
          </aside>
          <div className="PdfAction">
            <div className="InputsContainer">
              <input
                type="number"
                className={
                  inputError.manypage ||
                  inputError.negativeValue ||
                  inputError.WrongFormat
                    ? "inputError"
                    : "startPage pageInput"
                }
                placeholder="Start page"
                value={startPage}
                onChange={(e) => setLocalStartPage(parseInt(e.target.value))}
              />
              <input
                type="number"
                className={
                  inputError.manypage ||
                  inputError.negativeValue ||
                  inputError.WrongFormat
                    ? "inputError"
                    : "endPage pageInput"
                }
                placeholder="End page"
                value={endPage}
                onChange={(e) => setLocalEndPage(parseInt(e.target.value))}
              />
              {inputError.manypage && (
                <span>
                  From start page to end page should be less than 15 pages
                </span>
              )}
              {inputError.negativeValue && (
                <span>End page cannot be less than start page</span>
              )}
            </div>
            <div className="ActionBtn">
              <button
                className={
                  generateReady ? "generateFlashcard active" : "inactive"
                }
                onClick={() => setBeginGeneration(true)}
              >
                Generate Flashcard
              </button>
              <button
                className={
                  downloadReady && generateReady
                    ? "DownloadCSV active"
                    : "inactive"
                }
                onClick={() => setStartDownload(true)}
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

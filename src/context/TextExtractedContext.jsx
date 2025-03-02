import React, { createContext, useState } from "react";

export const TextExtractedContext = createContext();

export const TextExtractedProvider = ({ children }) => {
  const [TextExtracted, setTextExtracted] = useState("");
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");
  const [BeginGeneration, setBeginGeneration] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [startDownload, setStartDownload] = useState(false);
  const [generateReady, setGenerateReady] = useState(false);
  const [fileName, setFileName] = useState("");
  const [pageNumbers, setPageNumbers] = useState({
    startPage: 0,
    endPage: 0,
  });
  return (
    <TextExtractedContext.Provider
      value={{
        TextExtracted,
        setTextExtracted,
        BeginGeneration,
        setBeginGeneration,
        startPage,
        setStartPage,
        endPage,
        setEndPage,
        downloadReady,
        setDownloadReady,
        startDownload,
        setStartDownload,
        generateReady,
        setGenerateReady,
        fileName,
        setFileName,
        pageNumbers,
        setPageNumbers,
      }}
    >
      {children}
    </TextExtractedContext.Provider>
  );
};

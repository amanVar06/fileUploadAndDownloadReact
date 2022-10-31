import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

import App from "../components/App";
import Header from "../components/Header";
import FilesList from "../components/FilesList";

const AppRouter = () => {
  const [previewSrc, setPreviewSrc] = useState(""); // state for storing previewImage
  const [pdfFile, setPdfFile] = useState(false);
  return (
    <BrowserRouter>
      <div className="container">
        <Header />
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <App
                  pdfFile={pdfFile}
                  setPdfFile={setPdfFile}
                  previewSrc={previewSrc}
                  setPreviewSrc={setPreviewSrc}
                />
              }
            />
            <Route
              path="/list"
              element={
                <FilesList
                  previewSrc={previewSrc}
                  setPreviewSrc={setPreviewSrc}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;

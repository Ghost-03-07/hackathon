import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StartingPage from "./src/startingPage";
import "./style.css";

const App = () => {
  return (
    <>
      <StartingPage />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

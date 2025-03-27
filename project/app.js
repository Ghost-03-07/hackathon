import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./src/layout";
import StartingPage from "./src/startingPage";
import IdentificationPage from "./src/identificationPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StartingPage />} />
          <Route path="identification" element={<IdentificationPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/300");

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1>Identity Verification</h1>
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      {/* Center Image Section */}
      <div className="center-image-container">
        <img src={imageUrl} alt="Verification" className="center-image" />
        <input
          type="text"
          placeholder="Enter Image URL"
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      {/* Introduction Section */}
      <section className="introduction">
        <h2>Secure Identity Verification with Blockchain</h2>
        <p>
          Our platform ensures secure and seamless identity verification using
          the power of blockchain technology.
        </p>
      </section>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

import React, { useState } from "react";

const StartingPage = () => {
  // Define state for the image URL
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/300");

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1>Identity Verification</h1>
        <ul>
          <li>
            <a href="startingpage.js">Home</a>
          </li>
          <li>
            <a href="#IdentifyPage">Identity</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      {/* Circular Image Holder */}
      <div className="founder-image-container">
        <img
          src="https://via.placeholder.com/200"
          alt="Founder"
          className="founder-image"
        />
      </div>

      {/* Introduction Section */}
      <section className="introduction-section"></section>
    </div>
  );
};

export default StartingPage;

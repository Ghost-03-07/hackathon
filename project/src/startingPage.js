import React, { useState, useEffect } from "react";

const StartingPage = () => {
  // Define state for the image URL
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/300");
  const headings = [
    "Identity Verification",
    "Secure Your Identity",
    "Blockchain-Powered Security",
    "Trusted Verification Platform",
  ];
  const [heading, setHeading] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentHeading = headings[index];
    const typingSpeed = isDeleting ? 100 : 200;
    const timer = setTimeout(() => {
      setHeading(currentHeading.substring(0, charIndex));
      if (!isDeleting && charIndex === currentHeading.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setIndex((prevIndex) => (prevIndex + 1) % headings.length);
      }
      setCharIndex((prevCharIndex) => prevCharIndex + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, index]);

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar animate-navbar">
        <h1 className="typing-heading">{heading}</h1>
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

      <hr className="end-line"></hr>

      {/* Circular Image Holder */}
      <div className="founder-image-container">
        <img
          src="https://via.placeholder.com/200"
          alt="Founder"
          className="founder-image"
        />
      </div>

      <hr className="end-line"></hr>

      {/* Introduction Section */}
      <section className="introduction-section">
        <h2>Introduction to your product</h2>
        <p></p>
      </section>
    </div>
  );
};

export default StartingPage;

import React, { useState, useEffect } from "react";
import "../style.css";
import { motion } from "framer-motion";

const StartingPage = () => {
  const founderNames = ["Abhishek Bisht", "Amit Kumar", "Varun Bahuguna"];
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentName = founderNames[index];
    const typingSpeed = isDeleting ? 100 : 150;

    if (!isDeleting && charIndex < currentName.length) {
      setTimeout(() => {
        setDisplayText(currentName.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      setTimeout(() => {
        setDisplayText(currentName.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === currentName.length) {
      setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setIndex((prevIndex) => (prevIndex + 1) % founderNames.length);
    }
  }, [charIndex, isDeleting, index, founderNames]);

  return (
    <motion.div
      className="app-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <motion.section className="hero-section">
        <motion.nav
          className="navbar animate-navbar"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <h1 className="static-heading">Identity Verification & Security</h1>
          <ul>
            {["Home", "Identity", "About", "Contact"].map((item, idx) => (
              <motion.li
                key={idx}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <a href={`#${item.toLowerCase()}`}>{item}</a>
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        <motion.div
          className="founder-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="founder-image-container"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1, type: "spring" }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.img
              src="https://via.placeholder.com/300"
              alt="Founder"
              className="founder-image"
              whileHover={{ rotate: -10, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          <motion.div className="founder-name-container">
            <motion.h2
              className="founder-name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              BY {displayText}
              <motion.span
                className="cursor"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                |
              </motion.span>
            </motion.h2>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Introduction Section */}
      <motion.section
        className="introduction-section"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, type: "spring" }}
      >
        <h2>Welcome to Our Secure Platform</h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Experience next-level identity security with blockchain-powered
          verification and trusted authentication processes.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StartingPage;

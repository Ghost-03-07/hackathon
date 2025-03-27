import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./style/style.css";

const AnimatedLine = () => {
  return (
    <motion.hr
      className="sep-line"
      initial={{ width: "12rem", background: "var(--accent-color)" }}
      animate={{
        width: ["12rem", "2rem", "12rem"],
        height: ["0.2rem", "0.2rem", "0.2rem"],
        background: ["var(--accent-color)"],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      }}
    />
  );
};

const StartingPage = () => {
  const founderNames = ["Abhishek", "Amit", "Varun"];
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
      transition={{ duration: 1.5 }}
    >
      <motion.section className="hero-section">
        <motion.div className="founder-section">
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
            <motion.h2 className="founder-name">
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
      <motion.div>
        <motion.section className="introduction-head">
          <AnimatedLine />
          <h1>What's in here!</h1>
        </motion.section>
        <motion.div className="introduction-div">
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
      </motion.div>
    </motion.div>
  );
};

export default StartingPage;

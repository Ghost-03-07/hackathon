import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";
import "./style/layout.css";

const Layout = () => {
  return (
    <motion.div
      className="layout-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Navbar */}
      <motion.nav
        className="navbar animate-navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        <h1>Identity</h1>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/identification">Identity</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </motion.nav>

      {/* Main content container */}
      <main className="content">
        <Outlet />
      </main>

      {/* Footer - Will only appear when enough space is available */}
      <motion.footer
        className="footer"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <section className="footer-section">
          <div className="footer-content">
            <p>
              © {new Date().getFullYear()} Identity Verification & Security. All
              Rights Reserved.
            </p>
            <ul className="footer-links">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={24} /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={24} /> LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:your.email@gmail.com">
                  <FaEnvelope size={24} /> Gmail
                </a>
              </li>
            </ul>
          </div>
        </section>
      </motion.footer>
    </motion.div>
  );
};

export default Layout;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";

const IdentificationPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log("Uploading file:", file.name);
      // Implement upload logic here
      alert("File uploaded successfully!");
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <motion.div
      className="upload-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h2
        className="upload-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Upload Your Document
      </motion.h2>

      <motion.label
        className="upload-box"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaCloudUploadAlt size={60} color="#ffcc00" />
        <input type="file" onChange={handleFileChange} hidden />
        <p>{file ? file.name : "Click to select a file"}</p>
      </motion.label>

      <motion.button
        className="upload-button"
        onClick={handleUpload}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Upload
      </motion.button>
    </motion.div>
  );
};

export default IdentificationPage;

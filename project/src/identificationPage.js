import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";
import "./style/identity.css";

const IdentificationPage = () => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const documentOptions = [
    "Passport",
    "Driver's License",
    "Aadhar Card",
    "Ration Card",
    "PAN Card",
    "Voter ID",
    "Other",
  ];
  const fileInputRef = React.createRef();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type === "image/jpeg")
    ) {
      setFile(selectedFile);
    } else {
      alert("Invalid file type. Please upload a .jpg or .pdf document.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type === "application/pdf" ||
        droppedFile.type === "image/jpeg")
    ) {
      setFile(droppedFile);
    } else {
      alert("Invalid file type. Please upload a .jpg or .pdf document.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
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

      {!documentType && (
        <motion.select
          className="document-type-dropdown"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          whileHover={{ scale: 1.05 }}
        >
          <option value="">Select Document Type</option>
          {documentOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </motion.select>
      )}

      {documentType && (
        <>
          <motion.label
            className="upload-box"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FaCloudUploadAlt size={60} color="#ffcc00" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
              accept=".pdf, .jpg"
            />
            <p>
              {file
                ? file.name
                : "Click to select or drag & drop a .jpg or .pdf file"}
            </p>
          </motion.label>

          <motion.button
            className="upload-button"
            onClick={handleUploadClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Upload
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default IdentificationPage;

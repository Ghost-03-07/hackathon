import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";
import "../style/identity.css";

const IdentificationPage = () => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

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
    const validTypes = ["image/jpeg", "image/jpg", "application/pdf"];
    const validExtensions = [".jpeg", ".jpg", ".pdf"];

    const fileExtension = selectedFile?.name.split(".").pop().toLowerCase();

    if (
      selectedFile &&
      (validTypes.includes(selectedFile.type) ||
        validExtensions.includes(`.${fileExtension}`))
    ) {
      setFile(selectedFile);
      setUploadSuccess(false);
    } else {
      alert("Please upload a valid JPG or PDF document");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!file || !documentType) {
      setError("Please select both a document type and a file");
      return;
    }

    setUploading(true);
    setError(null);

    // Initialize FormData here
    const formData = new FormData();
    formData.append("document", file);
    formData.append("type", documentType);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const textResponse = await response.text();
      console.log("Raw response:", textResponse); // Debugging

      try {
        const data = JSON.parse(textResponse); // Try parsing manually
        if (!response.ok) throw new Error(data.error || "Upload failed");
        setUploadSuccess(true);
        console.log("OCR Results:", data);
      } catch (err) {
        console.error("JSON Parsing Error:", err); // More specific error
        setError("Invalid response from server. Check server logs.");
      }

      const data = JSON.parse(textResponse); // Try parsing manually
      if (!response.ok) throw new Error(data.error || "Upload failed");

      setUploadSuccess(true);
      console.log("OCR Results:", data);
    } catch (err) {
      console.error("Upload error:", err); // Log error object properly
      setError(err.message || "Upload failed. Check console for details.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "application/pdf"];

    if (droppedFile && validTypes.includes(droppedFile.type)) {
      setFile(droppedFile);
      setUploadSuccess(false);
    } else {
      alert("Please upload a valid JPG or PDF document");
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
              accept=".pdf,.jpg,.jpeg"
            />
            <p>
              {file
                ? file.name
                : "Click to select or drag & drop a .jpg or .pdf file"}
            </p>
          </motion.label>

          <div className="button-group">
            <motion.button
              className="upload-button"
              onClick={handleUploadClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {file ? "Change File" : "Select File"}
            </motion.button>

            {file && (
              <motion.button
                className="submit-button"
                onClick={handleSubmit}
                disabled={uploading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {uploading ? "Processing..." : "Submit Document"}
              </motion.button>
            )}
          </div>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {uploadSuccess && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Upload successful! Processing your document...
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default IdentificationPage;

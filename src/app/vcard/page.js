"use client"
import React, { useRef, useState } from "react";
import Tesseract from "tesseract.js";

const ClockInDetector = () => {
  const videoRef = useRef(null);
  const [detectedTime, setDetectedTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDetectTime = async () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setLoading(true);

    try {
      const { data: { text } } = await Tesseract.recognize(canvas, "eng");
console.log(text,'text');

      // Find time-like patterns using RegEx (e.g., 09:05 AM)
      const match = text.match(/([0-9]{1,2}:[0-9]{2}\s?[APap][Mm])/);
      
      console.log(match,'match');

      setDetectedTime(match ? match[0] : "No time found");
    } catch (err) {
      console.error("OCR error:", err);
      setDetectedTime("Error detecting time");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Detect Clock In Time from Video</h2>
      <video
        ref={videoRef}
        src="/images/Seclob Connect 2025-06-27 12-39-49.mp4"
        width="500"
        controls
        style={{ marginBottom: "20px" }}
      />
      <br />
      <button onClick={handleDetectTime} disabled={loading}>
        {loading ? "Detecting..." : "Detect Clock In Time"}
      </button>
      <div style={{ marginTop: "20px", fontSize: "1.2rem", fontWeight: "bold" }}>
        {detectedTime && `🕒 Detected: ${detectedTime}`}
      </div>
    </div>
  );
};

export default ClockInDetector;

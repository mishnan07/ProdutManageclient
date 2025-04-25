"use client"

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const DigitalCardQR = ({ cardId }) => {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);
  const imgRef = useRef();

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get(`http://localhost:3010/v1/ecard-no/d-card/qrcode?id=67f3aeb6f55996e6ea196e06`);
        setQrCode(response.data.qrCode);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load QR code:', error);
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [cardId]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = `digital-card-${cardId}.png`;
    a.click();
  };

  if (loading) return <p>Loading QR code...</p>;

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Scan this QR to view the Digital Card</h3>
      <img ref={imgRef} src={qrCode} alt="Digital Card QR Code" style={{ maxWidth: '300px', margin: '20px auto' }} />
      <br />
      <button onClick={handleDownload} style={{ marginTop: '10px', padding: '8px 16px' }}>
        Download QR Code
      </button>
    </div>
  );
};

export default DigitalCardQR;

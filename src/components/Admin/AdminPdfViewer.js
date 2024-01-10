import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PdfViewer = () => {
  const { selectedInvoiceId, timestamp } = useParams();
  const API = process.env.REACT_APP_API;
  const share = `http://localhost:3000/pdf`
  const pdfUrl = `${API}download/${selectedInvoiceId}`;
  const [isUrlValid, setIsUrlValid] = useState(true);
  const WhatsAppAPIshareURL = `${share}/${selectedInvoiceId}/${timestamp}`;

  useEffect(() => {
    const checkUrlValidity = () => {
      const currentTimestamp = Date.now();
      const urlExpirationTime = parseInt(timestamp, 10);

      // Check if the URL is still valid
      if (currentTimestamp > urlExpirationTime) {
        setIsUrlValid(false);
      }
    };

    checkUrlValidity();
  }, [timestamp]);

  if (!isUrlValid) {
    return <div>Sorry, the PDF link has expired or is invalid.</div>;
  }

  const phoneNumber = "+919676657083"; // Replace with the actual phone number from your database

  const openWhatsApp = () => {
    const message = `Check out this document: ${WhatsAppAPIshareURL}`;		// Replace with the actual message from your database
    const shareableUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(shareableUrl, "_blank");
  };

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {isUrlValid && (
          <iframe
            id='pdfViewerIframe'
            title='PDF Viewer'
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(
              pdfUrl
            )}&embedded=true`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        )}
      </div>
      <button onClick={openWhatsApp}>Share via WhatsApp</button>
    </div>
  );
};

export default PdfViewer;

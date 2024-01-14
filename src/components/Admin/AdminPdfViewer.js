import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfViewer = () => {
  const { selectedInvoiceId, timestamp } = useParams();
  const API = process.env.REACT_APP_API;
  const pdfUrl = `${API}download/${selectedInvoiceId}`;
  const [isUrlValid, setIsUrlValid] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(pdfUrl);
        const data = await response.text();
        console.log('PDF Data:', data);

        const currentTimestamp = Date.now();
        const urlExpirationTime = parseInt(timestamp, 10);

        // Check if the URL is still valid
        if (currentTimestamp > urlExpirationTime) {
          setIsUrlValid(false);
        }
      } catch (error) {
        console.error('Error fetching PDF:', error);
        setIsUrlValid(false);
      }
    };

    fetchData();
  }, [pdfUrl, timestamp]);

  if (!isUrlValid) {
    return <div>Sorry, the PDF link has expired or is invalid.</div>;
  }

  const openWhatsApp = () => {
    const WhatsAppAPIshareURL = `http://localhost:3000/pdf/${selectedInvoiceId}/${timestamp}`;
    const phoneNumber = "+919676657083"; // Replace with the actual phone number from your database
    const message = `Check out this document: ${WhatsAppAPIshareURL}`; // Replace with the actual message from your database
    const shareableUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(shareableUrl, "_blank");
  };

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {isUrlValid && (
          <Document file={pdfUrl} options={{ textLayer: false, annotationLayer: false }}>
            <Page pageNumber={1} />
          </Document>
        )}
      </div>
      <button onClick={openWhatsApp}>Share via WhatsApp</button>
    </div>
  );
};

export default PdfViewer;

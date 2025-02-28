import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function PDFDownloadButton() {
  const downloadPDF = () => {
    // Capture the screenshot of the entire body
    html2canvas(document.body, { 
      useCORS: true,  // Make sure external images (like from a URL) are included
      scrollX: 0, 
      scrollY: -window.scrollY,  // Ensure it captures the full page
      windowWidth: document.documentElement.scrollWidth,  // Account for full width
      windowHeight: document.documentElement.scrollHeight, // Account for full height
      scale: 2  // Increase the resolution of the screenshot
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Accident_Report.pdf');
    });
  };

  return (
    <button onClick={downloadPDF}>
      Download PDF
    </button>
  );
}

export default PDFDownloadButton;

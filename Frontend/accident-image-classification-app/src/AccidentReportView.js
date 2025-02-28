import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './AccidentReportView.css';

function AccidentReportView() {
  const location = useLocation();
  const { 
    imagePreview, 
    accidentType, 
    features, 
    lawViolations, 
    selectedViolations = [], 
    selectedSubViolations = {} 
  } = location.state || {}; 

  const filteredViolations = selectedViolations.filter(v => v && v.trim() !== '');
  
  // State to hide the button during PDF generation
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    setIsDownloading(true); // Hide button

    setTimeout(async () => {
      const reportElement = document.getElementById('report-container');

      if (!reportElement) {
        console.error('Error: Report container not found.');
        setIsDownloading(false);
        return;
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      let yOffset = 10; 

      // Capture sections excluding the image preview
      const sections = Array.from(reportElement.children);

      for (let section of sections) {
        if (!section.classList.contains('report-actions')) { // Exclude action buttons
          try {
            const canvas = await html2canvas(section, {
              scale: 2,
              scrollX: 0,
              scrollY: -window.scrollY,
              windowWidth: document.documentElement.scrollWidth,
              windowHeight: document.documentElement.scrollHeight,
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (yOffset + imgHeight > 297) {
              pdf.addPage();
              yOffset = 10;
            }

            pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
            yOffset += imgHeight;
          } catch (error) {
            console.error("Error capturing section:", error);
          }
        }
      }

      pdf.save('Accident_Report.pdf'); // Save PDF
      setIsDownloading(false); // Show button again
    }, 1000); 
  };

  return (
    <div className="report-container" id="report-container">
      <div className="report-header">
        <h2>Accident Analysis Report</h2>
        <p>Detailed analysis of the accident scenario based on user inputs and predictions</p>
      </div>

      {imagePreview && (
        <div className="report-image-preview">
          <h3>Uploaded Image</h3>
          <img src={imagePreview} alt="Uploaded Accident Scene" />
        </div>
      )}

      {accidentType && (
        <div className="report-section">
          <h3>Predicted Accident Type</h3>
          <p>{accidentType}</p>
        </div>
      )}

      {filteredViolations.length > 0 && (
        <div className="report-section">
          <h3>Accident-Specific Violations</h3>
          <ul>
            {filteredViolations.map((violation, index) => (
              <li key={index}>{violation}</li>
            ))}
          </ul>
        </div>
      )}

<div className="report-section">
  <h3>Observational Evidence</h3>
  <table className="report-table">
    <thead>
      <tr>
        <th>Observation</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(features || {}).map((key, index) => (
        <tr key={index}>
          <td>
            {key === "Last Speedometer Value" ? "Last Speedometer Reading in km/h (if available)" : key}
          </td>
          <td>{features[key]}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {lawViolations?.length > 0 && (
        <div className="report-section">
          <h3>Predicted Law Violations</h3>
          <ul>
            {lawViolations.map((violation, index) => (
              selectedSubViolations[violation]?.length > 0 && (
                <li key={index}>
                  <strong>{violation}</strong>
                  <ul>
                    {selectedSubViolations[violation].map((subViolation, subIndex) => (
                      <li key={subIndex}>{subViolation}</li>
                    ))}
                  </ul>
                </li>
              )
            ))}
          </ul>
        </div>
      )}

      <div className="report-actions">
        {!isDownloading && (
          <button className="download-button" onClick={downloadPDF}>
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
}

export default AccidentReportView;

import React from 'react';

function ViewReportButton({ navigate, imagePreview, accidentType, selectedViolations, features, lawViolations, selectedSubViolations }) {
  const viewReport = () => {
    const reportData = {
      imagePreview: imagePreview || '',
      accidentType: accidentType || 'Unknown Accident Type',
      selectedViolations: selectedViolations || [],
      features: features || {},
      lawViolations: lawViolations && lawViolations.length > 0 ? lawViolations : ['No violations predicted'],
      selectedSubViolations: selectedSubViolations || {}, // Now it's correctly passed
    };

    navigate('/view-report', { state: reportData });
  };

  return (
    <button onClick={viewReport} className="view-report-button">
      View Report
    </button>
  );
}

export default ViewReportButton;

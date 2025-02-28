import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FeatureInputForm from './FeatureInputForm';
import PredictionResults from './PredictionResults';
import PDFDownloadButton from './PDFDownloadButton';
import ViewReportButton from './ViewReportButton';
import './ObservationalEvidence.css';

function ObservationalEvidence() {
  const location = useLocation();
  const navigate = useNavigate();
  const { imagePreview, accidentType, selectedViolations } = location.state || {};

  const handleViolationChange = (violation, isChecked) => {
    console.log(`${violation} is ${isChecked ? 'checked' : 'unchecked'}`);
    // Handle state update for main violations
  };

  const [features, setFeatures] = useState({
    "Causing Deaths": '',
    "Causing Severe Injuries": '',
    "Causing Minor Injuries": '',
    "Public Transportation Involved": '',
    "Last Speedometer Value": '',
    "Vehicle Condition": '',
    "Breath Test for Alcohol": '',
    "Driving License Status": '',
    "Vehicle Registration Status": '',
    "Insurance Cover Status": '',
    "Evidence of Mobile Phone Usage": '',
    "Evidence of Proper Signal Usage": '',
    "Evidence of Road Signs Breaches": ''
  });

  const [lawViolations, setLawViolations] = useState([]);
  const [selectedSubViolations, setSelectedSubViolations] = useState({});


  const handleFeatureChange = (event) => {
    const { name, value } = event.target;
    setFeatures((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLawViolationPrediction = async () => {
    try {
      const mappedFeatures = { ...features };
      Object.keys(mappedFeatures).forEach((key) => {
        if (["Yes", "Good", "Valid", "Positive"].includes(mappedFeatures[key])) {
          mappedFeatures[key] = 1;
        } else if (["No", "Bad", "Invalid", "Negative"].includes(mappedFeatures[key])) {
          mappedFeatures[key] = 0;
        } else if (mappedFeatures[key] === "N/A") {
          mappedFeatures[key] = -1;
        }
      });

      const response = await fetch('http://localhost:5000/predict_law_violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappedFeatures),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch predictions. Please check your input and try again.");
      }

      const data = await response.json();
      setLawViolations(data.predictions || []);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSubViolationChange = (violation, subViolation, isChecked) => {
    setSelectedSubViolations((prev) => {
      const updated = { ...prev };
      if (isChecked) {
        if (!updated[violation]) {
          updated[violation] = [];
        }
        if (!updated[violation].includes(subViolation)) {
          updated[violation].push(subViolation);
        }
      } else {
        updated[violation] = updated[violation].filter((v) => v !== subViolation);
      }
      return updated;
    });
  };
  
  return (
    <div className="App">
      <h2>Observational Evidence</h2>
      <FeatureInputForm features={features} onFeatureChange={handleFeatureChange} />
      <button onClick={handleLawViolationPrediction}>Predict Law Violations</button>

      <PredictionResults 
      lawViolations={lawViolations} 
      selectedViolations={selectedViolations} 
      onViolationChange={handleViolationChange}  // Pass the function
      onSubViolationChange={handleSubViolationChange} 
      />

      <div className="button-container">
      <ViewReportButton
        navigate={navigate}
        imagePreview={imagePreview}
        accidentType={accidentType}
        selectedViolations={selectedViolations}
        features={features}
        lawViolations={lawViolations}
        selectedSubViolations={selectedSubViolations} // Pass selectedSubViolations here
      />

        <PDFDownloadButton
          imagePreview={imagePreview}
          accidentType={accidentType}
          selectedViolations={selectedViolations}
          features={features}
          lawViolations={lawViolations}
          selectedSubViolations={selectedSubViolations}
        />
      </div>
    </div>
  );
}

export default ObservationalEvidence;

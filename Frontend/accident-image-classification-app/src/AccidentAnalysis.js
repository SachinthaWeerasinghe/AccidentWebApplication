import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FeatureInputForm from './FeatureInputForm';
import PredictionResults from './PredictionResults';
//import PDFDownloadButton from './PDFDownloadButton';
import ViewReportButton from './ViewReportButton';
import './ObservationalEvidence.css';

function ObservationalEvidence() {
  const location = useLocation();
  const navigate = useNavigate();
  const { imagePreview, accidentType, selectedViolations } = location.state || {};

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

  const handleViolationChange = (violation, isChecked) => {
    console.log(`${violation} is ${isChecked ? 'checked' : 'unchecked'}`);
    // Handle state update for main violations
  };
  
  const handleLawViolationPrediction = () => {
    const mappedFeatures = { ...features };

    Object.keys(mappedFeatures).forEach((key) => {
      if ("Yes Good Valid Positive".includes(mappedFeatures[key])) {
        mappedFeatures[key] = 1;
      } else if ("No Bad Invalid Negative".includes(mappedFeatures[key])) {
        mappedFeatures[key] = 0;
      } else if (mappedFeatures[key] === "N/A") {
        mappedFeatures[key] = -1;
      } else if (!isNaN(Number(mappedFeatures[key]))) {
        mappedFeatures[key] = Number(mappedFeatures[key]);
      }
    });

    // Correcting Insurance Cover Status if Vehicle is Unregistered
    if (mappedFeatures["Vehicle Registration Status"] === 0 && mappedFeatures["Insurance Cover Status"] === 1) {
      mappedFeatures["Insurance Cover Status"] = 0;
    }

    const violations = [];

    // Driving Documentation Compliance Violation
    if (
      mappedFeatures["Driving License Status"] === 0 ||
      mappedFeatures["Vehicle Registration Status"] === 0 ||
      mappedFeatures["Insurance Cover Status"] === 0
    ) {
      violations.push("Driving Documentation Compliance Violation");
    }

    // Public Safety Breaches from Hazardous Driving
    if (
      mappedFeatures["Causing Deaths"] === 1 ||
      mappedFeatures["Causing Severe Injuries"] === 1 ||
      mappedFeatures["Breath Test for Alcohol"] === 1 ||
      (mappedFeatures["Causing Minor Injuries"] === 1 && mappedFeatures["Last Speedometer Value"] > 72) ||
      mappedFeatures["Last Speedometer Value"] > 72
    ) {
      violations.push("Public Safety Breaches from Hazardous Driving");
    }

    // Unsafe Vehicle Condition and Road Safety Negligence
    if (
      mappedFeatures["Evidence of Mobile Phone Usage"] === 1 ||
      mappedFeatures["Evidence of Proper Signal Usage"] === 0 ||
      mappedFeatures["Evidence of Road Signs Breaches"] === 1 ||
      (mappedFeatures["Vehicle Condition"] === 0 && (
        mappedFeatures["Evidence of Mobile Phone Usage"] === 1 ||
        mappedFeatures["Evidence of Proper Signal Usage"] === 0 ||
        mappedFeatures["Evidence of Road Signs Breaches"] === 1
      ))
    ) {
      violations.push("Unsafe Vehicle Condition and Road Safety Negligence");
    }

    // Public Transportation Regulatory Compliance Violation
    if (mappedFeatures["Public Transportation Involved"] === 1) {
      violations.push("Public Transportation Regulatory Compliance Violation");
    }

    setLawViolations(violations);
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

{/*
      <PredictionResults
        lawViolations={lawViolations}
        selectedViolations={selectedViolations}
        onSubViolationChange={handleSubViolationChange}
      />
      */}

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
          selectedSubViolations={selectedSubViolations}
        />
{/* 
        <PDFDownloadButton
          imagePreview={imagePreview}
          accidentType={accidentType}
          selectedViolations={selectedViolations}
          features={features}
          lawViolations={lawViolations}
          selectedSubViolations={selectedSubViolations}
        />
*/}        
      </div>
    </div>
  );
}

export default ObservationalEvidence;

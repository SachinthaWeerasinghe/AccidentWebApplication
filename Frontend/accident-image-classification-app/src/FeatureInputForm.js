import React from 'react';

function FeatureInputForm({ features, onFeatureChange }) {
  const binaryOptions = [{ label: "Yes", value: 1 }, { label: "No", value: 0 }];
  const vehicleConditionOptions = [{ label: "Good", value: 1 }, { label: "Bad", value: 0 }];
  const validityOptions = [{ label: "Valid", value: 1 }, { label: "Invalid", value: 0 }];
  const alcoholTestOptions = [
    { label: "Positive", value: 1 },
    { label: "Negative", value: 0 },
    { label: "N/A", value: -1 },
  ];

  return (
    <>
      {Object.keys(features).map((feature, index) => (
        <div key={index}>
          <label>
            {feature === "Last Speedometer Value"
              ? "Last Speedometer Reading in km/h (if available)"
              : feature === "Vehicle Condition"
              ? "Vehicle Condition (Tyre, Breaks, Air bags etc.)"
              : feature === "Breath Test for Alcohol"
              ? "Breathalyzer Test for Alcohol Consumption Detection"
              : feature === "Public Transportation Involved"
              ? "Public Transportation Involved in the accident"
              : feature === "Evidence of Mobile Phone Usage"
              ? "Evidence of Mobile Phone Usage when accident occurred"
              : feature}
          </label>
          {feature === "Last Speedometer Value" ? (
            <input
              type="number"
              name={feature}
              value={features[feature]}
              onChange={onFeatureChange}
              placeholder={`Enter ${feature}`}
            />
          ) : feature === "Breath Test for Alcohol" ? (
            <select name={feature} value={features[feature]} onChange={onFeatureChange}>
              <option value="">Select...</option>
              {alcoholTestOptions.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : feature === "Vehicle Condition" ? (
            <select name={feature} value={features[feature]} onChange={onFeatureChange}>
              <option value="">Select...</option>
              {vehicleConditionOptions.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : ["Driving License Status", "Vehicle Registration Status", "Insurance Cover Status"].includes(feature) ? (
            <select name={feature} value={features[feature]} onChange={onFeatureChange}>
              <option value="">Select...</option>
              {validityOptions.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <select name={feature} value={features[feature]} onChange={onFeatureChange}>
              <option value="">Select...</option>
              {binaryOptions.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </>
  );
}

export default FeatureInputForm;

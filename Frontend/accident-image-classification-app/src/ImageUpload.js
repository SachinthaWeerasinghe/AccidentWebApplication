import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import './ImageUpload.css';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [accidentType, setAccidentType] = useState('');
  const [violations, setViolations] = useState([]);
  const [selectedViolations, setSelectedViolations] = useState([]);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setUploadStatus('Image selected successfully.');
    } else {
      setUploadStatus('Failed to select an image.');
    }
  };

  const handleAccidentTypePrediction = async () => {
    if (!image) {
      setUploadStatus('Please upload an image first.');
      return;
    }

    setUploadStatus('Uploading and processing image...');
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/predict_accident_type', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setAccidentType(data.prediction);
        setUploadStatus('Image processed successfully!');
        
        // Fetch violations based on prediction
        const violationList = getViolationsByAccidentType(data.prediction);
        setViolations(violationList);
        setSelectedViolations(violationList); // Initialize all violations as selected
      } else {
        setUploadStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  const getViolationsByAccidentType = (type) => {
    switch (type) {
      case "Head On Collision":
        return [
          "148 - (1): Not Keeping to the left or near side of the road.",
          "148 - (3): Overtaking without a clear view of the road ahead.",
          "148 - (5): Overtaking in the way that obstructs traffic in the opposite direction.",
          "148 - (6): Crossing or turning on a highway in a way that obstructs other traffic.",
          "148 - (11): Failing to slow down on narrow roads for safe passage.",
        ];
      case "Rear End Collision":
        return [
          "148 - (2): Failing to allow overtaking traffic to pass.",
          "148 - (5): Driving too close to another vehicle or overtaking unsafely.",
          "148 - (6) Obstructing traffic when crossing or turning.",
          "154 - Reversing a motor vehicle or allowing it to travel backwards on a highway for an excessive distance beyond what is necessary for turning or a reasonable purpose.",
          "166 - Parking or halting a motor vehicle in a prohibited or restricted area as indicated by a notice from the local authority.",
        ];
      case "Single Vehicle Accident":
        return [
           "234: Causing damage to public infrastructure (e.g., highways, bridges, lamp posts, telecommunication posts, railway gates) during an accident.",
           "Penalty for 234: The responsible authority may recover the repair costs of the damaged properties from the vehicle owner.",
           "151(2) - Driving the motor vehicle on a highway recklessly or in a dangerous manner or at a dangerous speed. ",
           "152 - Driving a motor vehicle without full control or an unobstructed view of the highway, allowing a person to obstruct the driver's view or control, or failing to ensure the driver keeps both hands on the steering wheel.",
           "154 - Reversing a motor vehicle or permitting it to travel backwards on a highway for a distance longer than necessary for turning or any other reasonable purpose."
        ];

      case "T Bone Collision":
        return [
          "148 - (7) Entering a highway from another place and obstructing traffic.",
          "148 - (8) Transitioning from one highway to another by obstructing traffic on the receiving highway.",
          "148 - (6) Obstructing traffic when crossing or turning.",
          "148 - (9) Turning into or crossing a main road without yielding to traffic.",
          "148 - (10) Failing to yield at intersections to vehicles approaching from the right.",
          "148 - (13) Improper right turns at intersections, such as not signaling or checking for oncoming traffic.",
        ];

      default:
        return ["No violation."];
    }
  };

  const handleCheckboxChange = (violation) => {
    setSelectedViolations((prevSelected) =>
      prevSelected.includes(violation)
        ? prevSelected.filter((item) => item !== violation)
        : [...prevSelected, violation]
    );
  };

  return (
    <div className="App">
      <h2>Upload Accident Image</h2>
      <label className="image-upload-box">
        <p>Click here or drag and drop an image</p>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      {imagePreview && <img src={imagePreview} alt="Uploaded" className="preview-image" />}
      {uploadStatus && (
        <p
          className={`upload-status ${
            uploadStatus.includes('successfully')
              ? 'success'
              : uploadStatus.includes('Error') || uploadStatus.includes('Failed')
              ? 'error'
              : 'in-progress'
          }`}
        >
          {uploadStatus}
        </p>
      )}
      <button onClick={handleAccidentTypePrediction}>Predict Violations</button>
      {accidentType && (
        <>
          <h3>Predicted Accident Type: {accidentType}</h3>
          <h4>Violated Rules and Associated Penalties:</h4>
          <ul>
            {violations.map((violation, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedViolations.includes(violation)}
                    onChange={() => handleCheckboxChange(violation)}
                  />
                  {violation}
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="bottom-button">
        <Link 
          to="/observational-evidence" 
          state={{ imagePreview, accidentType, selectedViolations }}
        >
          <button>Go to Observational Evidence</button>
        </Link>
      </div>
    </div>
  );
}

export default ImageUpload;

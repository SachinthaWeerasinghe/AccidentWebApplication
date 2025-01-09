import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ObservationalEvidence from './ObservationalEvidence';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUpload />} />
        <Route path="/observational-evidence" element={<ObservationalEvidence />} />
      </Routes>
    </Router>
  );
}

export default App;

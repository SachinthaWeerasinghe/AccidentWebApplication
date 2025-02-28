import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './ImageUpload';
//import ObservationalEvidence from './ObservationalEvidence';
import AccidentReportView from './AccidentReportView';
import Login from "./Login";
import AccidentAnalysis from './AccidentAnalysis';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<ImageUpload />} />*/}
        <Route path="/" element={<Login />} />
        <Route path="/upload" element={<ImageUpload />} />
        {/*<Route path="/observational-evidence" element={<ObservationalEvidence />} /> */}
        <Route path="/view-report" element={<AccidentReportView />} />
        <Route path="/observational-evidence" element={<AccidentAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;
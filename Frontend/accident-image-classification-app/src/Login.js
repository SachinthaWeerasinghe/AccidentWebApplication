import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Optional CSS file for styling

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/upload"); // Redirect to the image upload page after login
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Motor Traffic Accident Legal Strategy Prediction AI Assistant</h1>
        <p>Please Log in to Continue the Legal Analysis</p>
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
      <div className="login-image">
        <img
          src="./image.png" // Replace with your road accident image URL
          alt="Road Accident"
        />
      </div>
    </div>
  );
};

export default Login;

// src/components/LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome to Course Recommendation App</h1>
      <button onClick={() => navigate("/login")} className="get-started-btn">
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;

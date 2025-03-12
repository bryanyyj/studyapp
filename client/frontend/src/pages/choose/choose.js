import React from "react";
import { useNavigate } from "react-router-dom";  
import "./choose.css"; 

const Choose = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="logo">
        <img src="/logo.png" alt="App Logo" />
      </div>

      <div className="container">
        <h1 className="title">
          <span className="highlight">Unlock</span> <span className="highlight">Your</span> <span className="highlight">Potential</span>
        </h1>

        <p className="descriptionOne">
          Manage your time, improve your education, and get responsive feedback.
        </p>
        <p className="descriptionTwo">
          Customize your learning journey today!
        </p>

        <p className="slogan">Deeply Seeking Knowledge, One Step at a Time</p>
      </div>
      
      <div className="button-container">
        <button className="login-button" onClick={() => navigate("/login")} id="login-btn">
          Log in
        </button>
        
        <button className="signup-button" onClick={() => navigate("/register")} id="signup-btn">
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Choose;


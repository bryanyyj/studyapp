import React, { useState, useEffect } from "react";
import "./main.css";
import 'font-awesome/css/font-awesome.min.css';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [studySeconds, setStudySeconds] = useState(0);
  const [breakTime, setBreakTime] = useState(300);
  const [goalTimeSeconds] = useState(3600);
  const [subject] = useState("📘 Study Math");
  const [studyInterval, setStudyInterval] = useState(null);
  const [breakInterval, setBreakInterval] = useState(null);

  useEffect(() => {
    const updateDate = () => {
      const today = new Date();
      const options = { weekday: "short", day: "2-digit", month: "long", year: "numeric" };
      setDate(today.toLocaleDateString("en-GB", options));
    };
    updateDate();
  }, []);

  const startStudyTimer = () => {
    if (!studyInterval) {
      setStudyInterval(setInterval(() => {
        setStudySeconds(prev => prev + 1);
      }, 1000));
    }
  };

  const pauseStudyTimer = () => {
    clearInterval(studyInterval);
    setStudyInterval(null);
  };

  const resetStudyTimer = () => {
    pauseStudyTimer();
    setStudySeconds(0);
    navigate("/review");
  };

  const startBreakTimer = () => {
    if (!breakInterval) {
      setBreakInterval(setInterval(() => {
        setBreakTime(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000));
    }
  };

  const pauseBreakTimer = () => {
    clearInterval(breakInterval);
    setBreakInterval(null);
  };

  const resetBreakTimer = () => {
    pauseBreakTimer();
    setBreakTime(300);
  };

  const startSession = () => {
    pauseBreakTimer();
    startStudyTimer();
  };

  const pauseSession = () => {
    pauseStudyTimer();
    startBreakTimer();
  };

  const resetSession = () => {
    resetStudyTimer();
    resetBreakTimer();
  };

  return (
    <>
      <div className="logo-container">
        <img src="/logo.png" alt="App Logo" />
      </div>
      <div className="timer-section">
        <p className="date">{date}</p>
        <div className="timer-wrapper">
          <div className="timer-display">
            {`${Math.floor(studySeconds / 60)}:${(studySeconds % 60).toString().padStart(2, "0")}`}
          </div>
        </div>
        <div className="break-timer-wrapper">
          <div className="break-timer">
            {`${Math.floor(breakTime / 60)}:${(breakTime % 60).toString().padStart(2, "0")}`}
          </div>
        </div>
        <div className="controls">
          <i className="fa fa-play" onClick={startSession}></i>
          <i className="fa fa-pause" onClick={pauseSession}></i>
          <i className="fa-solid fa-rotate-left" onClick={resetSession}></i>
        </div>
      </div>
      <div className="stats-section">
        <div className="stat-box">
          <p>Goal Time</p>
          <span>{new Date(goalTimeSeconds * 1000).toISOString().substr(11, 8)}</span>
        </div>
        <div className="stat-box">
          <p>Subject Id</p>
          <span className="highlight">{subject}</span>
        </div>
        <div className="stat-box">
          <p>Achievement</p>
          <span>{((studySeconds / goalTimeSeconds) * 100).toFixed(2)}%</span>
        </div>
      </div>
      {/* Navbar at the bottom */}
      <div className="nav-bar">
        <span className="nav-item" onClick={() => navigate("/main")}>🏠 Home</span>
        <span className="nav-item" onClick={() => navigate("/checklist")}>📋 To-Do List</span>
        <span className="nav-item" onClick={() => navigate("/profile")}>📅 Timetable</span>
        <span className="nav-item">⋮ More</span>
      </div>
    </>
  );
};

export default Main;

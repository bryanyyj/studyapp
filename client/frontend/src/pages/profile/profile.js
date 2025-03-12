import React, { useState, useEffect } from "react";
import "./profile.css";

const Profile = () => {
    const [currentMonth, setCurrentMonth] = useState(2); // March
    const [currentYear, setCurrentYear] = useState(2025);
    const [selectedDay, setSelectedDay] = useState(1);
    const [activeView, setActiveView] = useState("day");

    // Store fetched data (e.g., { start_time, end_time, total_time, ... })
    const [sessionData, setSessionData] = useState(null);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const formatDate = (day, month, year) => {
        const date = new Date(year, month, day);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "2-digit"
        });
    };

    const generateCalendar = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    const updateMonth = (increment) => {
        let newMonth = currentMonth + increment;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDay(1); // Reset to first day
    };

    const getHighlightedDays = () => {
        if (activeView === "day") {
            return [selectedDay];
        } else if (activeView === "week") {
            const selectedDate = new Date(currentYear, currentMonth, selectedDay);
            const dayOfWeek = selectedDate.getDay(); // 0=Sun,1=Mon,...
            const startOfWeek = selectedDay - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
            return Array.from({ length: 7 }, (_, i) => startOfWeek + i)
                .filter(day => day > 0 && day <= generateCalendar().length);
        } else if (activeView === "month") {
            return generateCalendar();
        }
        return [];
    };

    // -------------------------------------------------------------
    // useEffect to call GET /study/:session_id (hardcoded session_id=1)
    // -------------------------------------------------------------
    useEffect(() => {
        fetch("http://localhost:5000/api/study/1", { method: "GET" })
          .then(response => {
              if (!response.ok) {
                  throw new Error("Failed to fetch session data");
              }
              return response.json();
          })
          .then(data => {
              console.log("Fetched session data:", data);
              setSessionData(data);
          })
          .catch(error => {
              console.error("Error fetching session:", error);
              setSessionData(null);
          });
    }, [currentMonth, currentYear, selectedDay]);
    // ^ This re-fetches whenever month/year/day changes. Adjust if needed.

    return (
        <div className="profile-container">
            <div className="logo-container">
                <img src="/logo.png" alt="App Logo" />
            </div>

            {/* Calendar Card */}
            <div className="card calendar-card">
                <div className="calendar-section">
                    <div className="month-nav-container">
                        <button className="month-nav left" onClick={() => updateMonth(-1)}>
                            &lt;
                        </button>
                        <span className="month-display">{monthNames[currentMonth]}</span>
                        <button className="month-nav right" onClick={() => updateMonth(1)}>
                            &gt;
                        </button>
                    </div>

                    <div className="calendar">
                        <div className="day-names">
                            <span>Mon</span><span>Tue</span><span>Wed</span>
                            <span>Thu</span><span>Fri</span><span>Sat</span>
                            <span>Sun</span>
                        </div>
                        <div className="days-grid">
                            {generateCalendar().map((day) => (
                                <div
                                    key={day}
                                    className={`day ${
                                        day === selectedDay ? "active" : ""
                                    } ${
                                        getHighlightedDays().includes(day) ? "highlight" : ""
                                    }`}
                                    onClick={() => setSelectedDay(day)}
                                >
                                    <span className="day-number">{day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Card */}
            <div className="card stats-card">
                <div className="stats-section">
                    <div className="tabs">
                        {["day", "week", "month"].map((view) => (
                            <span
                                key={view}
                                className={`tab ${activeView === view ? "active" : ""}`}
                                onClick={() => {
                                    setActiveView(view);
                                    setSelectedDay(1); // optional reset
                                }}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </span>
                        ))}
                    </div>
                    <div className="stats">
                        <h3 className="selected-date">{formatDate(selectedDay, currentMonth, currentYear)}</h3>
                        <div className="stat-box">
                            <span>Total</span>
                            <h2 className="total-time">
                                {sessionData && sessionData.total_time
                                    ? sessionData.total_time
                                    : "00:00:00"}
                            </h2>
                        </div>
                        <div className="stat-box">
                            <span>Max Focus</span>
                            <h2 className="max-focus">00:00:00</h2>
                        </div>
                        <div className="stat-box small">
                            <span>Started</span>
                            <h4 className="start-time">
                                {sessionData && sessionData.start_time
                                    ? sessionData.start_time
                                    : "--:--:--"}
                            </h4>
                        </div>
                        <div className="stat-box small">
                            <span>Finished</span>
                            <h4 className="end-time">
                                {sessionData && sessionData.end_time
                                    ? sessionData.end_time
                                    : "--:--:--"}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

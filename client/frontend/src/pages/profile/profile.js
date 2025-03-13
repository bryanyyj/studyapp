import React, { useState, useEffect } from "react";
import "./profile.css";

const Profile = () => {
    const [currentMonth, setCurrentMonth] = useState(2); // March
    const [currentYear, setCurrentYear] = useState(2025);
    const [selectedDay, setSelectedDay] = useState(1);
    const [activeView, setActiveView] = useState("day");
    const [noteView, setNoteView] = useState("day");

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
        setSelectedDay(1);
    };

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

    return (
        <>
            <div className="logo-container">
                <img src="/logo.png" alt="App Logo" />
            </div>

            <div className="profile-container">
                <div className="card">
                    <div className="calendar-section">
                        <div className="month-nav-container">
                            <button className="month-nav left" onClick={() => updateMonth(-1)}>&lt;</button>
                            <span className="month-display">{monthNames[currentMonth]}</span>
                            <button className="month-nav right" onClick={() => updateMonth(1)}>&gt;</button>
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
                                        className={`day ${day === selectedDay ? "active" : ""}`}
                                        onClick={() => setSelectedDay(day)}
                                    >
                                        <span className="day-number">{day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="card stats-card">
                    <div className="tabs">
                        {["day", "week", "month"].map((view) => (
                            <span
                                key={view}
                                className={`tab ${activeView === view ? "active" : ""}`}
                                onClick={() => setActiveView(view)}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </span>
                        ))}
                    </div>
                    <h3 className="selected-date">{formatDate(selectedDay, currentMonth, currentYear)}</h3>
                    <div className="stat-box"><span>Total</span>
                        <h2 className="total-time">{sessionData?.total_time || "00:00:00"}</h2>
                    </div>
                    <div className="stat-box"><span>Max Focus</span>
                        <h2 className="max-focus">00:00:00</h2>
                    </div>
                    <div className="small-stats-container">
                        <div className="stat-box small"><span>Started</span>
                            <h4 className="start-time">{sessionData?.start_time || "--:--:--"}</h4>
                        </div>
                        <div className="stat-box small"><span>Finished</span>
                            <h4 className="end-time">{sessionData?.end_time || "--:--:--"}</h4>
                        </div>
                    </div>
                </div>
                
                <div className="card note-card">
                    <h3>Study Session Notes</h3>
                    <div className="tabs">
                        {["day", "week", "month"].map((view) => (
                            <span
                                key={view}
                                className={`tab ${noteView === view ? "active" : ""}`}
                                onClick={() => setNoteView(view)}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </span>
                        ))}
                    </div>
                    <p>Notes for {noteView.charAt(0).toUpperCase() + noteView.slice(1)} View</p>
                </div>
            </div>
        </>
    );
};

export default Profile;

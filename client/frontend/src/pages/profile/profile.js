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

    // Function to get the first and last days of the week for a given date
    const getWeekRange = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        // Find Monday (first day of week) - adjusting for JS Date's Sunday=0 system
        const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Convert Sunday from 0 to 7
        const mondayOffset = dayOfWeek - 1;
        
        const mondayDate = new Date(date);
        mondayDate.setDate(date.getDate() - mondayOffset);
        
        const sundayDate = new Date(mondayDate);
        sundayDate.setDate(mondayDate.getDate() + 6);
        
        // Return all days in the week as an array of day numbers
        const weekDays = [];
        const currentDate = new Date(mondayDate);
        while (currentDate <= sundayDate) {
            // Only include days that belong to the current month view
            if (currentDate.getMonth() === currentMonth && 
                currentDate.getFullYear() === currentYear) {
                weekDays.push(currentDate.getDate());
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return weekDays;
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

    // Function to determine if a day should be highlighted
    const shouldHighlightDay = (day) => {
        if (activeView === "day") {
            return day === selectedDay;
        } else if (activeView === "week") {
            return getWeekRange(selectedDay).includes(day);
        } else if (activeView === "month") {
            return true; // Highlight all days in month view
        }
        return false;
    };

    // Format the display date range based on the active view
    const getDisplayDateRange = () => {
        if (activeView === "day") {
            return formatDate(selectedDay, currentMonth, currentYear);
        } else if (activeView === "week") {
            const weekDays = getWeekRange(selectedDay);
            if (weekDays.length > 0) {
                const firstDay = weekDays[0];
                const lastDay = weekDays[weekDays.length - 1];
                return `${formatDate(firstDay, currentMonth, currentYear)} - ${formatDate(lastDay, currentMonth, currentYear)}`;
            }
            return formatDate(selectedDay, currentMonth, currentYear);
        } else if (activeView === "month") {
            return `${monthNames[currentMonth]} ${currentYear}`;
        }
        return formatDate(selectedDay, currentMonth, currentYear);
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
                                        className={`day ${shouldHighlightDay(day) ? "active" : ""}`}
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
                    <h3 className="selected-date">{getDisplayDateRange()}</h3>
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
            </div>
        </>
    );
};

export default Profile;

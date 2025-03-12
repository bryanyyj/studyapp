// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/studyModel");

// ##############################################################
// CONTROLLER FUNCTION TO START A STUDY SESSION
// ##############################################################
module.exports.startStudySession = (req, res, next) => {
    if (!req.body.user_id || !req.body.subject_id) {
        return res.status(400).send("Missing required data.");
    }

    const data = {
        user_id: req.body.user_id,
        subject_id: req.body.subject_id || null
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error startStudySession:", error);
            return res.status(500).json(error);
        }
        // results.insertId is the new session's ID
        res.status(201).json({
            message: "Study session started successfully",
            session_id: results.insertId,
            // Optionally return start_time if you need it
            // start_time: data.start_time
        });
    };

    model.insertStudySession(data, callback);
};

// ##############################################################
// CONTROLLER FUNCTION TO END A STUDY SESSION
// ##############################################################
module.exports.endStudySession = (req, res, next) => {
    if (!req.body.session_id) {
        return res.status(400).send("Missing required data (session_id).");
    }

    const data = {
        session_id: req.body.session_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error endStudySession:", error);
            return res.status(500).json(error);
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Study session not found." });
        }
        console.log("Study session ended successfully");
        next();
    };

    model.updateStudySessionEndTime(data, callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION TO CALCULATE TOTAL STUDY TIME
// ##############################################################
module.exports.calculateTotalStudyTime = (req, res, next) => {
    const data = {
        session_id: req.body.session_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error calculateTotalStudyTime:", error);
            return res.status(500).json(error);
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No study sessions found." });
        }

        const session = results[0];
        if (!session.start_time || !session.end_time) {
            return res.status(400).json({
                message: "Session start_time or end_time is missing."
            });
        }

        // Convert to Date objects
        const startTime = new Date(session.start_time);
        const endTime = new Date(session.end_time);

        // Calculate duration in minutes
        const totalTimeInMinutes = (endTime - startTime) / 60000;

        res.locals.totalTime = totalTimeInMinutes;
        next();
    };

    model.selectStudySessionBySessionId(data, callback);
};

// ##############################################################
// CONTROLLER FUNCTION TO STORE THE END TIME (TOTAL TIME)
// ##############################################################
module.exports.storeEndTIme = (req, res, next) => {
    const data = {
        time: res.locals.totalTime,
        session_id: req.body.session_id
    };

    console.log("Calculated totalTime:", res.locals.totalTime);

    const callback = (error, results) => {
        if (error) {
            console.error("Error storeEndTime:", error);
            return res.status(500).json(error);
        }
        res.status(201).json({
            message: "Study session ended successfully"
        });
    };

    model.insertTotalTime(data, callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION GETTING STUDY SESSION BY SESSION ID
// ##############################################################
module.exports.getSessionById = (req, res, next) => {
    const data = {
        // route param is :id
        id: req.params.id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getSessionById:", error);
            return res.status(500).json(error);
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Session not found." });
        }
        res.status(200).json(results[0]);
    };

    model.selectStudySessionBySessionId(data, callback);
};

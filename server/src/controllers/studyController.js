// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/studyModel");

// ##############################################################
// CONTROLLER FUNCTION TO START A STUDY SESSION
// ##############################################################
module.exports.startStudySession = (req, res, next) => {
    if (!req.body.user_id || !req.body.subject_id) {
        res.status(400).send("Missing required data.");
        return;
    }

    const data = {
        user_id: req.body.user_id,
        subject_id: req.body.subject_id || null
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error startStudySession:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                message: "Study session started successfully",
                session_id: results.insertId,
                start_time: data.start_time
            });
        }
    };

    model.insertStudySession(data, callback);
};

// ##############################################################
// CONTROLLER FUNCTION TO END A STUDY SESSION
// ##############################################################
module.exports.endStudySession = (req, res, next) => {
    if (!req.body.session_id) {
        res.status(400).send("Missing required data.");
        return;
    }

    const data = {
        session_id: req.body.session_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error endStudySession:", error);
            res.status(500).json(error);
            return
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: "Study session not found." });
            return
        } else {
            console.log("Study session ended successfully")
            next()
        }
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
            return res.status(404).json({ message: "No study sessions found" });
        }

        // Extract the first row correctly
        const session = results[0];  // ✅ Fix: Get the first row from results

        if (!session.start_time || !session.end_time) {
            return res.status(400).json({ message: "Session start_time or end_time is missing" });
        }

        // Convert to Date objects
        const startTime = new Date(session.start_time);
        const endTime = new Date(session.end_time);

        // Calculate duration in minutes
        const totalTimeInMinutes = (endTime - startTime) / 60000;  // ✅ Convert ms to minutes

        res.locals.totalTime = totalTimeInMinutes;  // ✅ Store in middleware for next function
        next();
    };

    model.selectStudySessionBySessionId(data, callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION TO DELETE A STUDY SESSION BY ID
// ##############################################################
module.exports.deleteStudySessionById = (req, res, next) => {
    const data = {
        session_id: req.params.session_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteStudySessionById:", error);
            res.status(500).json(error);
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: "Study session not found." });
        } else {
            res.status(200).json({ message: "Study session deleted successfully." });
        }
    };

    model.deleteStudySessionById(data, callback);
};

// ##############################################################
// CONTROLLER FUNCTION TO STORE THE END TIME
// ##############################################################
module.exports.storeEndTIme = (req, res, next) => {
    const data = {
        time: res.locals.totalTime,
        session_id: req.body.session_id
    };
    console.log(res.locals.totalTime)
    const callback = (error, results) => {
        if (error) {
            console.error("Error startStudySession:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                message: "Study session ended successfully"
            });
        }
    };

    model.insertTotalTime(data, callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION GETTING STUDY SESSION BY SESSSION ID
// ##############################################################
module.exports.getSessionById = (req, res, next) =>
    {
        const data = {
        session_id: req.body.session_id
        }
    
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserByUserId:", error);
            res.status(500).json(error);
        } 
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
        else{
            res.status(200).json(results[0])
        }

    }
        model.selectStudySessionBySessionId(data, callback);
    }
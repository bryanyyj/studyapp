// ##############################################################
// REQUIRE MODULES
// ##############################################################
const { pool } = require("../services/db");

// ##############################################################
// MODEL FUNCTION TO INSERT A NEW STUDY SESSION
// ##############################################################
module.exports.insertStudySession = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Study_Sessions (user_id, subject_id, start_time)
        VALUES (?, ?, DATETIME('now', 'localtime'))
    `;
    const VALUES = [data.user_id, data.subject_id];

    pool.query(SQLSTATEMENT, VALUES, function (err, result) {
        if (err) return callback(err, null);
        callback(null, { insertId: result.insertId });
    });
};

// ##############################################################
// MODEL FUNCTION TO UPDATE END TIME OF A STUDY SESSION
// ##############################################################
module.exports.updateStudySessionEndTime = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Study_Sessions
        SET end_time = DATETIME('now', 'localtime')
        WHERE id = ?;
    `;
    const VALUES = [data.session_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// ##############################################################
// DELETE STUDY SESSION BY ID
// ##############################################################
module.exports.deleteStudySessionById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM study_sessions
        WHERE session_id = ?;
    `;
    const VALUES = [data.session_id];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
};
// ##############################################################
// MODEL FUNCTION TO SELECT STUDY SESSIONS WITH START AND END TIME
// ##############################################################
module.exports.selectStudySessionBySessionId = (data, callback) => {
    const query = "SELECT * FROM study_sessions WHERE id = ?";
    pool.query(query, [data.session_id], callback); 
};

// ##############################################################
// MODEL FUNCTION TO INSERT THE TOTAL TIME
// ##############################################################
module.exports.insertTotalTime = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Study_Sessions 
        SET total_time = ?
        WHERE id = ?;
    `;
    const VALUES = [data.time, data.session_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

const { pool } = require("../services/db");

module.exports.insertStudySession = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Study_Sessions (user_id, subject_id, start_time)
        VALUES (?, ?, DATETIME('now', 'localtime'))
    `;
    const VALUES = [data.user_id, data.subject_id];
    pool.query(SQLSTATEMENT, VALUES, function (err, result) {
        if (err) return callback(err, null);
    
        callback(null, { session_id: result.lastID });
    });
};

module.exports.updateStudySessionEndTime = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Study_Sessions
        SET end_time = DATETIME('now', 'localtime')
        WHERE id = ?;
    `;
    pool.query(SQLSTATEMENT, [data.session_id], callback);
};

module.exports.selectStudySessionBySessionId = (data, callback) => {
    const query = "SELECT * FROM Study_Sessions WHERE id = ?";
    pool.query(query, [data.session_id], callback);
};

module.exports.insertTotalTime = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Study_Sessions 
        SET total_time = ?
        WHERE id = ?;
    `;
    const VALUES = [data.time, data.session_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};
<<<<<<< HEAD


// ##############################################################
// MODEL FUNCTION TO SELECT TIME PREDICTION BY REVIEW ID
// ##############################################################
module.exports.selectTimePredictionByReviewId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM time_prediction
        WHERE review_id = ?
    `;
    const VALUES = [data.review_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
=======
module.exports.insertNotes = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Study_Sessions
        SET notes = ?
        WHERE id = ?;
    `;
    const VALUES = [data.notes,data.session_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};
module.exports.insertBreak = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Study_Sessions
        SET break_time = ?
        WHERE id = ?;
    `;
    const VALUES = [data.notes,data.session_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};
module.exports.getSessionByDate = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Study_Sessions 
        WHERE user_id = ? AND DATE(start_time) = ?;
    `;
    const VALUES = [data.user_id, data.sessionDate];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
>>>>>>> c81fce07966a170765852991ed391a8829676e16

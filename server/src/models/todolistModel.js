const { pool } = require('../services/db');

// ##############################################################
// DEFINE MODEL FUNCTION TO GET ALL TASKS
// ##############################################################
module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = "SELECT * FROM Tasks;";
    pool.query(SQLSTATEMENT, [], callback);
};

// ##############################################################
// DEFINE MODEL FUNCTION TO INSERT A NEW TASK
// ##############################################################
module.exports.insertTask = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Tasks (task, deadline)
        VALUES (?, ?)
    `;
    const VALUES = [data.task, data.deadline];

    pool.query(SQLSTATEMENT, VALUES, function(err, result) {
        if (err) return callback(err, null);
        callback(null, { task_id: result.insertId });
    });
};

// ##############################################################
// DEFINE MODEL FUNCTION TO SELECT TASK BY ID
// ##############################################################
module.exports.selectTaskById = (data, callback) => {
    const SQLSTATEMENT = "SELECT * FROM Tasks WHERE task_id = ?;";
    pool.query(SQLSTATEMENT, [data.task_id], callback);
};

// ##############################################################
// DEFINE MODEL FUNCTION TO UPDATE A TASK
// ##############################################################
module.exports.updateTask = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Tasks
        SET task = ?, deadline = ?
        WHERE task_id = ?
    `;
    const VALUES = [data.task, data.deadline, data.task_id];

    pool.query(SQLSTATEMENT, VALUES, function(err, result) {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// ##############################################################
// DEFINE MODEL FUNCTION TO DELETE A TASK
// ##############################################################
module.exports.deleteTask = (data, callback) => {
    const SQLSTATEMENT = "DELETE FROM Tasks WHERE task_id = ?;";
    pool.query(SQLSTATEMENT, [data.task_id], function(err, result) {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

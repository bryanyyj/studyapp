const { pool } = require('../services/db');

module.exports.selectAll = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM Subjects;
        `;
    
    pool.query(SQLSTATMENT, callback);
    }
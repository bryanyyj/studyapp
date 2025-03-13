// reviewsModel.js
const { pool } = require('../services/db');

module.exports.insertReview = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO reviews (sessionDuration, rating, feedback, user_id, scheduleSatisfaction)
        VALUES (?, ?, ?, ?, ?)
    `;
    const VALUES = [
        data.sessionDuration,
        data.rating,
        data.feedback,
        data.user_id,
        data.scheduleSatisfaction
    ];

    pool.query(SQLSTATEMENT, VALUES, function (err, result) {
        if (err) return callback(err, null);
    
        callback(null, { review_id: result.lastID });
    });
};
module.exports.selectAllReviews = (callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Reviews;
    `;
    const VALUES = [];
    pool.query(SQLSTATEMENT,VALUES, callback)
}

module.exports.insertTimePrediction = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO time_prediction (review_id, predicted_class, predicted_duration, probabilities)
        VALUES (?, ?, ?, ?)
    `;
    // We'll store probabilities as a JSON string
    const VALUES = [
        data.review_id,
        data.predicted_class,
        data.predicted_duration,
        data.probabilities
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
module.exports.getReviewById = (data,callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Reviews
        WHERE id = ?
    `;
    const VALUES = [data.review_id];
    pool.query(SQLSTATEMENT,VALUES, callback)
}
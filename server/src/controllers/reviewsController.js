// reviewsController.js
const reviewsModel = require('../models/reviewsModel');
const axios = require('axios');
const { pool } = require("../services/db");

/** 
 * 1) Create Review in DB (no AI call)
 */
module.exports.createReview = (req, res, next) => {
  const data = {
      sessionDuration: req.body.sessionDuration,
      rating: req.body.rating,
      feedback: req.body.feedback || '',
      user_id: req.body.user_id,
      scheduleSatisfaction: req.body.scheduleSatisfaction
  };

  if (
      data.sessionDuration == undefined ||
      data.rating == undefined ||
      data.scheduleSatisfaction == undefined ||
      data.user_id == undefined
  ) {
      res.status(400).send("Missing required data.");
      return;
  }

  const callback = (error, results) => {
      if (error) {
          console.error("Error: createReview", error);
          res.status(500).json(error);
      } else {
          res.status(201).json({
              review_id: results.review_id});
      }
  };

  reviewsModel.insertReview(data, callback);
};


/**
 * 2) Separate Endpoint to Call AI
 * 
 * Expects request body with:
 *  - sessionDuration (number)
 *  - breakTime (number)
 *  - scheduleSatisfaction (number)
 */
module.exports.callAI = (req, res) => {
  const sessionDuration = res.locals.reviews.sessionDuration;
  const scheduleSatisfaction = res.locals.reviews.scheduleSatisfaction;
  const breakTime = res.locals.session.break_time;

  // Validate input
  console.log('Sending to AI:', { sessionDuration, breakTime, scheduleSatisfaction });
  if (sessionDuration == null || breakTime == null || scheduleSatisfaction == null) {
    return res.status(400).json({ error: 'Missing required fields for AI call.' });
  }

  // Call the AI service
  axios.post('http://127.0.0.1:5000/predict', {
    sessionDuration: sessionDuration,  // Updated key
    breakTime: breakTime,              // Updated key
    scheduleSatisfaction: scheduleSatisfaction // Updated key
  })
  .then(flaskResponse => {
    // Log the entire flaskResponse to inspect its structure
    console.log('Full AI Response:', flaskResponse);

    // Make sure flaskResponse has a valid structure
    if (!flaskResponse || !flaskResponse.data) {
      console.error('Invalid AI response:', flaskResponse);
      return res.status(500).json({ error: 'Invalid AI response received.' });
    }

    // Destructure the necessary values from AI data
    const aiData = flaskResponse.data;
    console.log('AI Data:', aiData);

    const { prediction_break, prediction_time, probabilities } = aiData;

    // Define SQL query to insert prediction into DB
    const query = `INSERT INTO time_prediction (review_id, predicted_break, predicted_duration, probabilities) 
                   VALUES (?, ?, ?, ?)`;

    const review_id = res.locals.reviews.review_id; // Get review_id from session or request
    const values = [review_id, prediction_break, prediction_time, JSON.stringify(probabilities)];

    // Execute the query to store data in DB
    pool.query(query, values, (dbError, result) => {
      if (dbError) {
        console.error('Error inserting into DB:', dbError.message);
        return res.status(500).json({
          error: 'Failed to store AI result in DB',
          details: dbError.message
        });
      }

      // Respond with the AI prediction and the inserted row data
      return res.status(200).json({
        message: 'AI prediction successful and data stored in DB',
        aiPrediction: aiData,
        insertedRow: result // Returning the row that was inserted
      });
    });
  })
  .catch(aiError => {
    console.error('Error calling AI:', aiError.message);
    if (aiError.response) {
      console.error('AI response status:', aiError.response.status);
      console.error('AI response data:', aiError.response.data);
    } else {
      console.error('No response received from AI');
    }
    return res.status(500).json({
      error: 'Failed to call AI',
      details: aiError.message
    });
  });
};



module.exports.getAllReviews = (req, res, next) =>{
  const callback = (error, results, fields) => {
      if (error) {
          console.error("Error getAllReviews:", error);
          res.status(500).json(error);
      } 
      else res.status(200).json(results);
  }

  reviewsModel.selectAllReviews(callback);
}

module.exports.getReviewById = (req, res, next) =>{
  const data = {
    review_id: req.body.review_id
  }
  const callback = (error, results, fields) => {
    console.log(results)
      if (error) {
          console.error("Error getAllReviews:", error);
          res.status(500).json(error);
      } 
      else {
        res.locals.reviews = results[0]
      }
      next()
  }

  reviewsModel.getReviewById(data,callback);
}
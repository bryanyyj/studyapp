// reviewsController.js
const reviewsModel = require('../models/reviewsModel');
const axios = require('axios');

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

  // Validate input
  if (sessionDuration == null || breakTime == null || scheduleSatisfaction == null) {
    return res.status(400).json({ error: 'Missing required fields for AI call.' });
  }

  console.log('Sending to AI:', {
    sessionDuration,
    breakTime,
    scheduleSatisfaction
  });

  axios.post('http://127.0.0.1:5000/predict', {
    sessionDuration: sessionDuration,         // Updated key
    breakTime: breakTime,                     // Updated key
    scheduleSatisfaction: scheduleSatisfaction // Updated key
  })
  .then(flaskResponse => {
    const aiData = flaskResponse.data; // e.g. { predicted_class, predicted_duration, probabilities }

    // Now, if you want, you can store this result in the DB...
    // (In this snippet, we just return the result)
    return res.status(200).json({
      message: 'AI prediction successful',
      aiPrediction: aiData
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
        res.locals.sessionDuration = results.sessionDuration
        res.locals.scheduleSatisfaction =  results.scheduleSatisfaction
      }
  }

  reviewsModel.selectAllReviews(callback);
}
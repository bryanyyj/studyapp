// reviewsRoutes.js
const express = require('express');
const router = express.Router();

const reviewsController = require('../controllers/reviewsController');
const studyController = require("../controllers/studyController");
// POST /reviews -> create a new review
router.post('/', studyController.storeNotes, reviewsController.createReview);
router.post('/ai', reviewsController.getReviewById, studyController.getSessionByBodyId,reviewsController.callAI);
router.get("/",reviewsController.getAllReviews)

module.exports = router;

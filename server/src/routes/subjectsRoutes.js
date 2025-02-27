const express = require("express");
const router = express.Router();
const subjectsController = require("../controllers/subjectsController");


router.get('/', subjectsController.getAllSubjects)

module.exports = router;
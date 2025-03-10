const express = require("express");
const router = express.Router();
const subjectsController = require("../controllers/subjectsController");


router.get('/', subjectsController.getAllSubjects)
router.post('/', subjectsController.createNewSubject)
module.exports = router;
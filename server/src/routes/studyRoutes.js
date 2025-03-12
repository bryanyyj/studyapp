const express = require("express");
const router = express.Router();
const studyController = require("../controllers/studyController");

router.post("/start", studyController.startStudySession);
router.put("/end", studyController.endStudySession,studyController.calculateTotalStudyTime,studyController.storeEndTIme);
router.get("/", studyController.getSessionById)
module.exports = router;

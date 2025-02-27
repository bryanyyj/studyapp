const express = require("express");
const router = express.Router();
const subjectsRoutes = require("../routes/subjectsRoutes.js");
const remindersRoutes = require("../routes/remindersRoutes.js");
const usersRoutes = require("../routes/usersRoutes.js");

router.use('/subjects', subjectsRoutes);
router.use('/reminders', remindersRoutes);
router.use('/users', usersRoutes);


module.exports = router;
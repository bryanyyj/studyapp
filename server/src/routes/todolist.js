// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todolistController");

// ##############################################################
// DEFINE ROUTE FOR GET ALL TASKS
// ##############################################################
router.get('/', todoController.getAllTasks);
router.get('/:task_id', todoController.getTaskById);
router.post('/', todoController.createNewTask);
router.put('/:task_id', todoController.updateTaskById);
router.delete('/:task_id', todoController.deleteTaskById);

module.exports = router;

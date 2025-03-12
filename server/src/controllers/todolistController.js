// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/todolistModel");

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR CREATE NEW HOMEWORK TASK
// ##############################################################
module.exports.createNewTask = (req, res, next) => {
    // Validate required data: task and deadline must be provided.
    if (req.body.task === undefined || req.body.deadline === undefined) {
        res.status(400).send("Missing required data.");
        return;
    }
    
    const data = {
        task: req.body.task,
        deadline: req.body.deadline
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewTask:", error);
            return res.status(500).json(error);
        }
        res.status(201).json({
            task_id: results.task_id,
            task: data.task,
            deadline: data.deadline
        });
    };

    model.insertTask(data, callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR GET ALL HOMEWORK TASKS
// ##############################################################
module.exports.getAllTasks = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllTasks:", error);
            return res.status(500).json(error);
        }
        res.status(200).json(results);
    };

    model.selectAll(callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR GET TASK BY ID
// ##############################################################
module.exports.getTaskById = (req, res, next) => {
    const data = {
        task_id: req.params.task_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getTaskById:", error);
            return res.status(500).json(error);
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(results[0]);
    };

    model.selectTaskById(data, callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR UPDATE TASK BY ID
// ##############################################################
module.exports.updateTaskById = (req, res, next) => {
    // Validate required data: both task description and deadline are needed.
    if (req.body.task === undefined || req.body.deadline === undefined) {
        res.status(400).send("Missing required data.");
        return;
    }
    
    const data = {
        task_id: req.params.task_id,
        task: req.body.task,
        deadline: req.body.deadline
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateTaskById:", error);
            return res.status(500).json(error);
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({
            task_id: data.task_id,
            task: data.task,
            deadline: data.deadline
        });
    };

    model.updateTask(data, callback);
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR DELETE TASK BY ID
// ##############################################################
module.exports.deleteTaskById = (req, res, next) => {
    const data = {
        task_id: req.params.task_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteTaskById:", error);
            return res.status(500).json(error);
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(204).send();
    };

    model.deleteTask(data, callback);
};

const model = require("../models/subjectsModel");


module.exports.getAllSubjects = (req, res, next) =>
    {
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error getAllSubjects:", error);
                res.status(500).json(error);
            } 
            else res.status(200).json(results);
        }
    
        model.selectAll(callback);
    }

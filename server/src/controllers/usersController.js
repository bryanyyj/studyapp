    // ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/usersModel");

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR CREATE NEW USER
// ##############################################################

module.exports.createNewUser = (req, res, next) =>{
        const data = {
        username: req.body.username
    }
    if(req.body.username == undefined)
        {
            res.status(400).send("Missing required data.");
            return;
        }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error: createNewUser", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                user_id: results.insertId,  
                username: data.username,   
                skillpoints: 0             
            });
        };
    }

    model.insertUser(data, callback);
}
// ##############################################################
// DEFINE CONTROLLER FUNCTION TO CHECK IF USERNAME EXISTS
// ##############################################################
module.exports.checkUsernameExist = (req, res, next) =>{
    const data = {
        username: req.body.username
    }   
    if(req.body.username == undefined)
    {
        res.status(400).send("Missing required data.");
        return;
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Internal server error.", error);
            res.status(500).json(error);
        } 
        if (results.length > 0) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }
        next()
    } 

    model.selectUserByUsername(data, callback);
}
// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR GET ALL USERS
// ##############################################################
module.exports.getAllUsers = (req, res, next) =>{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllUsers:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAllUsers(callback);
}
// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR UPDATE USER BY ID
// ##############################################################
module.exports.updateUserById = (req, res, next) =>{
    if(req.body.username == undefined||
        req.body.skillpoints == undefined
    )
        {
            res.status(400).send("Missing required data.");
            return;
        }
    const data = {
        user_id: req.params.user_id,
        username: req.body.username,
        skillpoints: req.body.skillpoints
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateUserById:", error);
            res.status(500).json(error);
        }
        if(results.affectedrows == 0){
            console.error("user not found");
            res.status(404).send()
        }
        else{
            res.status(200).json({
                user_id: data.user_id,
                username:data.username,
                skillpoints: data.skillpoints
        })
        }
            next()
    }

    model.updateById(data, callback);
}
// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR CHECK IF USER EXIST
// ##############################################################
module.exports.checkUserExist = (req, res, next) =>
    {
        const data = {
        user_id: req.params.user_id
        }
    
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserExist:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
        }next()
    }
        model.selectUserByUserId(data, callback);
    }
// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR CHECK IF USER EXIST
// ##############################################################
module.exports.getUserByUserId = (req, res, next) =>
    {
        const data = {
        user_id: req.params.user_id
        }
    
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserByUserId:", error);
            res.status(500).json(error);
        } 
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
        else{
            res.status(200).json(results[0])
        }

    }
        model.selectUserByUserId(data, callback);
    }
//////////////////////////////////////////////////////
// CONTROLLER FOR LOGIN
//////////////////////////////////////////////////////
module.exports.login = (req, res, next) =>
    {   
        if(req.body.username == undefined||
            req.body.password == undefined 
        ){
            return res.status(404).json({
                message: "User not found"
            })
            
        }
        const data = {
            username: req.body.username,
            password: req.body.password
        }
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error register:", error);
                res.status(500).json(error);
            } if (results.length == 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            } else{
                res.locals.hash = results[0].password
                res.locals.user_id = results[0].user_id
                next()
            }
        }
    
        model.selectUserByUsername(data,callback);
    }

//////////////////////////////////////////////////////
// CONTROLLER FOR REGISTER
//////////////////////////////////////////////////////
module.exports.register = (req, res, next) =>
    {   if(req.body.username == undefined||
        req.body.email == undefined||
        req.body.password == undefined
    ){
        return res.status(404)
    }
        const data = {
            username: req.body.username,
            email: req.body.email,
            password: res.locals.hash
        }
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error register:", error);
                res.status(500).json(error);
            }
            res.locals.message = `User ${req.body.username} created successfully.`;
            res.locals.user_id = results.user_id
            next()
        }
    
        model.insertUser(data,callback);
    }

//////////////////////////////////////////////////////
// MIDDLEWARE FOR CHECK IF USERNAME OR EMAIL EXISTS
//////////////////////////////////////////////////////
module.exports.checkUsernameOrEmailExist = (req, res, next) =>
    {
        const data = {
            username: req.body.username,
            email: req.body.email
        }
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error checkUsernameOrEmailExist:", error);
                res.status(500).json(error);
            } 
            if(results.length >0){
                return res.status(409).json({
                    message: "Username or email already exists"
                })
            }else{
                next()}
        }
    
        model.selectUserByUsernameOrEmail(data, callback);
    }


//////////////////////////////////////////////////////
// INCLUDES
//////////////////////////////////////////////////////
const app = require('../studyapp/server/src/app');
const express = require("express")

//////////////////////////////////////////////////////
// SETUP ENVIRONMENT
//////////////////////////////////////////////////////
const PORT = 3000;

//////////////////////////////////////////////////////
// START SERVER
//////////////////////////////////////////////////////
// Serve static files from the "public" directory

app.listen(PORT,()=> {
    console.log(`App listening to port ${PORT}`);
});
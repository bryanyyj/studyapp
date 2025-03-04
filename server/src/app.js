//////////////////////////////////////////////////////
// INCLUDES
//////////////////////////////////////////////////////
const express = require('express');
const mainRoutes = require('./routes/mainRoutes')

//////////////////////////////////////////////////////
// CREATE APP
//////////////////////////////////////////////////////
const app = express();
//////////////////////////////////////////////////////
// USES
//////////////////////////////////////////////////////
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//////////////////////////////////////////////////////
// SETUP ROUTES
//////////////////////////////////////////////////////
app.use("/api", mainRoutes);


//////////////////////////////////////////////////////
// EXPORT APP
//////////////////////////////////////////////////////
module.exports = app;
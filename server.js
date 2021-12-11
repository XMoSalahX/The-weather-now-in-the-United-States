// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes

const express = require('express');

// Require body-parser to run server and routes

const bodyParser = require('body-parser');
// Start up an instance of app

const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));


// Setup Server

const port = 8000;
app.listen(port, () => {
    console.log(`running on localhost: ${port}`)
})

// POST route

app.post('/postdata', postData)

function postData(req, res) {
    projectData = {};
    // To set data to projectData Object
    projectData = req.body;
    console.log(projectData)
}



//Get Route
app.get('/all', getData)

function getData(req, res) {
    res.send(projectData)
    projectData = {}
}
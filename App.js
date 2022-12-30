//import modules
const database = require("./database")
const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

//used for indentation in json output
app.set('json spaces', 2)
app.set('view engine', "ejs");

// Add the body parser to the app
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//GETTERS
app.get("/", (req, res) => {
    res.send(
        `
        <a href="http://localhost:${port}/employees">Employees</a>
        <a href="http://localhost:${port}/employees">Departments</a>
        <a href="http://localhost:${port}/employees">Employees(MongoDB)</a>
        `
    )
})

app.get("/employees", (req, res) => {
    database.getEmployees()
    .then((data) => {
        res.render("showEmployees", {"employees": data})

    })
    .catch((error) => {
        console.log("pool error " + error)
    })
})

app.get("/employees/edit/:eid", (req, res) => {
    console.log(req.params.eid)
    database.editEmployee(req.params.eid)
    .then((data) => {
        res.redirect("/")
    })
    .catch((error) => {
        res.send(`<h1>Could not edit employee ${req.params.eid} since there is a foreign key constraint</h1>`)
        console.log(error)
    })
})

app.listen(port, () => console.log(`Visit http://localhost:${port}`))
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
        <a href="http://localhost:${port}/employees">Employees</a><br/>
        <a href="http://localhost:${port}/depts">Departments</a><br/>
        <a href="http://localhost:${port}/employees">Employees(MongoDB)</a>
        `
    )
})

app.get("/employees", (req, res) => {
    database.getEmployees()
    .then((employees) => {
        res.render("showEmployees", {"employees": employees})

    })
    .catch((error) => {
        console.log("pool error " + error)
    })
})

app.get("/employees/edit/:eid", (req, res) => {
    database.getEmployees()
    .then((employees) => {
        employees.forEach(employee => {
            if(req.params.eid == employee.eid){
                res.render("edit", {"employee": employee})
            }
        });

    })
    .catch((error) => {
        console.log("pool error " + error)
    })
})

app.post("/employees/edit/:eid", (req, res) => {
    database.editEmployee(req.params.eid, req.body )
    .then((data) => {
        res.redirect("/employees")
    })
    .catch((error) => {
        res.send(error)
    })
})

app.get("/depts", (req, res) => {
    database.getDepartments()
    .then((departments) => {
        res.render("showDepartments", {"departments": departments})

    })
    .catch((error) => {
        console.log("pool error " + error)
    })
})

app.get("/depts/delete/:did", (req, res) => {
    database.deleteDepartment(req.params.did)
    .then((data) => {
    res.redirect("/depts")
    })
    .catch((error) => {
        console.log(error)
        res.send(`
        <h1>Could not remove department ${req.params.sid} since there is employees assigned to it!</h1>
        <a href="http://localhost:${port}/depts">Back</a>
        `)
    })
})



app.listen(port, () => console.log(`Visit http://localhost:${port}`))
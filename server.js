// Adding the apps dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

// Asynchronous Processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Building out server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Middleware
app.use(express.static("./public"));

// API route GET request
app.get("/api/notes", function(req, res) {
    readFileAsync("./db/db.json","utf8").then(function(data){
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

// API route POST request
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./db/db.json","utf8").then(function(data){
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note);
        return notes
    }).then(function(notes) {
        writeFileAsync("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});

// HTML Routes
app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Listening and port
app.listen(PORT, function(){
    console.log(`App listening at http://localhost:${PORT}`);
})
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const User = require("./models/User");

main()
    .then((result) => {
        console.log("conection successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/linkedin');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/register", (req, res) => {
    res.render("register.ejs");
})

app.listen("8080", (req, res) => {
    console.log("listening to the port 8080")
})
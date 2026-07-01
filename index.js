const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcrypt");
const session = require("express-session");
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
app.use(
    session({
        secret: "mysecretkey",
        resave: false,
        saveUninitialized: false
    })
);

app.use((req, res, next) => {
    res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
    );
    next();
});

app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/register", (req, res) => {
    res.render("register.ejs");
})

app.post("/register", async (req, res) => {
    let userData = req.body.user;

    //checking for duplicate emails
    let existingUser = await User.findOne({
        email: userData.email
    });

    if (existingUser) {
        return res.send("User email exists");
    }

    const hashedPass = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPass;

    let newData = new User(
        userData);
    await newData.save();
    res.redirect("/login");
})

app.get("/login", (req, res) => {
    res.render("login.ejs")
})

app.post("/login", async (req, res) => {
    let loginData = req.body.user;
    let userData = await User.findOne({
        email: loginData.email
    });
    if (!userData) {
        return res.send("user not found");
    }


    let isMatch = await bcrypt.compare(loginData.password, userData.password);

    if (isMatch) {
        req.session.user_id = userData._id;
        return res.redirect("/feed");

    }

    return res.send("Password mismatch");

})

app.get("/profile", isLoggedin, async (req, res) => {
    let userData = await User.findById(req.session.user_id);
    res.render("profile.ejs", {
        userData
    });
})

function isLoggedin(req, res, next) {
    if (!req.session.user_id) {
        return res.redirect("/login");
    }

    next();
}



//create a new post
app.get("/post/new", isLoggedin, (req, res) => {
    res.render("newPost.ejs");
})

app.post("/post", isLoggedin, async (req, res) => {

    const newPost = new Post({
        content: req.body.content,
        author: req.session.user_id
    })

    await newPost.save();
    res.redirect("/feed");
})

//creating feed
app.get("/feed", isLoggedin, async (req, res) => {
    const posts = await Post.find().populate("author").sort({
        createdAt: -1
    });
    res.render("feed.ejs", {
        posts
    });
})

//Logout
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("error in logging out");
        }

        res.redirect("/login");

    })
})
app.listen("8080", (req, res) => {
    console.log("listening to the port 8080")
})
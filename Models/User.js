const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    headLine: String,
    bio: String
});

module.exports = mongoose.model("User", userSchema);
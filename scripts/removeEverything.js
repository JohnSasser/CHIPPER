require("dotenv").config();
let db = require("../models");
let mongoose = require("mongoose");

mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://DBadmin:g0atf4c3@ds017185.mlab.com:17185/heroku_7s6d98z5",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

db.Pets.deleteMany({})
    .then(res => {
        console.log(`Removed all ${res.deletedCount} pets`);
        return db.User.deleteMany({});
    })
    .then(res => {
        console.log(`Removed all ${res.deletedCount} users`);
        return db.Post.deleteMany({})
    })
    .then(res => {
        console.log(`Removed all ${res.deletedCount} posts`);
        process.exit(0);
    })
    .catch(err => {
        if (err) console.log(err);
    });
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const contactContent = "You can mail me at nikhilkvpy2018@gmail.com";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-nikhil2:mongonikhil2@cluster0.vnuzq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

const postsSchema = {
    index: Number,
    title: String,
    body: String
};

const Post = mongoose.model("Post", postsSchema);

app.get("/", function(req, res) {
    res.render("blogs", {});
});

app.get("/confessions", function(req, res) {
    Post.find({}, function(err, foundItems) {
        res.render("confessions", { postItems: foundItems });
    });
});

app.get("/about", function(req, res) {
    res.render("about", {});
});

app.get("/contact", function(req, res) {
    res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

app.get("/games", function(req, res) {
    res.render("games");
});

app.post("/compose", function(req, res) {
    Post.count({}, function(err, postCount) {
        const post = new Post({
            index: postCount + 1,
            title: req.body.postTitle,
            body: req.body.postBody
        });
        post.save();
    });
    res.redirect("/confessions");
});

app.get("/post/:postId", function(req, res) {
    Post.count({}, function(err, postCount) {
        if (req.params.postId > postCount) {
            res.redirect("/");
        } else {
            Post.findOne({ index: req.params.postId }, function(err, foundItems) {
                res.render("post", { postTitle: foundItems.title, postBody: foundItems.body });
            });
        }
    });
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started");
});
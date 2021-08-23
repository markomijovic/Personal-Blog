const express = require("express");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
    "Welcome to Marko's blog. I am a software and mechanical engineer with a side passion for finance/investing. Also a big fan of Man Utd. ";
const softwareContent =
    "I enjoy full stack development (altough I too prefer backend :} ), data science, ML/AI, and software puzzles the most (leetcode etc.). I started coding in middle school and went to few competitions but ultimately did not pursue competitive programming past middle school level. In addition to school, a lot of the skills I have learned are self-taught. I feel that in modern day and age most people with passion can pick up programming outside formal education, albeit it is a more difficult road in terms of math skills, internship opportunities, and networking.";
const mechanicalContent =
    "While I did masters in software engineering, I did my undergrad in mechanical engineering. I always loved programming but as a freshman I wanted to be aerospace engineer so I went down the mechanical engineering route. I was VP of a Schulich UAV, an engineering student club that competed in international events. There I realized I enjoy programming more than aerospace engineering and ended up switching over. A lot of the skills I have gained in mechanical engineering are at their core problem solving skills that I utilize in software engineering as well. In addition, I feel that my mechanical background gives me subject matter knowledge where applicable and makes solving business problems with code easier.";

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
    Post.find({}, (err, foundPosts) => {
        if (!err) {
            res.render("home", {
                startingContent: homeStartingContent,
                postsArr: foundPosts,
            });
        } else {
            console.log("Error: " + err);
        }
    });
});

app.get("/software", (req, res) => {
    res.render("software", { startingContent: softwareContent });
});

app.get("/mechanical", (req, res) => {
    res.render("mechanical", { startingContent: mechanicalContent });
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.get("/posts/:postId", (req, res) => {
    const reqPostId = req.params.postId;
    Post.findOne({ _id: reqPostId }, (err, post) => {
        if (!err) {
            res.render("post", {
                postTitle: post.title,
                postBody: post.content,
            });
        }
    });
});

app.post("/compose", (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody,
    });
    post.save((err) => {
        if (!err) {
            res.redirect("/");
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started.");
});

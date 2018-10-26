const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

router.get("/", (req, res) => {
  Story.find({status: 'public'})
    .populate('user')
    .then((stories) => {
    console.log(stories);
    res.render("stories/index", {stories: stories});
  });
});

router.get("/show/:id", (req, res) => {
  res.render("stories/show");
});


router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

router.post("/", ensureAuthenticated, (req, res) => {
  let allowComments;
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }
  
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user._id
  };
  new Story(newStory).save().then(story => {
    res.redirect(`/stories/show/${story._id}`);
  });
});


router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  res.render("stories/edit");
});

module.exports = router;

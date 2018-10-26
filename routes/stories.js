const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

// get all public stories
router.get("/", (req, res) => {
  Story.find({status: 'public'})
    .populate('user')
    .then((stories) => {
    res.render("stories/index", {stories: stories});
  });
});

// get single story
router.get("/show/:id", (req, res) => {
  Story.findOne({_id: req.params.id}).populate('user').then((story) => {
    if(story) {
      res.render('stories/show', {story: story});
    // } else {
    //   res.render('stories/show', {story: story});
    }
  });
});

// load add new story form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

// save new story
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

// load edit story form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  res.render("stories/edit");
});

module.exports = router;

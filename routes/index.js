const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const {ensureAuthenticated, ensureGuest} = require("../helpers/auth");

router.get("/", ensureGuest, (req, res) => {
  res.render("index/welcome");
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  if(req.user) {
    Story.find({user: req.user._id})
      .populate('user')
      .then((stories) => {
        res.render("index/dashboard", {stories: stories});
    });
  }
});

module.exports = router;
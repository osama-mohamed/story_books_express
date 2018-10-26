const express = require("express");
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require("../helpers/auth");


router.get("/", (req, res) => {
  res.render("stories/index");
});

router.get("/show/:id", (req, res) => {
  res.render("stories/show");
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  res.render("stories/edit");
});


module.exports = router;
const express = require("express");
const router = express.Router();
const passport = require("passport");


router.get('/google', passport.authenticate('google', {
  // ask user to accept share profile info and email
  scope: ['profile', 'email']
})
);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});



module.exports = router;
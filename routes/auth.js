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


router.get('/verify', (req, res) => {
  if(req.user) {
    res.json(req.user);
  } else {
    res.json('not auth');
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});



module.exports = router;
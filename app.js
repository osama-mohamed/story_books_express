const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require("passport");

const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
require('./config/database');
require('./config/passport')(passport);



app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cookieParser());
app.use(session({
  secret: 'topSecretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


const AuthRoutes = require('./routes/auth');
app.use('/auth', AuthRoutes);




app.get("/", (req, res) => {
  res.send("it works!");
});



app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
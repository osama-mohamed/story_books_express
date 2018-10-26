const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
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
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
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


app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});





const AuthRoutes = require('./routes/auth');
const IndexRoutes = require('./routes/index');
app.use('/auth', AuthRoutes);
app.use('/', IndexRoutes);




app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
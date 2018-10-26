const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require("passport");

const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
require('./config/database');
require('./config/passport')(passport);
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');



app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      select: select,
      editIcon: editIcon
    },
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));


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
const StoriesRoutes = require('./routes/stories');
app.use('/auth', AuthRoutes);
app.use('/', IndexRoutes);
app.use('/stories', StoriesRoutes);




app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
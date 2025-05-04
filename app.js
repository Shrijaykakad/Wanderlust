const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listingRoutes = require("./routes/listings.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js")
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user.js');


let sessionOptions = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
main().catch(err => console.log(err));

async function main() { 
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsmate);

app.use((req, res, next) => {
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
next();
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get(/(.*)/, (req, res, next) =>{
  next(new ExpressError(500, "Page not found"));
});

app.use((err, req, res, next) => {
let { status = 500, message="Unknown Error Found" } = err;
res.render("error.ejs", {err});
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
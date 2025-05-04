const express = require("express");
const router = express.Router({mergeParams:true});
const User = require('../Models/user.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", async(req, res) => {
  let{username, email, password} = req.body;
  try{
    const newUser = new User({username, email});
    let registeredUser = await User.register(newUser, password);
    req.flash("success", "Welcome to Wonderlust");
    res.redirect("/listings");
  }catch(er){
    req.flash("error", er.message);
    res.redirect("/signup")
  }
})

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

router.post("/login",
  passport.authenticate("local", { failureRedirect: '/login', failureFlash:true }), 
  (req, res) => {
  req.flash("success", "Welcome Back To Wonderlust");
  res.redirect("/listings");
})

module.exports = router;
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const Listing = require("./Models/listing.js");
const listData = require("./init/data.js");
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./Models/review.js");

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

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if(error){
    return next(new ExpressError(400, error.details[0].message));
  }else{
    next();
  }
}

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if(error){
    return next(new ExpressError(400, error.details[0].message));
  }else{
    next();
  }
}

// Index Route
app.get(
  "/listings",
  wrapAsync(
  async(req, res) => {
  let allListing = await Listing.find({})
  res.render("listings/index.ejs", { allListing });
}));

//New Route
app.get(
  "/listings/new",
  // wrapAsync(
  (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(
  async(req, res, next) => {
  let newListing = await new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//update Route
app.get(
  "/listings/:id/edit",
  wrapAsync(
  async(req, res) => {
  let { id } = req.params;
  let editListing = await Listing.findById(id);
  res.render("listings/edit.ejs", {editListing});
}));

app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(
  async(req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(
  async(req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect(`/listings`);
}));

//Show Route
app.get(
  "/listings/:id",
  wrapAsync(
  async(req, res) => {
  let{ id } = req.params;
  let listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", {listing});
}));

//Reviews Add
app.post("/listings/:id/reviews",validateReview, async(req, res) => {
  let{ id } = req.params;
  let listing = await Listing.findById(id);
  let review = new Review(req.body.review);
  
  listing.reviews.push(review);
  
  await review.save();
  await listing.save();
  
  res.redirect(`/listings/${id}`);
});

app.get(/(.*)/, (req, res, next) =>{
  next(new ExpressError(500, "Page not found"));
})

app.use((err, req, res, next) => {
let { status = 500, message="Unknown Error Found" } = err;
res.render("error.ejs", {err});
})

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
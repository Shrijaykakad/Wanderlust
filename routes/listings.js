const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../Models/listing.js");
const { listingSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if(error){
    next(new ExpressError(400, error.details[0].message));
  }else{
    next();
  }
}

// Index Route
router.get(
  "/",
  wrapAsync(
  async(req, res) => {
  let allListing = await Listing.find({})
  res.render("listings/index.ejs", { allListing });
}));

//New Route
router.get(
  "/new",
  // wrapAsync(
  (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(
  async(req, res, next) => {
  let newListing = await new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//update Route
router.get(
  "/:id/edit",
  wrapAsync(
  async(req, res) => {
  let { id } = req.params;
  let editListing = await Listing.findById(id);
  res.render("listings/edit.ejs", {editListing});
}));

router.put(
  "/:id",
  validateListing,
  wrapAsync(
  async(req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete(
  "/:id",
  wrapAsync(
  async(req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect(`/listings`);
}));

//Show Route
router.get(
  "/:id",
  wrapAsync(
  async(req, res) => {
  let{ id } = req.params;
  let listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", {listing});
}));

module.exports = router;
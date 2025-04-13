const express = require("express");
const router = express.Router({ mergeParams:true });
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");
const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if(error){
    return next(new ExpressError(400, error.details[0].message));
  }else{
    next();
  }
}

// Reviews
// Reviews Add
router.post("/",validateReview, wrapAsync(async(req, res) => {
  let listing = await Listing.findById(id);
  let review = new Review(req.body.review);
  
  listing.reviews.push(review);
  
  await review.save();
  await listing.save();
  
  res.redirect(`/listings/${id}`);
}));

//Review Delete
router.delete("/:reviewId",wrapAsync(async(req, res) => {
  let{id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
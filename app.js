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
const warpAsync = require("./utils/wrapAsync.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")

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


//Index Route
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
  wrapAsync(
  (req, res) => {
  res.render("listings/new.ejs");
}));

//Create Route
app.post(
  "/listings",
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
  wrapAsync(
  async(req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete(
  "/listings/:id/delete",
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
  let listing = await Listing.findById(id)
  res.render("listings/show.ejs", {listing});
}));

app.get(/(.*)/, (req, res, next) =>{
  next(new ExpressError(500, "Page not found"));
})

app.use((err, req, res, next) => {
let { status, message } = err;
res.render("error.ejs", {err});
})

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
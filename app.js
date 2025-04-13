const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const Listing = require("./Models/listing.js");

const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const listingRoutes = require("./routes/listings.js");
const reviewRoute = require("./routes/reviews.js");

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

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", listingRoutes);



app.get(/(.*)/, (req, res, next) =>{
  next(new ExpressError(500, "Page not found"));
})

// app.use((err, req, res, next) => {
// let { status = 500, message="Unknown Error Found" } = err;
// res.render("error.ejs", {err});
// })

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");
const { Schema } = mongoose;

const listingSchema = new schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  }, 
  image: {
    filename:{
      type: String
    },
    url:{
      type: String,
    default: "https://media.istockphoto.com/id/2181855711/photo/mumbai-gateway-to-india.jpg?s=2048x2048&w=is&k=20&c=OANaOqa-fVDp0nBpRCaEb1wrNX_enUcEA5oAfnq7GqA=",
    set: (v) => v === "" ? "https://media.istockphoto.com/id/2181855711/photo/mumbai-gateway-to-india.jpg?s=2048x2048&w=is&k=20&c=OANaOqa-fVDp0nBpRCaEb1wrNX_enUcEA5oAfnq7GqA=" : v
    }
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews:[
    { type: Schema.Types.ObjectId, ref: "Review"}
  ]
})

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
const mongoose = require("mongoose");
const schema = mongoose.Schema;

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
  }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
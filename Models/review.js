const mongoose = require("mongoose");
const { type } = require("../schema");
const schema = mongoose.Schema;

const reviewSchema = new schema({
  comment:{
    type: String
  },
  rating:{
    type: Number,
    min: 1,
    max: 5
  },
  date:{
    type:Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Review", reviewSchema);
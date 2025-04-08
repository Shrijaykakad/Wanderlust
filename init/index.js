const mongoose = require("mongoose");
const Listing = require("../Models/listing.js");
const listData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
  await Listing.deleteMany({});
  await Listing.insertMany(listData.data);
}

initDB();
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for The collection!"],
    },
    aboutCollection: {
      type: String,
    },
    collectionPhoto: {
      type: String,
      required: [true, "Upload a pic that explains the collection!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

nftSchema.virtual("nfts", {
  ref: "Nft",
  foreignField: "collection",
  localField: "_id",
});

const collection = new mongoose.model("Collection", collectionSchema);
module.exports = collection;

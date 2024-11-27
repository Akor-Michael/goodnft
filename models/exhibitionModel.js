const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const exhibitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for your Exhibition!"],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    salesBonus: {
      type: Number,
      default: 10,
    },
    totalNft: {
      type: Number,
      default: 0,
    },
    exhibitionNft: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Nft",
      },
    ],
    joinFee: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    photo: {
      type: String,
      required: [true, "Upload exhibition pics!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// exhibitionSchema.virtual("totalNft").get(function (ele) {
//   if (this.exhibitionNft) return this.exhibitionNft.length;
//   return 0;
// });

// nftSchema.pre(/^findOne/, function (next) {
//   this.populate({
//     path: "exhibitionNft",
//     select: "photo name priceInEtherium photo nftOwner",
//   });
//   next();
// });

/////////////////////////////////////
// exhibitionSchema.post(/^find/, function (doc) {
//   console.log("this", doc, typeof doc, doc.length);
//   if (!doc.length) {
//     doc.totalNft = doc.exhibitionNft ? doc.exhibitionNft.length : 0;
//   } else {
//     doc = doc.map((ele) => {
//       console.log(ele);
//       ele.totalNft = ele.exhibitionNft ? ele.exhibitionNft.length : 0;
//       console.log("after", ele);
//       return ele;
//     });
//   }
//   console.log("doc", doc);
//   // return doc;
// });

exhibitionSchema.post(/^find/, function (doc, next) {
  if (!Array.isArray(doc)) {
    // Single document
    doc.totalNft = doc.exhibitionNft ? doc.exhibitionNft.length : 0;
    doc.owner = {
      username: doc.owner.username,
      userVerified: doc.owner.userVerified,
      photo: doc.owner.photo,
    };
    // crossOriginResourcePolicy.log(doc.owner);
  } else {
    // Array of documents
    doc = doc.map((ele) => {
      ele.totalNft = ele.exhibitionNft ? ele.exhibitionNft.length : 0;
      ele.exhibitionNft = undefined;
      return ele;
    });
  }
  next();
});

// exhibitionSchema.post(/^find/, function (docs, next) {
//   // Handle array of documents
//   let newDocs;
//   if (Array.isArray(docs)) {
//     newDocs = [...docs];
//     newDocs = newDocs.map((doc) => {
//       doc.totalNft = doc.exhibitionNft ? doc.exhibitionNft.length : 0;
//       console.log(newDocs, newDocs.totalNft);
//     });
//     console.log(docs);
//   } else {
//     // Handle single document
//     newDocs = docs;
//     newDocs.totalNft = newDocs.exhibitionNft ? newDocs.exhibitionNft.length : 0;
//   }
//   return newDocs;
//   next();
// });

////////////////////
// name
// priceInEtherium
// photo
// exhibitionSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "nftOwner",
//     select: "username userVerified photo",
//   });
//   next();
// });

/////////////////////////////////////////////////////////////////
// exhibitionSchema.pre(/^findOne/, function (next) {
//   this.populate({
//     path: "nftOwner",
//     select: "username userVerified photo",
//   });
//   next();
// });

/////////////////////////////////////////////////////////////////
const Exhibition = new mongoose.model("Exhibition", exhibitionSchema);
module.exports = Exhibition;
// const User = new mongoose.model("User", userSchema);
// module.exports = User;

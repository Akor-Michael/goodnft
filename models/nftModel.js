const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for your NFT!"],
    },
    category: {
      type: String,
      enum: ["gaming", "arts", "membership", "photography", "pfps", "others"],
      default: "arts",
    },
    nftOwner: {
      // will be automatically generated
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    priceInEtherium: {
      type: Number,
      required: [true, "provide price of NFT in Etherium"],
    },
    description: {
      type: String,
    },
    photo: {
      type: String,
      required: [true, "Upload the NFT!"],
    },
    nftInMarket: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

nftSchema.pre(/^find/, function (next) {
  this.populate({
    path: "nftOwner",
    select:
      "-wallet -emailVerified -gottenWallet -photo -myNftTransaction -emailVerificationExpires -emailVerificationToken -__v -email",
  });
  next();
});

// username userVerified

// nftSchema.post(/^find/, function (doc, next) {
//   if (Array.isArray(doc)) {
//     doc = doc.map((ele) => {
//       if (ele.user.wallet) ele.user.wallet = undefined;
//       return ele;
//     });
//   }
//   next();
// });

const nft = new mongoose.model("Nft", nftSchema);
module.exports = nft;
// const User = new mongoose.model("User", userSchema);
// module.exports = User;

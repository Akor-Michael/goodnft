const mongoose = require("mongoose");
const Wallet = require("./walletModel");
const AppError = require("../utils/appError");
const Nft = require("./nftModel");

const soldNftSchema = new mongoose.Schema(
  {
    nft: {
      type: mongoose.Schema.ObjectId,
      ref: "Nft",
      required: [true, "provide Nft sold."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "provide the user involved."],
    },
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "provide the buyer involved."],
    },
    amount: {
      type: Number,
      required: [true, "provide the amount of etherium"],
    },
    salesCommision: {
      type: String,
      enum: ["paid", "notPaid"],
      default: "notPaid",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ratingSchema.pre("save", function (next) {
//   (this.createdAt = Date.now), next();
// });

// ratingSchema.statics.calcAverageRatings = async function (lodgeId) {
//   const stats = await this.aggregate([
//     {
//       $match: { lodge: lodgeId },
//     },
//     {
//       $group: {
//         _id: "$lodge",
//         nRating: { $sum: 1 },
//         avgLightRating: { $avg: "$light" },
//         avgWaterRating: { $avg: "$water" },
//         avgMaintenanceRating: { $avg: "$maintenance" },
//       },
//     },
//   ]);

//   if (stats.length > 0) {
//     await Lodge.findByIdAndUpdate(lodgeId, {
//       ratingsQuantity: stats[0].nRating,
//       averageLightRatings: stats[0].avgLightRating,
//       averageWaterRatings: stats[0].avgWaterRating,
//       averageMaintenanceRatings: stats[0].avgMaintenanceRating,
//     });
//   } else {
//     await Tour.findByIdAndUpdate(tourId, {
//       ratingsQuantity: 0,
//       averageLightRatings: 2.5,
//       averageWaterRatings: 3.5,
//       averageMaintenenceRatings: 3,
//     });
//   }
// };

// transactionSchema.post("save", function () {
//   // this points to current review
//   this.constructor.calcAverageRatings(this.lodge);
// });
// nftTransactionSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "from",
//     select:
//   });
//   next();
// });

soldNftSchema.pre(/^find/, function (next) {
  this.populate({
    path: "buyer",
    select:
      "-wallet -emailVerified -gottenWallet -photo -myNftTransaction -emailVerificationExpires -emailVerificationToken -__v -email -userVerified",
  }).populate({
    path: "nft",
    select:
      "-category -nftOwner -priceInEtherium -description -photo -nftInMarket -__v",
  });
  next();
});
// category;
// nftOwner;
// priceInEtherium;
// description;
// photo;
// nftInMarket;

const SoldNft = mongoose.model("SoldNft", soldNftSchema);
module.exports = SoldNft;

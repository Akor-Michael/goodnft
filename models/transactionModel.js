const mongoose = require("mongoose");
const Wallet = require("./walletModel");
const AppError = require("../utils/appError");

const transactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.ObjectId,
      ref: "Wallet",
      required: [true, "provide wallet involved."],
    },
    transaction: {
      type: String,
      enum: ["deposite", "withdraw", "mint", "sales-bonus", "exhibition"],
      required: [true, "transaction type is reqired"],
    },
    amount: {
      type: Number,
      required: [true, "provide the amount of etherium"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      required: [true, "status is required"],
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

const transaction = mongoose.model("Transaction", transactionSchema);
module.exports = transaction;

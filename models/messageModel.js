const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("./userModel");

const messageSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please provide the users id !"],
    },
    message: {
      type: String,
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// nftSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "nftOwner",
//     select: "username",
//   });
//   next();
// });
messageSchema.statics.updateChatNotification = async function (message) {
  const user = await User.findById(message.messageId);
  const chatNotification = message.role === "user" ? +user.pendingChart + 1 : 0;
  const chatNotification1 =
    message.role === "admin" ? +user.myPendingChart + 1 : 0;

  const newUser = await User.findByIdAndUpdate(message.messageId, {
    pendingChart: chatNotification,
    myPendingChart: chatNotification1,
  });
};

messageSchema.post("save", function () {
  this.constructor.updateChatNotification(this);
});

const message = new mongoose.model("Message", messageSchema);
module.exports = message;
// const User = new mongoose.model("User", userSchema);
// module.exports = User;

const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please provide a username!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    wallet: {
      type: mongoose.Schema.ObjectId,
      ref: "Wallet",
    },
    gottenWallet: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    userVerified: {
      type: Boolean,
      default: false,
    },
    profileVisible: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
      select: false,
    },
    bio: {
      type: String,
    },
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    photo: {
      type: String,
      default: "/img/users/defaultUserPhoto.png",
    },
    myNftTransaction: [],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("myNft", {
  ref: "Nft",
  foreignField: "nftOwner",
  localField: "_id",
});
userSchema.virtual("soldNft", {
  ref: "SoldNft",
  foreignField: "user",
  localField: "_id",
});
userSchema.virtual("boughtNft", {
  ref: "BoughtNft",
  foreignField: "user",
  localField: "_id",
});
userSchema.virtual("myExhibition", {
  ref: "Exhibition",
  foreignField: "owner",
  localField: "_id",
});

// userSchema.virtual("chat", {
//   ref: "Message",
//   foreignField: "messageId",
//   localField: "_id",
// });
// userSchema.virtual("wallet", {
//   ref: "Wallet",
//   foreignField: "user",
//   localField: "_id",
// });
// chart: {
//   type: mongoose.Schema.ObjectId,
// },
// userSchema.virtual("nftTransaction").get(function () {
//   const myNftTransaction= await users.find({
//       $or: [
//         { city: "New York" },
//         { age: { $gt: 30 } }
//       ]
//     })
//   return this.eth + this.weth;
// });
// db.users.find({
//   $or: [
//     { city: "New York" },
//     { age: { $gt: 30 } }
//   ]
// })

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  // update the last time the password was chainged
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // console.log(this);
  this.find({ active: { $ne: false } });
  // console.log(this);
  next();
});

// userSchema.pre(/^find/, function(next) {
//   // this points to the current query
//   this.find({ active: { $ne: false } });
//   next();
// });

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "wallet",
    select: "useBot eth weth realBalance",
  });
  next();
});

userSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: "wallet",
  });
  next();
});
// myNftTransaction;
// bio
userSchema.methods.checkPassword = async function (
  logInPassword,
  userPassword
) {
  return await bcrypt.compare(logInPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (tokenIssuedDate) {
  // returns true or false if password was chainged after this token was issued
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return tokenIssuedDate < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.emailVerificationToken);
  this.emailVerificationExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

userSchema.methods.updateNftTansaction = async function (id) {
  this.myNftTransaction.apend(id);
  return this;
};

const User = new mongoose.model("User", userSchema);
module.exports = User;

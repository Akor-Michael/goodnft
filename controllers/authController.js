const dotenv = require("dotenv");
const path = require("path");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const Email = require("./../utils/email");
const Nft = require("./../models/nftModel");
const walletController = require("./walletController");
const userController = require("./userController");
const Wallet = require("./../models/walletModel");
const sendEmail = require("./../utils/email");
// const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const sgMail = require("@sendgrid/mail");
// const sgMail = require('@sendgrid/mail');
const nodemailer = require("nodemailer");
const pug = require("pug");
// const htmlToText = require("html-to-text");
const { findOne, findOneAndUpdate } = require("../models/transactionModel");

sgMail.setApiKey(
  process.env.SENDGRID_API_KEY
);

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       ai_kpey: process.env.SENDGRID_API_KEY
//     },
//   })
// );

// const domainName = "194.113.64.212:3000";
const domainName = "artcity.site";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_DURATION,
  });
};

// (user, statusCode, req, res)
const createAndSendTokenForLogin = async (user, statusCode, req, res) => {
  const token = createToken(user.id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.NODE_ENV === "production" ? true : false,
  });
  // req.secure || req.headers['x-forwarded-proto'] === 'https'

  // Remove hashed password from output
  user.password = undefined;
  req.user = user;
  if (req.user.emailVerified === false) {
    return res.status(200).json({
      status: "success",
      message: "email is not verified",
      token,
    });
  }
  let userDetails;
  try {
    userDetails = await userController.getMyDetailsLogin(req);
  } catch {}

  return res.status(statusCode).json({
    status: "success",
    message: "email is verified",
    token,
    data: {
      // user: user,
      userDetails,
      role: user.role,
    },
  });
};

// exports.createEmailTokenSingup = async (user) => {
//   // const user = user;
//   // ////////////////////////////////////////////////////////////////////////
//   const resetToken = user.createEmailVerificationToken();
//   await user.save({ validateBeforeSave: false });

//   // 3) Send token to user's email
//   try {
//     const resetURL = `https://${domainName}/api/v1/users/verifyEmailToken/${resetToken}`;
//     const logoUrl = `${req.protocol}://${req.get("host")}/img/artmintLogo.png`;

//     // send email to user
//     await new Email(user, resetURL, logoUrl).verifyEmail();
//   } catch (err) {
//     user.emailVerificationToken = undefined;
//     user.emailVerificationTokenExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     // console.log(err);
//   }
//   console.log("email has been sent");
//   return "email has been sent";
// };

const createAndSendToken = async (user, statusCode, req, res) => {
  const token = createToken(user.id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.NODE_ENV === "production" ? true : false,
  });
  // req.secure || req.headers['x-forwarded-proto'] === 'https'

  // Remove hashed password from output
  user.password = undefined;

  // const email = await createEmailTokenSingup(user);
  // createEmailTokenSingup
  return res.status(statusCode).json({
    status: "success",
    message: "user has successfully sign up",
    token,
    // data: {
    //   user: user,
    // },
  });
};

exports.verifiedPasswordToken = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(200).render("expiredPasswordToken");
    // return next(new AppError("Token is invalid or has expired", 400));
  }
  // await walletController.checkAndCreateWallet();
  // 2) If token has not expired, and there is user, tell the user that the token is validate.
  const cspValue = "script-src 'self' http://194.113.64.212:5000";
  res.setHeader("Content-Security-Policy", cspValue);
  // const url = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword`;
  const url = `https://artcity.site/api/v1/users/resetPassword`;
  return res.status(200).render("createNewPassword", {
    url: url,
    token: req.params.token,
  });
});

// exports.resetPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on the token
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   }).select("+password");

//   // 2) If token has not expired, and there is user, set the new password
//   ////////////////
//   console.log("new user", user, !user);
//   if (user) {
//     await User.findByIdAndUpdate(user.id, {
//       password: req.body.password,
//       passwordResetToken: undefined,
//       passwordResetExpires: undefined,
//     });
//     ///////////////
//     return res.status(200).json({
//       ststus: "success",
//       message: "your password have successfully been reset",
//     });
//   } else {
//     return next(new AppError("Token is invalid or has expired", 400));
//   }
//   // if (!user) {
//   //   console.log("no user");
//   // }
//   // 3) Update changedPasswordAt property for the user
//   // 4) Log the user in, send JWT
//   // createAndSendToken(user, 200, req, res);
//   // or just send a sucessfully chailge password message
// });
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  // createSendToken(user, 200, req, res);
  res.status(200).json({
    ststus: "success",
    message: "your password have successfully been reset",
  });
});

exports.verifyEmailToken = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(200).render("invalidEmailLink");
  }

  // 2) If token has not expired, and there is user,verify the users email and also create wallet for the user
  const ans = await walletController.checkAndCreateWallet(user);
  // console.log("wallet stage passed", user, !user);

  user.emailVerified = true;
  await user.save({ validateBeforeSave: false });
  return res.status(200).render("emailVerified");
});

exports.adminVerifyUserEmail = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  // const hashedToken = crypto
  //   .createHash("sha256")
  //   .update(req.params.token)
  //   .digest("hex");

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(200).render("user not found");
  }
  ////////////////////
  if (user.emailVerified) {
    return res.status(200).render("user email is already verified");
  }
  ///////////////////////
  // 2) If token has not expired, and there is user,verify the users email and also create wallet for the user
  const ans = await walletController.checkAndCreateWallet(user);
  // console.log("wallet stage passed", user, !user);

  user.emailVerified = true;
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json({ status: "success", message: "user email has been verified" });
});

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const resetToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send token to user's email
  try {
    const resetURL = `https://${domainName}/api/v1/users/verifyEmailToken/${resetToken}`;
    const logoUrl = `${req.protocol}://${req.get("host")}/img/artmintLogo.png`;

    // send email to user
    await new Email(user, resetURL, logoUrl).verifyEmail();
  } catch (err) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // console.log(err);
  }
  ///////////////////////////////////////////////////////////
  // const url = `${req.protocol}://${req.get("host")}/me`;

  // const resetToken = user.createEmailVerificationToken();
  // // console.log("token", resetToken);
  // await user.save({ validateBeforeSave: false });
  ////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////
  // 3) Send token to user's email
  // try {
  //   const resetURL = `https://${domainName}/api/v1/users/verifyEmailToken/${resetToken}`;
  //   const logoUrl = `/img/artmintLogo.png`;
  //   // console.log("email about to be sent");
  //   ///////////////////////////
  //   const newUser = {
  //     email: user.email,
  //     username: user.username,
  //   };
  // } catch (err) {
  //   user.emailVerificationToken = undefined;
  //   user.emailVerificationTokenExpires = undefined;
  //   await user.save({ validateBeforeSave: false });
  //   // console.log(err);
  // }/////////////////////////////////////////////////////////////////////////////////////
  //////////////
  createAndSendToken(user, 201, req, res); //////////////
});

exports.login = catchAsync(async (req, res, next) => {
  // select password and email from the body destructuring
  const { password, email } = req.body;

  // send an error message if any both (password and email) are not available
  if (!password || !email) {
    return next(new AppError("please provide your email and password"));
  }

  const gottenUser = await User.findOne({ email }).select("+password +role");

  if (
    !gottenUser ||
    !(await gottenUser.checkPassword(password, gottenUser.password))
  ) {
    return next(new AppError("invalid email or password ", 400));
  }
  // createAndSendToken(gottenUser, 201, req, res);
  createAndSendTokenForLogin(gottenUser, 201, req, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // check if the token was sent.
  // console.log("your headers", req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // decode or verify the token.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id).select("+role +password");
  if (!currentUser) {
    return next(new AppError("This user no longer exist.", 401));
  }
  // console.log("protect middleware:", currentUser, decoded.iat);
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  // console.log("yes protect", req.user);
  next();
});

exports.verifiedEmailAcc = catchAsync(async (req, res, next) => {
  if (req.user.emailVerified === false) {
    return next(new AppError("your email address has not been verified.", 401));
  }
  // await walletController.checkAndCreateWallet(req);
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  if (!req.body.email)
    return next(new AppError("Please enter your Email address.", 401));
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 401));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send token to user's email
  try {
    // const resetURL = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/users/verifiedPasswordToken/${resetToken}`;
    const resetURL = `https://artcity.site/api/v1/users/verifiedPasswordToken/${resetToken}`;
    const logoUrl = `${req.protocol}://${req.get("host")}/img/artmintLogo.png`;

    await new Email(user, resetURL, logoUrl).resetPassword();

    res.status(200).json({
      status: "success",
      message: "password reset Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again!"),
      500
    );
  }
});

///////////////////////////////////////////
// exports.createEmailTokenSingup = async (user) => {
//   const user = user;
//   // ////////////////////////////////////////////////////////////////////////
//   const resetToken = user.createEmailVerificationToken();
//   await user.save({ validateBeforeSave: false });

//   // 3) Send token to user's email
//   try {
//     const resetURL = `https://${domainName}/api/v1/users/verifyEmailToken/${resetToken}`;
//     const logoUrl = `${req.protocol}://${req.get("host")}/img/artmintLogo.png`;

//     // send email to user
//     await new Email(user, resetURL, logoUrl).verifyEmail();
//   } catch (err) {
//     user.emailVerificationToken = undefined;
//     user.emailVerificationTokenExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     // console.log(err);
//   }
//   return "email has been sent";
// };
///////////////////////////////////////////////////////////////////////
exports.createEmailToken = catchAsync(async (req, res, next) => {
  const user = req.user;
  // ////////////////////////////////////////////////////////////////////////
  const resetToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send token to user's email
  try {
    console.log("sending mail", resetToken);
    const resetURL = `https://${domainName}/api/v1/users/verifyEmailToken/${resetToken}`;
    const logoUrl = `${req.protocol}://${req.get("host")}/img/artmintLogo.png`;
    console.log("whais the issue", resetURL);
    // send email to user
    await new Email(user, resetURL, logoUrl).verifyEmail();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // console.log(err);

    return next(
      new AppError("There was an error sending the email. Try again!"),
      500
    );
  }
});

exports.updateUserPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;

  if (!currentPassword || !password || !passwordConfirm) {
    return next(
      new AppError(
        "currentPassword, password and passwordConfirm are required"
      ),
      400
    );
  }
  const user = await User.findById(req.user._id).select("+password");
  // console.log(user.password);
  if (!(await user.checkPassword(currentPassword, user.password))) {
    return next(new AppError("your current password is wrong"));
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  const updatedUser = await user.save();
  createAndSendToken(updatedUser, 200, req, res);
});

exports.restrictTo = (...userTypes) => {
  // console.log(...userTypes);

  return (req, res, next) => {
    if (!req.user || !userTypes.includes(`${req.user.role}`)) {
      return next(
        new AppError("you don't have permision to perform this task", 401)
      );
    }
    console.log(...userTypes);
    next();
  };
};

//GIVE ACCESS TO ONLY PERMITED USERS : ([lodge-controllers, lodge-owners], either or both of them ).
// exports.restrictToLodge = (...userTypes) => {
//   return catchAsync(async (req, res, next) => {
//     // VERIFY IF THE LODGE ID IS CORRECT
//     const lodge = await Lodge.findById(req.params.id);
//     if (!lodge) {
//       return next(new AppError(`no lodge with the id ${req.params.id}`, 404));
//     }

//     // GET THE ID OF ALL USERTYPES ALLOWED TO PERFORM TASK
//     let allowedId = [];
//     userTypes.slice().forEach((element) => {
//       if (lodge[`${element}`] && lodge[`${element}`].length >= 1) {
//         const lodgeId = lodge[`${element}`].slice().map((ele) => ele.id);
//         allowedId = [...allowedId, ...lodgeId];
//       }
//     });

//     // verify if user is allowed to perform the task (ifuser id is among the list of allowed id)
//     if (!allowedId.includes(`${req.user._id}`.split('"')[0])) {
//       return next(
//         new AppError("you don't have permision to perform this task", 403)
//       );
//     }

//     // specify the role of the user on the request (req.role).
//     const userIsTheOwner = lodge.owners
//       .slice()
//       .map((ele) => ele.id)
//       .includes(`${req.user._id}`.split('"')[0]);
//     req.role = userIsTheOwner ? "owners" : "controllers";

//     // GRANT ACCESS TO PERFORM THE TASK
//     next();
//   });
// };

// exports.restrictControllersPower = catchAsync(async (req, res, next) => {
//   if (req.body.owners) {
//     return next(
//       new AppError("you don't have permision to make this changes! ", 403)
//     );
//   }
//   if (req.body && req.body.controllers) {
//     if (req.role !== "owners") {
//       return next(
//         new AppError("you don't have permision to make this changes!", 403)
//       );
//     }
//   }
//   next();
// });

// converts all the emails to their various ids in req.controller
// exports.convertEmailsToId = catchAsync(async (req, res, next) => {
//   if (req.body && req.body.controllers) {
//     controllersPromise = req.body.controllers.map(
//       async (email) => await User.findOne({ email })
//     );
//     fullControllers = await Promise.all(controllersPromise);
//     req.body.controllers = fullControllers.map((ele) => ele._id);
//   }
//   next();
// });

// specify the detailes to be opdated by the owners or the controllers
// exports.returnDetailsToUpdate = catchAsync(async (req, res, next) => {
//   if (req.role === "owners") {
//     return res.status(200).json({
//       status: "success",
//       data: ["price", "controllers", "freeRooms"],
//     });
//   } else if (req.role === "controllers") {
//     return res.status(200).json({
//       status: "success",
//       data: ["freeRooms"],
//     });
//   } else {
//     return res.status(400).json({
//       status: "failed",
//       data: "you are not allowed to perform this task",
//     });
//   }
// });

// exports.selectDetailsToUpdate = catchAsync(async (req, res, next) => {
//   // select the required details to be updated from the body
//   let { price, controllers, freeRooms } = req.body;
//   let newBody = {};
//   if (freeRooms) newBody = { ...newBody, freeRooms };
//   if (req.role === "owners") {
//     if (price) newBody = { ...newBody, price };
//     if (controllers) newBody = { ...newBody, controllers };
//   }
//   req.body = newBody;
//   next();
// });

exports.adduserIdToParams = (req, res, next) => {
  req.params.id = `${req.user._id}`.split('"')[0];
  next();
};

exports.addUserIdToBody = (req, res, next) => {
  if (req.body) req.body.user = `${req.user._id}`.split('"')[0];
  next();
};

// exports.addUsersLodgeIdToBody = (req, res, next) => {
//   if (req.body && req.user.lodge)
//     req.body.lodge = `${req.user.lodge._id}`.split('"')[0];
//   next();
// };

// exports.updateUserRatings = async (req, res, next) => {
//   const user = await User.findById(`${req.user._id}`.split('"')[0]);
//   if (user.givenRatings)
//     return next(
//       new AppError(
//         "your rating has already been submitted, check back latter",
//         403
//       )
//     );

//   const updatedDoc = await User.findByIdAndUpdate(
//     `${req.user._id}`.split('"')[0],
//     { givenRatings: true },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   next();
// };

// exports.enforceRatings = (req, res, next) => {
//   if (!req.user.lodge) {
//     return next(new AppError("update your current lodge at your profile", 403));
//   }
//   if (!req.user.givenRatings) {
//     return next(new AppError("update your current lodge ratings", 403));
//   }
//   next();
// };

// exports.gettUserId=(req,res,next)=>{
//   req.params.id=`${req.user._id}`.split('"')[0];
//   next();
// }

exports.confirmPatentOfNft = catchAsync(async () => {
  // get the nft
  const nft = await Nft.findById(req.params.id);
  if (!nft) {
    return next(new AppError(`no nft with the id ${req.params.id}`, 401));
  }
  if (!nft.user === req.user.id) {
    return next(new AppError("you are not allowed to perform this task", 400));
  }
  next();
});

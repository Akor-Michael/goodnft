const { json } = require("express");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");
const handlerFactory = require("./handlerFactory");
const nftTransaction = require("../models/soldNftModel");
const transaction = require("../models/transactionModel");
const Wallet = require("../models/walletModel");
const walletController = require("./walletController");
const Email = require("./../utils/email");

const {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
  getOrCreateAssociatedTokenAccount,
} = require("@solana/spl-token");
const {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} = require("@solana/web3.js");
const base58 = require("bs58");

const getOneWallet = async (id) => {
  let query = Wallet.findById(id);
  query = query.populate("transactions");
  const data = await query;
  return data;
};
exports.getUserNftProfile = catchAsync(async (req, res, next) => {
  const userNftProfile = await User.findById(req.params.id)
    .select("username email photo bio facebook twitter instagram")
    .populate("myNft")
    .populate("myExhibition");
  if (!userNftProfile) {
    return next(new AppError(`there is no user with this id ${req.params.id}`));
  }
  res.status(200).json({
    status: "success",
    data: userNftProfile,
  });
});
// nftTransaction;
///////////////////////////// //////////////////////
// exports.getMyDetails = catchAsync(async (req, res, next) => {
//   const me = await User.findById(req.user.id)
//     .populate("myNft")
//     .populate("chat");
//   // $or: [{ to: req.user.id }, { From: req.user.id }],
//   // console.log("me", me);
//   const myNftTransaction = await nftTransaction.find({});
//   // const myNftTransaction = await nftTransaction.find({});
//   // console.log("myNftTransaction", myNftTransaction);
//   const filtered = myNftTransaction.slice().map((ele) => {
//     if (ele.nft && ele.nft.owner) ele.nft.owner = null;
//     if (ele.to && ele.to.wallet) ele.to.wallet = null;
//     if (ele.From && ele.From.wallet) ele.From.wallet = null;

//     // if (ele.From && ele.From.wallet) ele.nft.owner = null;

//     // ele?.nft?.nftOwner = null;
//     // ele?.to?.wallet = null;
//     // ele?.From?.wallet = null;

//     if (ele.to && ele.to.id == req.user.id) return ele;
//     if (ele.From && ele.From.id == req.user.id) return ele;
//     // ele.nft.nftOwner = null;
//     // ele.to.wallet = null;
//     // ele.From.wallet = null;
//     // // return ele;
//     // if (ele.to.id == req.user.id) return ele;
//     // if (ele.From.id == req.user.id) return ele;
//   });
//   me.myNftTransaction = filtered;
//   if (me.wallet) {
//     // console.log("walletId", me.wallet.id);
//     const myWallet = await getOneWallet(me.wallet.id);
//     me.wallet = myWallet;
//     // console.log("myWallet", myWallet);
//     // console.log("me wallet", me.wallet);
//   }
//   return res.status(200).json({
//     status: "success",
//     data: me,
//   });
// });

// exports.getUserDetails = catchAsync(async (req, res, next) => {
//   const me = await User.findById(req.params.id)
//     .populate("myNft")
//     .populate("chat");
//   if (!me) {
//     return next(new AppError(`there is no user with this id ${req.params.id}`));
//   }
//   const myNftTransaction = await nftTransaction.find({});
//   const filtered = myNftTransaction.slice().map((ele) => {
//     if (ele.nft && ele.nft.owner) ele.nft.owner = null;
//     if (ele.to && ele.to.wallet) ele.to.wallet = null;
//     if (ele.From && ele.From.wallet) ele.From.wallet = null;

//     // ele?.nft?.nftOwner = null;
//     // ele?.to?.wallet = null;
//     // ele?.From?.wallet = null;

//     if (ele.to && ele.to.id == me.id) return ele;
//     if (ele.From && ele.From.id == me.id) return ele;
//     // ele.nft.nftOwner = null;
//     // ele.to.wallet = null;
//     // ele.From.wallet = null;
//     // if (ele.to.id == req.params.id) return ele;
//     // if (ele.From.id == req.params.id) return ele;
//   });
//   // console.log("myNftTransaction after map", myNftTransaction);
//   me.myNftTransaction = filtered.slice();
//   if (me.wallet) {
//     // console.log("walletId", me.wallet.id);
//     const myWallet = await getOneWallet(me.wallet.id);
//     me.wallet = myWallet;
//     // console.log("myWallet", myWallet);
//   }
//   return res.status(200).json({
//     status: "success",
//     data: me,
//   });
// });
////////////////////////////
// getMyDetailsLogin
exports.getMyDetailsLogin = async (req) => {
  const me = await User.findById(req.user.id)
    .populate("myNft")
    .populate("soldNft")
    .populate("boughtNft")
    .populate("myExhibition");
  let myWallet = "";
  if (me.wallet) {
    myWallet = await getOneWallet(me.wallet.id);
    me.wallet = myWallet;
  }
  // console.log("wallet", myWallet);
  //////////////update wallet monitoring feature//////////////
  const currentDate = Date.now();
  const expires = currentDate + 86400000;
  const timeStampOfWallet = new Date(myWallet.walletIsMonotored).getTime();
  if (myWallet !== "" && timeStampOfWallet <= currentDate) {
    await Wallet.findByIdAndUpdate(me.wallet.id, {
      walletIsMonotored: expires,
    });
  }
  return me;
};

/////////////////////////////////////////////////////
exports.getMyDetails = catchAsync(async (req, res, next) => {
  const me = await User.findById(req.user.id)
    .populate("myNft")
    .populate("soldNft")
    .populate("boughtNft")
    .populate("myExhibition");
  let myWallet = "";
  if (me.wallet) {
    myWallet = await getOneWallet(me.wallet.id);
    me.wallet = myWallet;
  }
  // console.log("wallet", myWallet);
  //////////////update wallet monitoring feature//////////////
  const currentDate = Date.now();
  const expires = currentDate + 86400000;
  const timeStampOfWallet = new Date(myWallet.walletIsMonotored).getTime();
  if (myWallet !== "" && timeStampOfWallet <= currentDate) {
    await Wallet.findByIdAndUpdate(me.wallet.id, {
      walletIsMonotored: expires,
    });
  }

  return res.status(200).json({
    status: "success",
    data: me,
  });
});

exports.getUserDetails = catchAsync(async (req, res, next) => {
  const me = await User.findById(req.params.id)
    .populate("myNft")
    .populate("soldNft")
    .populate("boughtNft")
    .populate("myExhibition");
  if (!me) {
    return next(new AppError(`there is no user with this id ${req.params.id}`));
  }
  const myNftTransaction = await nftTransaction.find({});
  const filtered = [];
  if (myNftTransaction.length >= 1) {
    myNftTransaction.slice().map((ele) => {
      if (ele.nft && ele.nft.owner) ele.nft.owner = null;
      if (ele.to && ele.to.wallet) ele.to.wallet = null;
      if (ele.From && ele.From.wallet) ele.From.wallet = null;

      // ele?.nft?.nftOwner = null;
      // ele?.to?.wallet = null;
      // ele?.From?.wallet = null;

      if (ele.to && ele.to.id == me.id) {
        filtered.push(ele);
        return;
      }
      if (ele.From && ele.From.id == me.id) {
        filtered.push(ele);
        return;
      }
      // ele.nft.nftOwner = null;
      // ele.to.wallet = null;
      // ele.From.wallet = null;
      // if (ele.to.id == req.params.id) return ele;
      // if (ele.From.id == req.params.id) return ele;
    });
  }
  // console.log("myNftTransaction after map", myNftTransaction);
  me.myNftTransaction = filtered.slice();
  if (me.wallet) {
    // console.log("walletId", me.wallet.id);
    const myWallet = await getOneWallet(me.wallet.id);
    me.wallet = myWallet;
    // console.log("myWallet", myWallet);
  }
  return res.status(200).json({
    status: "success",
    data: me,
  });
});
////////////////////////////////////////////////////////
exports.updateMyDetails = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError(
        "please use the update password route to update password!",
        404
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filterBody = handlerFactory.selectDataFromObjBody(
    req.body,
    "profileVisible,bio,facebook,photo,instagram,twitter"
  );
  if (req.file) filterBody.photo = `/img/users/${req.file.filename}`;

  const updatedDoc = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    status: "success",
    data: updatedDoc,
  });
});

exports.addPhotoName = (req, res, next) => {
  if (req.file) req.body.photo = `/img/users/${req.file.filename}`;
  next();
};

exports.getStaffId = catchAsync(async (req, res, next) => {
  if (!req.body.support) return next();
  const staff = await User.findOne({
    username: req.body.support,
  });
  if (!staff)
    return next(
      new AppError(`no user with the username ${req.body.support}`, 401)
    );
  req.body.support = staff.id;
  next();
});

exports.sendValidationEmail = catchAsync(async (req, res) => {
  const users = await User.findById(req.params.id);
  const user = {
    email: users.email,
    username: users.username,
    validationFee: req.body.validationFee,
  };
  // console.log(user, users);
  const resetURL = "hdfghjfghjkjhgvcfvb";
  const logoUrl = "hgfdsdfghjklkjhgfdfgh";
  await new Email(user, resetURL, logoUrl).validationEmail();
  // console.log("sent mail");
  const newUser = await User.findByIdAndUpdate(req.params.id, {
    validationFee: req.body.validationFee,
  });
  res.status(204).json({
    status: "success",
    data: newUser.validationFee,
  });
});

exports.deleteMyAccount = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// const myRole = catchAsync(async (req, res) => {
//   return req.user.id;
// });
exports.duplicateFields = handlerFactory.getAll(User, {
  fields:
    "-emailVerified,-emailVerificationToken,-emailVerificationExpires,-password,-passwordConfirm,-wallet,-gottenWallet,-passwordChangedAt,-passwordResetToken,-passwordResetExpires,-active,-userVerified,-role,-bio,-facebook,-twitter,-instagram,-photo,-myNftTransaction,-__v",
});
exports.getAllUsers = handlerFactory.getAll(User);

exports.getAllStaffUsers = catchAsync(async (req, res) => {
  const myUsers = await User.find({
    support: req.user.id,
  });
  res.status(200).json({
    status: "success",
    result: myUsers.length,
    data: myUsers,
  });
});
// exports.getOneUser = handlerFactory.getOne(User, "user");
exports.deleteUser = handlerFactory.deleteOne(User, "user");
// exports.createUser = handlerFactory.createOne(User);
exports.updateUser = handlerFactory.updateOne(User, "user");

exports.payandSendToken = catchAsync(async (req, res, next) => {
  // console.log("function is running now", req.body);
  if (!req.body.address) {
    return next(new AppError(`wallet address is needed`, 401));
  }
  const TOKENRECIEVER = req.body.address;
  // console.log("userwllet Address in body", TOKENRECIEVER);
  const recipientPrivateKey =
    "225W1yJJKpV5vQGnY1fcDSog2iaaT4mK4APXa1Pqhtjqmf8cRbqTJtP5omaUHyPgHLYhQFEFm4GjmSVzV9YRpVES";
  const TOKENSENDER = Keypair.fromSecretKey(base58.decode(recipientPrivateKey));
  const mainnetRpcUrl =
    "https://mainnet.helius-rpc.com/?api-key=363af8ef-2072-4ba8-8e5c-b976f21a6381";
  const connection = new Connection(mainnetRpcUrl, "confirmed");
  //   const connection = new Connection(clusterApiUrl("mainnet"), "confirmed");
  //   const connection = new Connection(clusterApiUrl("mainnet"), "confirmed");

  const tokenReciever = new PublicKey(TOKENRECIEVER);
  const tokenSender = TOKENSENDER;

  const tokenAddress = new PublicKey(
    "Fg1q5u5eCPcy1ps6PfDP9AKvYNgUKH3uJXUDMDgkzfp4"
  );
  const bobTokenAddress = await getAssociatedTokenAddress(
    tokenAddress,
    tokenSender.publicKey
  );

  // Alice may not have a token account, so Bob creates one if not
  const aliceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    tokenSender, // Bob pays the fee to create it
    tokenAddress, // which token the account is for
    tokenReciever // who the token account is for
  );

  // Get the details about the token mint
  const tokenMint = await getMint(connection, tokenAddress);

  const { blockhash } = await connection.getLatestBlockhash("finalized");

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: tokenReciever,
  });

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: tokenReciever,
      toPubkey: tokenSender.publicKey,
      lamports: 0.01 * LAMPORTS_PER_SOL,
    })
  );

  transaction.add(
    createTransferCheckedInstruction(
      bobTokenAddress,
      tokenAddress,
      aliceTokenAccount.address,
      tokenSender.publicKey,
      50 * Math.pow(10, tokenMint.decimals),
      tokenMint.decimals
    )
  );

  transaction.partialSign(tokenSender);

  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });
  const transactionBase64 = Buffer.from(serializedTransaction).toString(
    "base64"
  );
  console.log(transactionBase64);

  res.status(200).json({ transaction: transactionBase64 });
});

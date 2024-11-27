const Nft = require("./../models/nftModel");
const handlerFactory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const AppError = require("../utils/appError");
const Wallet = require("./../models/walletModel");
const Transaction = require("./../models/transactionModel");
const SoldNft = require("./../models/soldNftModel");
const BoughtNft = require("./../models/boughtNftModel");
// const NftTransaction = require("../models/soldNftModel");
const walletController = require("./walletController");
const Email = require("./../utils/email");
const Exhibition = require("../models/exhibitionModel");

// exports.addImageNameToBody =(req,res,next)=> {
//   if (req.file) req.body.lodgeImage = req.file.filename;
//   next();
// }
exports.checkGassFee = catchAsync(async (req, res, next) => {
  if (!req.user.gottenWallet) {
    return next(new AppError("you don't have a wallet yet", 400));
  }
  const wallet = await Wallet.findById(req.user.wallet.id);

  const mintFee = +wallet.mintFee;
  // console.log(req.user.wallet.eth, mintFee, req.body);
  if (req.user.wallet.eth < mintFee) {
    return next(
      new AppError(`You need ${mintFee} ETH gas-fee to create an nft`, 400)
    );
  }
  // //////////////////////////////////
  // create a document for gass fee ,reduce the main and eth ballance /////////////////////////
  const myNewEthBal = req.user.wallet.eth - mintFee;
  // console.log("bal", myNewEthBal);
  req.params.newEth = myNewEthBal;
  req.params.mintFee = mintFee;
  next();
});

exports.selectUpdatableDataFromBody = catchAsync(async (req, res, next) => {
  const newObj = {};
  allowedFields = ["priceInEtherium", "nftInMarket", "category", "description"];
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = req.body[el];
  });
  req.body = newObj;
  next();
});

// "_id": "64569397a0657e3a5c88e0e4",
// "name": "niga",
// "nftId": "1124",
// "catigory": "game",
// "nftOwner": "6456173185f0239e43432a86",
// "priceInEtherium": 0.002,
// "description": " one of the best nft in the world",
// "photo": "/img/nft/Nft-6456173185f0239e43432a86-1683395478993.png",
// "nftInMarket": true,
// "__v": 0,
// "id": "64569397a0657e3a5c88e0e4"
// , {
//   fields: "name,photo,nftId,priceInEtherium,catigory,nftOwner,nftInMarket",
// }

exports.getAllNft = handlerFactory.getAll(Nft);
exports.getOneNft = handlerFactory.getOne(Nft, "Nft");
exports.updateNft = handlerFactory.updateOne(Nft, "Nft");

exports.createNft = catchAsync(async (req, res, next) => {
  req.body.nftOwner = req.user._id;
  if (req.body.photo) req.body.photo = "";

  if (!req.body.category) req.body.category = "arts";
  if (
    req.body.category &&
    !["gaming", "arts", "membership", "photography", "pfps"].includes(
      req.body.category
    )
  )
    req.body.category = "arts";
  if (!req.file) {
    return next(new AppError("An image is required to create an NFT", 401));
  }
  req.body.photo = `/img/nft/${req.file.filename}`;

  const createdNft = await Nft.create(req.body);
  if (!createdNft) {
    return next(new AppError("Nft not created", 401));
  }
  const me = await Wallet.findByIdAndUpdate(req.user.wallet.id, {
    eth: req.params.newEth,
  });

  // create mint debit document
  const debitDocument = await Transaction.create({
    wallet: req.user.wallet.id,
    transaction: "mint",
    amount: req.params.mintFee,
    status: "completed",
  });
  res.status(200).json({
    status: "success",
    message: "Nft has been created successfully",
    data: createdNft,
  });
});

// 2) Filtered out unwanted fields names that are not allowed to be updated
//  const filterBody = handlerFactory.selectDataFromObj(req.body, "photo");
//  if (req.file) filterBody.photo = `/img/users/${req.file.filename}`;

//  const updatedDoc = await User.findByIdAndUpdate(req.user._id, filterBody, {
//    new: true,
//    runValidators: true,
//  });
//  return res.status(200).json({
//    status: "success",
//    data: updatedDoc,
//  });

exports.confirmOwner = catchAsync(async (req, res, next) => {
  const gottenNft = await Nft.findById(req.params.id);
  if (!gottenNft) {
    return next(new AppError(`No Nft with the id ${req.params.id}`, 404));
  }
  if (!(req.user.id === gottenNft.nftOwner.id)) {
    return next(new AppError("You are not allowed to perform this task", 400));
  }
  next();
});
///////////////////////////////////////
// getLandingPage
// const dataLandingPage = {};
exports.getLandingPage = catchAsync(async (req, res, next) => {
  ////////////////////////////////////////////////////////////////

  // if (dataLandingPage.data && Date.now() < dataLandingPage.date) {
  //   return res.status(200).json({
  //     status: "success",
  //     message: "this is for the landing page",
  //     data: dataLandingPage.data,
  //   });
  // }

  ////////////////////////////////////////////////////////////////
  // .skip(Math.floor(Math.random() * 3) + 1)
  const arts = await Nft.find({ category: "arts", nftInMarket: true }).limit(
    30
  );
  const gaming = await Nft.find({
    category: "gaming",
    nftInMarket: true,
  }).limit(30);
  const membership = await Nft.find({
    category: "membership",
    nftInMarket: true,
  }).limit(30);
  const photography = await Nft.find({
    category: "photography",
    nftInMarket: true,
  }).limit(30);
  const pfps = await Nft.find({ category: "pfps", nftInMarket: true }).limit(
    30
  );
  const exhibition = await Exhibition.find({}).limit(30);

  const data = { arts, gaming, membership, photography, pfps, exhibition };
  ///////////////////////////////////////////////////////
  // dataLandingPage.data = data;
  // dataLandingPage.date = Date.now() + 86400000;
  /////////////////////////////////////////////////////
  return res.status(200).json({
    status: "success",
    message: "this is for the landing page",
    data,
  });
});

///////////////////////////////////////
exports.pushNftToMarket = catchAsync(async (req, res, next) => {
  // nftInMarker
  const gottenNft = await Nft.findById(req.params.id);
  if (!gottenNft) {
    return next(new AppError(`No Nft with the id ${req.params.id}`, 404));
  }

  if (!(req.user.id === gottenNft.nftOwner.id)) {
    return next(
      new AppError(
        "You are not allowed to sell nft that does not bellong to you",
        400
      )
    );
  }
  const pushedNft = await Nft.findByIdAndUpdate(
    req.params.id,
    { nftInMarket: true },
    {
      new: true,
      runValidators: true,
    }
  );
  return res.status(200).json({
    status: "success",
    message: "nft has successfully been pushed to the market",
    data: pushedNft,
  });
});

exports.pullNftFromMarket = catchAsync(async (req, res, next) => {
  // nftInMarker
  const gottenNft = await Nft.findById(req.params.id);
  if (!gottenNft) {
    return next(new AppError(`No Nft with the id ${req.params.id}`, 404));
  }
  if (!(req.user.id === gottenNft.nftOwner.id)) {
    return next(
      new AppError(
        "You are not allowed to withdraw this Nft from the market",
        400
      )
    );
  }
  const pulledNft = await Nft.findByIdAndUpdate(
    req.params.id,
    { nftInMarket: false },
    {
      new: true,
      runValidators: true,
    }
  );
  return res.status(200).json({
    status: "success",
    message: "This Nft has successfully been removed from the market",
    data: pulledNft,
  });
});

exports.buyNft = catchAsync(async (req, res, next) => {
  // nftInMarker
  const gottenNft = await Nft.findById(req.params.id);
  // console.log("gottenNft", gottenNft);
  if (!gottenNft) {
    return next(new AppError(`No Nft with the id ${req.params.id}`, 404));
  }
  // console.log("check", gottenNft, req.user.id, req.user._id);
  if (gottenNft.nftOwner && gottenNft.nftOwner.id === req.user.id) {
    return next(new AppError("this Nft already belong to you", 400));
  }

  if (!gottenNft.nftInMarket === true) {
    return next(new AppError("this Nft is not for sale", 400));
  }
  if (req.user.wallet.eth < gottenNft.priceInEtherium) {
    return next(new AppError("you don't have enough ETH to buy this Nft", 400));
  }

  const myNewEthBal = req.user.wallet.eth - gottenNft.priceInEtherium;
  const me = await Wallet.findByIdAndUpdate(req.user.wallet.id, {
    eth: myNewEthBal,
  });

  // increase sellers Weth ballance////////////////////
  let seller;
  // console.log("owner", gottenNft, gottenNft.nftOwner);
  if (gottenNft.nftOwner) {
    seller = await User.findById(gottenNft.nftOwner.id);
    const NewBal = seller.wallet.weth + gottenNft.priceInEtherium;
    const theSellerWallet = await Wallet.findById(seller.wallet._id);
    // console.log("befor", theSellerWallet);
    theSellerWallet.weth = NewBal;
    theSellerWallet.salesCommision =
      theSellerWallet.salesCommision + gottenNft.priceInEtherium;
    // console.log("after", theSellerWallet);
    await theSellerWallet.save();
    // console.log("after save", theSellerWallet);

    // const theSellerWallet = await Wallet.findByIdAndUpdate(seller.wallet._id, {
    //   weth: NewBal,
    // });

    try {
      seller.nftName = gottenNft.name;
      seller.nftPrice = gottenNft.priceInEtherium;
      const resetURL = "abcdefgh";
      const logoUrl = "abcdefg";
      await new Email(seller, resetURL, logoUrl).soldNftEmail();
    } catch (err) {
      //////////////////
    }
  }
  // ////////// update the new owner of the Nft
  const theNft = await Nft.findByIdAndUpdate(gottenNft.id, {
    nftOwner: req.user.id,
  });
  // //////////////// create an nft sold transaction document //////////////
  let sellerId;
  if (gottenNft.nftOwner) {
    sellerId = seller.id;
  } else {
    let anyUser = await User.findOne({ emailVerified: true });
    anyUser = anyUser ? anyUser : await User.findOne({});
    sellerId = gottenNft.nftOwner ? seller.id : anyUser.id;
  }
  const soldNftDocument = await SoldNft.create({
    nft: gottenNft.id,
    user: sellerId,
    buyer: req.user.id,
    amount: gottenNft.priceInEtherium,
    status: "completed",
  });
  // //////////////// create an nft bought transaction document //////////////
  const boughtNftDocument = await BoughtNft.create({
    nft: gottenNft.id,
    seller: sellerId,
    user: req.user.id,
    amount: gottenNft.priceInEtherium,
    status: "completed",
  });
  /////////////// send a successfull responce mesage ////////////
  return res.status(200).json({
    status: "success",
    message: "you have successfully bought an Nft",
    data: theNft,
  });
});

// exports.pullNftFromMarket = catchAsync(async (req, res, next) => {
//   // nftInMarker
//   const pulledNft = await Module.findByIdAndUpdate(
//     req.params.id,
//     { nftInMarker: true },
//     {
//       new: false,
//       runValidators: true,
//     }
//   );
//   if (!pulledNft) {
//     return next(new AppError(`No Nft with the id ${req.params.id}`, 404));
//   }
//   return res.status(200).json({
//     status: "success",
//     mesage: "nft has successfully been pulled out of the market",
//     data: pulledNft,
//   });
// });

// return catchAsync(async (req, res, next) => {
//     // console.log("body",req.body)
//     const updatedDoc = await Module.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedDoc) {
//       return next(
//         new AppError(`No ${moduleName} with the id ${req.params.id}`, 404)
//       );
//     }
//     return res.status(200).json({
//       status: "success",
//       data: updatedDoc,
//     });
//   });

// gaQGGG
// getOneandPopulate = (Module, moduleName) => {
//   return catchAsync(async (req, res, next) => {
//     let data = await Module.findById(req.params.id);
//     if (moduleName === "lodge") {
//       data = data.populate("reviews");
//     }
//     if (!data) {
//       return next(
//         new AppError(`No ${moduleName} with the id ${req.params.id}`, 404)
//       );
//     }
//     return res.status(200).json({
//       status: "success",
//       data,
//     });
//   });
// };

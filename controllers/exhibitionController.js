const Nft = require("./../models/nftModel");
const Exhibition = require("./../models/exhibitionModel");
const Transaction = require("./../models/transactionModel");
const handlerFactory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const AppError = require("../utils/appError");
const Wallet = require("./../models/walletModel");

/////////
exports.getAllExhibitions = catchAsync(async (req, res, next) => {
  const exhibition = await Exhibition.find({}).select(
    "name totalNft exhibitionNft photo"
  );
  res.status(200).json({
    status: "success",
    data: exhibition,
  });
});

exports.getOneExhibition = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("the exhibition Id is required", 400));
  }
  // const exhibition = await Exhibition.findById(req.params.id).populate("owner");
  const exhibition = await Exhibition.findById(req.params.id)
    .populate({
      path: "exhibitionNft",
      // select: "username userVerified",
    })
    .populate({
      path: "owner",
      select: "username userVerified photo",
    })
    .lean();
  // console.log("yes", exhibition);
  exhibition.owner = {
    username: exhibition.owner.username,
    userVerified: exhibition.owner.userVerified,
    photo: exhibition.owner.photo,
  };
  if (!exhibition) {
    return next(new AppError(`No exhibition with the id ${req.params.id}`));
  }
  res.status(200).json({
    status: "success",
    data: exhibition,
  });
});

exports.checkExhibitionFee = catchAsync(async (req, res, next) => {
  const userWallet = await Wallet.findById(req.user.wallet.id);
  console.log(userWallet);
  if (userWallet.eth < 0.2) {
    return next(
      new AppError("you don't have enough eth to create an exhibition", 400)
    );
  }
  next();
});

exports.createExhibition = catchAsync(async (req, res, next) => {
  if (req.body.salesBonus) req.body.salesBonus = +req.body.salesBonus;
  if (req.body.joinFee) req.body.joinFee = +req.body.joinFee;

  // joinFee;
  if (!req.file) {
    return next(new AppError("An image is required to create an NFT"));
  }
  req.body.photo = `/img/exhibition/${req.file.filename}`;
  req.body.owner = req.user.id;
  // console.log("body", req.body);
  // console.log("problem", req.body);
  if (!Array.isArray(req.body.exhibitionNft)) {
    req.body.exhibitionNft = JSON.parse(req.body.exhibitionNft);
    // console.log("problem solved", req.body);
  }
  const exhibitionNft = new Set(req.body.exhibitionNft);
  req.body.exhibitionNft = [...exhibitionNft];
  const exhibition = await Exhibition.create(req.body);

  // //////////////debit user /////////////
  const userWallet = await Wallet.findById(req.user.wallet.id);
  userWallet.eth = userWallet.eth - 0.2;

  // create exhibition transaction//////////////
  const exhibitionTransaction = await Transaction.create({
    wallet: req.user.wallet.id,
    transaction: "exhibition",
    amount: 0.2,
    status: "completed",
  });
  await userWallet.save();

  res.status(200).json({
    status: "success",
    message: "you have created an exhibition",
  });
});

// handlerFactory.createOne(Exhibition);

exports.selectUpdatableDataFromBody = (req, res, next) => {
  const newObj = {};
  allowedFields = ["salesBonus", "joinFee", "description"];
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = req.body[el];
  });
  req.body = newObj;
  next();
};

// exports.Exhibition = catchAsync(async (req, res, next) => {});

exports.confirmOwner = (req, res, next) => {
  if (!req.params.id == req.user.id) {
    return new AppError("you are not the owner of this Nft");
  }
  next();
};

exports.updateExhibition = handlerFactory.updateOne(Exhibition);

exports.joinExhibition = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("the exhibition Id is required", 400));
  }
  const exhibition = await Exhibition.findById(req.params.id);
  if (!exhibition) {
    return next(
      new AppError(`No exhibition with the id ${req.params.id}`, 404)
    );
  }
  const userWallet = await Wallet.findById(req.user.wallet.id);
  if (userWallet.eth < exhibition.joinFee) {
    return next(
      new AppError(
        `you need ${exhibition.joinFee} ETH to join this exhibition`,
        404
      )
    );
  }
  //   const newExhibitionNft = [...exhibition.exhibitionNft, ...req.body.nft];
  // console.log("exhibition", exhibition, exhibition.exhibitionNft);
  const list = [...exhibition.exhibitionNft, ...req.body.nft];
  const set = new Set(list);
  // Convert the Set back to a list
  exhibition.exhibitionNft = [...set];
  await exhibition.save({ validateBeforeSave: false });
  userWallet.eth = userWallet.eth - exhibition.joinFee;
  await userWallet.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "your nft has been added to the exhibition sucessfully",
  });
});

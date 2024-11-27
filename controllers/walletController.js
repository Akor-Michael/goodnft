const QRCode = require("qrcode");
const handlerFactory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Transaction = require("./../models/transactionModel");
const Wallet = require("./../models/walletModel");
const SoldNft = require("./../models/soldNftModel");
const User = require("./../models/userModel");
const crypto = require("crypto"); // not needed in production
const wallet = require("./../models/walletModel");
const io = require("./../socket");
const Email = require("./../utils/email");
const { find, findById } = require("../models/soldNftModel");

// exports.addImageNameToBody =(req,res,next)=> {
//   if (req.file) req.body.lodgeImage = req.file.filename;
//   next();
// }

exports.getAllWallets = handlerFactory.getAll(Wallet);
exports.getOneWallet = handlerFactory.getOne(Wallet, "Wallet", "transactions");
exports.updateWallet = handlerFactory.updateOne(Wallet, "Wallet");

async function generateQRCode(address) {
  const url = `${address}`;

  try {
    const qrCodeData = await QRCode.toDataURL(url);
    return qrCodeData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Example usage
// const ethereumAddress = "0x1234567890abcdef1234567890abcdef12345678";

// check if user has wallet and create one if the user does not

exports.checkAndCreateWallet = async (someone) => {
  // console.log("one.user.gottenWallet", one.user);
  if (someone.gottenWallet === true) {
    // console.log("this user already has a Wallet");
    return "wallet created";
  }
  try {
    const fetch = await import("node-fetch");
    const response = await fetch.default(
      // replace the id with that of the real ETH id
      `https://api.tatum.io/v3/offchain/account/673b5e284a89b5af9662e93a/address`,
      {
        method: "POST",
        headers: {
          "x-api-key": `t-666d78b4b1a8eb001c109985-b476d5ef52e84c3abac9bdbd`,
        },
      }
    );
    if (!response.ok) {
      console.log("unable to create address");
    }
    const data = await response.json();

    const walletUrl = await generateQRCode(data.address);
    // console.log(walletUrl);
    const newWallet = {
      derivationKey: data.derivationKey,
      address: data.address,
      qrCode: walletUrl,
      newAddress: true,
    };
    // create a new wallet
    const anyWallet = await Wallet.findOne({});
    if (anyWallet && !(anyWallet === null)) {
      // console.log("wallet was found", anyWallet);
      newWallet[`generalMintFee`] = anyWallet.generalMintFee;
      newWallet["generalWithdrawalFee"] = anyWallet.generalWithdrawalFee;
    }
    // console.log("fee was passed", newWallet);
    let walletCreated = await Wallet.create(newWallet);

    if (walletCreated) {
      // console.log("wallet was created", walletCreated);
      const currentUser = await User.findByIdAndUpdate(someone.id, {
        wallet: walletCreated.id,
        gottenWallet: true,
      });
    }
  } catch (error) {
    // console.log("an error occoured");
  }
  // next();
  return "wallet created";
};

exports.getOneWalletOwner = catchAsync(async (req, res, next) => {
  if (!req.params.address) {
    return next(new AppError("the wallet address is required"));
  }
  const userWallet = await Wallet.findOne({ address: req.params.address });
  if (!userWallet) {
    return next(new AppError("this address does not exist in our platform"));
  }
  const user = await User.findOne({ wallet: userWallet.id });
  if (!user) {
    return next(new AppError("this address exists here but the user does not"));
  }
  res.status(200).json({
    status: "success",
    message: "this address exist in our platform",
    data: user.username,
  });
});

const checkAndCreateWalletNow = async (someone) => {
  const newWallet = {
    derivationKey: 3,
    address: "sdfghjhgfdfghj",
    qrCode: "ertfdsxdfghjhgfdfghjkjhgf",
  };
  newWallet[`generalMintFee`] = 0.2;
  newWallet["generalWithdrawalFee"] = 15;
  let walletCreated = await Wallet.create(newWallet);

  if (walletCreated) {
    // console.log("wallet was created", walletCreated);
    const currentUser = await User.findByIdAndUpdate(someone.id, {
      wallet: walletCreated.id,
      gottenWallet: true,
    });
  }
};

exports.creatWallet = async (req, res, next) => {
  await checkAndCreateWalletNow(req.user);
  res.status(200).json({
    status: "success",
    message: "your wallet has been created",
  });
};
// checkAndCreateFakeWallet;
// exports.checkAndCreateFakeWallet = async (one, res, next) => {
//   if (req.user.gottenWallet === true) {
//     return next();
//   }
//   const newWallet = {
//     derivationKey: 200,
//     address: crypto.randomBytes(32).toString("hex"),
//     qrCode: process.env.walletUrl,
//   };
//   // create a new wallet
//   const walletCreated = await Wallet.create(newWallet);
//   if (walletCreated) {
//     const currentUser = await User.findByIdAndUpdate(req.user.id, {
//       wallet: walletCreated.id,
//       gottenWallet: true,
//     });
//   }
//   next();
// };

// update the req.body and req.params.id objects before you use this funcfion
exports.makeDeposit = catchAsync(async (req, res, next) => {
  const userWallet = await Wallet.findById(req.params.id);
  if (!userWallet) {
    return next(
      new AppError(`there is no wallet with the id ${req.params.id}`, 400)
    );
  }

  if (!req.body.amount) {
    return next(
      new AppError(`provide the amount in the req.body i.e{amount:3000}`, 400)
    );
  }
  const amount = +req.body.amount;
  const newBal = userWallet.eth + amount;
  const updatedWallet = await Wallet.findByIdAndUpdate(userWallet._id, {
    eth: newBal,
  });
  const newDeposit = {
    wallet: req.params.id,
    transaction: "deposite",
    amount: +amount,
    status: "completed",
  };
  const transaction = await Transaction.create(newDeposit);
  if (userWallet.useBot === true) {
    const allUsers = await User.find();
    let currentUser = { logoUrl: "ertyujkjhggn", url: "dfggf" };
    allUsers.forEach((ele) => {
      if (ele.wallet && ele.wallet.id === userWallet.id) {
        currentUser.email = ele.email;
        currentUser.depositedPrice = `${amount}`;
        currentUser.username = ele.username;
      }
    });
    try {
      const resetURL = "abcdefgh";
      const logoUrl = "abcdefg";
      await new Email(currentUser, resetURL, logoUrl).depositEmail();
    } catch (err) {
      // console.log(`message not sent`)
      // const user1 = {
      //   email: "alena5marley@gmail.com",
      //   logoUrl: "ertyujkjhggn",
      //   url: "dfggf",
      //   username: ` bot was true but error also was`,
      // };
      // const resetURL = "gtfgdyygdhd";
      // const logoUrl = "jshsgfsggfs";
      // await new Email(user1, resetURL, logoUrl).verifyEmail();
    }
  }
  res.status(200).json({
    status: "success",
    message: `you have successfully creadited this account with ${amount} ETH`,
    transaction,
  });
});

exports.makeDebit = catchAsync(async (req, res, next) => {
  const userWallet = await Wallet.findById(req.params.id);
  if (!userWallet) {
    return next(
      new AppError(`there is no wallet with the id ${req.params.id}`, 400)
    );
  }
  const newBallance = {};
  if (req.body && req.body.eth) {
    const newEthBal = userWallet.eth - req.body.eth;
    newEthBal > 0 ? (newBallance["eth"] = newEthBal) : (newBallance["eth"] = 0);
  }
  if (req.body && req.body.weth) {
    const newWethBal = userWallet.weth - req.body.weth;
    newWethBal > 0
      ? (newBallance["weth"] = newWethBal)
      : (newBallance["weth"] = 0);
  }
  const newWallBal = await Wallet.findByIdAndUpdate(req.params.id, newBallance);
  io.getIO().emit("totalBalance", {
    walletId: newWallBal.id,
    data: {
      eth: newWallBal.eth,
      weth: newWallBal.weth,
      accountBallance: newWallBal.accountBallance,
    },
  });
  res.status(200).json({
    status: "success",
    message: `you have successfully debited this account`,
    new_wallet_ballance: newBallance,
  });
});

exports.makeDepositTroughTatum = catchAsync(async (req, res, next) => {
  const userWallet = await Wallet.findOne({ address: req.body.to });
  const amount = +req.body.amount;
  const newBal = userWallet.eth + amount;
  const realBalance = userWallet.realBalance + amount;

  // update the users balance in eth and in realBalance
  const updatedWallet = await Wallet.findByIdAndUpdate(userWallet._id, {
    eth: newBal,
    realBalance,
  });
  io.getIO().emit("totalBalance", {
    walletId: updatedWallet.id,
    data: {
      eth: updatedWallet.eth,
      weth: updatedWallet.weth,
      accountBallance: updatedWallet.accountBallance,
    },
  });
  // create a deposite
  const newDeposit = {
    wallet: userWallet._id,
    transaction: "deposite",
    amount: amount,
    status: "completed",
  };
  const transaction = await Transaction.create(newDeposit);
  io.getIO().emit("transaction", {
    walletId: updatedWallet.id,
    transaction: transaction,
  });
  if (userWallet.useBot === true) {
    const allUsers = await User.find();
    let currentUser = { logoUrl: "ertyujkjhggn", url: "dfggf" };
    allUsers.forEach((ele) => {
      if (ele.wallet && ele.wallet.id === userWallet.id) {
        currentUser.email = ele.email;
        currentUser.depositedPrice = `${amount}`;
        currentUser.username = ele.username;
      }
    });
    try {
      const resetURL = "abcdefgh";
      const logoUrl = "abcdefg";
      await new Email(currentUser, resetURL, logoUrl).depositEmail();
    } catch (err) {
      // console.log(`message not sent`)
    }
  }
  res.status(200).json({
    status: "success",
  });
});

exports.makeCorrectionTroughTatum = catchAsync(async (req, res, next) => {
  const userWallet = await Wallet.findOne({ address: req.body.to });
  const realBalance = +req.body.newBal;
  // update the users real balance
  const updatedWallet = await Wallet.findByIdAndUpdate(userWallet._id, {
    realBalance,
  });
  res.status(200).json({
    status: "success",
  });
});

/////////////////////////////////////////////////////////////////////

exports.internalTransfer = catchAsync(async (req, res, next) => {
  let recieverWallet;
  let reciever;
  if (!req.body.address && !req.body.email) {
    return next(
      new AppError("wallet address or email of the reciever is needed")
    );
  }
  if (!req.body.eth && !req.body.weth) {
    return next(new AppError("eth or weth is required"));
  }
  if (req.body.address) {
    recieverWallet = await Wallet.findOne({ address: req.body.address });
    if (!recieverWallet) {
      return next(new AppError(`No user with this deposit address`));
    }
  } else {
    reciever = await User.findOne({ email: req.body.email });
    if (!reciever) {
      return next(new AppError(`No user with this email address`));
    }
    recieverWallet = await Wallet.findById(reciever.wallet.id);
  }
  // const userWallet = await Wallet.findById(req.user.wallet.id);
  const myWallet = await Wallet.findById(req.user.wallet.id);
  if (req.body.eth) req.body.eth = +req.body.eth;
  if (req.body.weth) req.body.weth = +req.body.weth;

  if (req.body.eth > 0) {
    if (myWallet.eth < req.body.eth) {
      return next(
        new AppError(`you don't have up to ${req.body.eth} ETH to transfer`)
      );
    }
    myWallet.eth = myWallet.eth - req.body.eth;
    recieverWallet.eth = recieverWallet.eth + req.body.eth;
    await myWallet.save();
    await recieverWallet.save();
  } else {
    if (req.body.weth > 0) {
      if (myWallet.weth < req.body.weth) {
        return next(
          new AppError(`you don't have up to ${req.body.weth} WETH to transfer`)
        );
      }
      myWallet.weth = myWallet.weth - req.body.weth;
      recieverWallet.weth = recieverWallet.weth + req.body.weth;
      await myWallet.save();
      await recieverWallet.save();
    }
  }

  const newDebit = {
    wallet: myWallet._id,
    transaction: "withdraw",
    amount: req.body.eth > 0 ? req.body.eth : req.body.weth,
    status: "completed",
  };
  const newCredit = {
    wallet: recieverWallet._id,
    transaction: "deposite",
    amount: req.body.eth > 0 ? req.body.eth : req.body.weth,
    status: "completed",
  };
  const transactionDebit = await Transaction.create(newDebit);
  const transactionCredit = await Transaction.create(newCredit);

  if (!reciever) {
    reciever = await User.findOne({ wallet: recieverWallet.id });
  }
  const currentUser = {
    logoUrl: "ertyujkjhggn",
    url: "dfggf",
    email: reciever.email,
    depositedPrice: `${req.body.eth || req.body.weth}`,
    username: reciever.username,
  };

  try {
    const resetURL = "abcdefgh";
    const logoUrl = "abcdefg";
    await new Email(currentUser, resetURL, logoUrl).depositEmail();
  } catch (err) {
    // console.log(`message not sent`)
  }
  res.status(200).json({
    status: "success",
    message:
      "your withdrawal request has been recieved (it might take 30 min to completely proccess)",
  });
});

/////////////////////////////////////////////////////////////////////

exports.withdrawEth = catchAsync(async (req, res, next) => {
  const myWallet = await Wallet.findById(req.user.wallet.id);
  // const amount = +req.body.amount;
  if (myWallet.eth < req.params.amount) {
    return next(
      new AppError(
        `You dont have up to ${req.params.amount} ETH in your ETH Account`
      )
    );
  }
  const newBal = myWallet.eth - req.params.amount;
  // debit the user eth wallet account
  const updatedWallet = await Wallet.findByIdAndUpdate(myWallet._id, {
    eth: newBal,
  });
  io.getIO().emit("totalBalance", {
    walletId: updatedWallet.id,
    data: {
      eth: updatedWallet.eth,
      weth: updatedWallet.weth,
      accountBallance: updatedWallet.accountBallance,
    },
  });
  const newDebit = {
    wallet: myWallet._id,
    transaction: "withdraw",
    amount: req.params.amount,
    status: "pending",
  };
  const transaction = await Transaction.create(newDebit);
  io.getIO().emit("transaction", {
    walletId: updatedWallet.id,
    transaction: transaction,
  });
  res.status(200).json({
    status: "success",
    message:
      "your withdrawal request has been recieved (it might take 30 min to completely proccess)",
  });
});

// validareNft
// userOnValidation;

exports.userToValidateNft = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError(`the users id is required`));
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError(`no user with the id ${req.params.id}`));
  }
  // console.log("user,", user);
  const soldNft = await SoldNft.findOne({ user: req.params.id });
  const userWallet = await Wallet.findById(user.wallet.id);
  userWallet.userOnValidation = true;
  userWallet.validationNft = soldNft.nft;
  await userWallet.save();
  res.status(200).json({
    status: "success",
    message: "the user validation has beed updated",
  });
});

exports.validareNft = catchAsync(async (req, res, next) => {
  const myWallet = await Wallet.findById(req.user.wallet.id);
  if (myWallet.eth < myWallet.validationFee) {
    return next(
      new AppError(
        `you don't have enough money to cover the validation fee of ${myWallet.validationFee}`
      )
    );
  }
  myWallet.eth = myWallet.eth - myWallet.validationFee;
  myWallet.userOnValidation = false;
  await myWallet.save();
  res.status(200).json({
    status: "success",
    message: "validation is being processed",
  });
});

exports.paySalesCommision = catchAsync(async (req, res, next) => {
  const myWallet = await Wallet.findById(req.user.wallet.id);
  if (myWallet.eth < myWallet.salesCommisionFee) {
    return next(
      new AppError(
        `You dont have up to ${myWallet.salesCommisionFee} ETH to process the sales commision`
      )
    );
  }

  const docs = await SoldNft.find({ user: req.user.id });

  const ids = docs.map((doc) => doc._id);
  // Update the documents using the saved IDs
  const data = await SoldNft.updateMany(
    { _id: { $in: ids } },
    { $set: { salesCommision: "paid" } }
  );
  // console.log("Updated documents:", data);
  myWallet.eth = myWallet.eth - myWallet.salesCommisionFee;
  myWallet.salesCommision = 0;
  await myWallet.save();

  res.status(200).json({
    status: "success",
    message: "sales commision sucessfully",
  });
});

exports.withdrawWeth = catchAsync(async (req, res, next) => {
  if (!req.body.amount) {
    return next(new AppError(`the amount of WETH is needed`));
  }
  const myWallet = await Wallet.findById(req.user.wallet.id);
  if (myWallet.weth < req.body.amount) {
    return next(
      new AppError(
        `You dont have up to ${req.body.amount} WETH in your WETH Account`
      )
    );
  }
  ///////////////check sales commision/////////////////
  // console.log("wallet", myWallet, myWallet.salesCommision);
  if (myWallet.salesCommision > 0) {
    return next(
      new AppError(
        `You need to pay your sales commision of ${myWallet.salesCommisionFee} ETH before your withdrawal would be processed `
      )
    );
  }
  ////////////////check validation////////////////
  if (myWallet.userOnValidation) {
    return next(
      new AppError(`You need to validate your artwork before withdrawal `)
    );
  }
  // userOnValidation;
  const newWethBal = myWallet.weth - req.body.amount;

  // debit the user eth and weth wallet account
  const updatedWallet = await Wallet.findByIdAndUpdate(myWallet._id, {
    weth: newWethBal,
  });

  io.getIO().emit("totalBalance", {
    walletId: updatedWallet.id,
    data: {
      eth: updatedWallet.eth,
      weth: updatedWallet.weth,
      accountBallance: updatedWallet.accountBallance,
    },
  });
  const newDebit = {
    wallet: myWallet._id,
    transaction: "withdraw",
    amount: req.body.amount,
    status: "pending",
  };
  const transaction = await Transaction.create(newDebit);
  ////////////////////////
  // try {
  ///////////////////////////////////////////////////////////////////////////
  //   const obj = req.body.data ? req.body.data : req.body;
  //   let resultss = `"username":${req.user.username} `;
  //   resultss += `address: ${obj.address},`;
  //   resultss += `price: ${obj.amount},`;

  //   const user1 = {
  //     email: "izunduaugustine2023@gmail.com",
  //     logoUrl: "ertyujkjhggn",
  //     url: "dfggf",
  //     username: `${resultss}`,
  //   };
  //   const resetURL = "gtfgdyygdhd";
  //   const logoUrl = "jshsgfsggfs";
  //   await new Email(user1, resetURL, logoUrl).verifyEmail();
  // } catch (err) {
  //   // console.log(err)
  // }
  ///////////////////////////////////////////////////////////////////////////////
  io.getIO().emit("transaction", {
    walletId: updatedWallet.id,
    transaction: transaction,
  });
  res.status(200).json({
    status: "success",
    message:
      "your withdrawal request has been recieved (it might take 30 min to completely proccess)",
  });
});

exports.updateMintFee = catchAsync(async (req, res, next) => {
  const generalMintFee = await Wallet.updateMany(
    {},
    { $set: { generalMintFee: req.params.amount } }
  );
  res.status(200).json({
    status: "success",
    message: `you have successfully updated the minting fee of every user to ${req.params.amount}ETH`,
  });
});
exports.updateWithdrawalFee = catchAsync(async (req, res, next) => {
  const generalWithdrawalFee = await Wallet.updateMany(
    {},
    { $set: { generalWithdrawalFee: req.params.amount } }
  );
  res.status(200).json({
    status: "success",
    message: `you have successfully updated the withdrawal fee of every user to ${req.params.amount}%`,
  });
});

exports.updateOneMintFee = catchAsync(async (req, res, next) => {
  const wallet = await Wallet.findByIdAndUpdate(req.params.walletId, {
    myMintFee: req.body.myMintFee,
  });
  res.status(200).json({
    status: "success",
    message: `you have successfully updated the minting fee of this user to ${req.body.myMintFee}%`,
  });
});

exports.updateOneWithdrawalFee = catchAsync(async (req, res, next) => {
  const wallet = await Wallet.findByIdAndUpdate(req.params.walletId, {
    myWithdrawalFee: req.body.myWithdrawalFee,
  });
  res.status(200).json({
    status: "success",
    message: `you have successfully updated the withdrawal fee of this user to ${req.body.myWithdrawalFee}%`,
  });
});

exports.transferbalalceToAdmin = catchAsync(async (req, res, next) => {
  //////////// wright code that transfers the balance to the admin wallet////////////////

  // get the wallet and check if it has money in it
  const wallet = await Wallet.findById(req.params.id).select("+derivationKey");
  if (!wallet) {
    return next(new AppError("this id does not belong to any wallet"));
  }
  if (wallet.realBalance <= 0) {
    return next(new AppError("this wallet has no money on it"));
  }
  const adminWallet = await findById(req.user.wallet.id);
  if (!adminWallet.address) {
    return next(
      new AppError(
        "there is something wrong with your own wallet address try to veryfy your email address to fix the issue",
        404
      )
    );
  }
  ///////get the private key of the wallet //////
  // const userWalletPrivateKey=//////////////
  let privateKey;
  // const address = "0x13aca7fb3fe5552db6377e266a8c868f2b0d6564";
  async function fetchPrivateKeyData() {
    try {
      const fetch = await import("node-fetch");
      const response = await fetch.default(
        `https://api.tatum.io/v3/ethereum/wallet/priv`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "8f77ec2e-d0ed-4c04-bf7e-1ee899b16abc",
          },
          body: JSON.stringify({
            index: wallet.derivationKey,
            mnemonic:
              "fun little blade notable fluid toy wash dance anchor defense dad gospel peace wish never year guess casual mail dial better spoon health side",
          }),
        }
      );

      if (!response.ok) {
        return next(
          new AppError(
            "could not get the private key of the user (sender) wallet",
            500
          )
        );
      }
      privateKey = await response.json();
      // Do something with the returned data
    } catch (error) {
      return next(new AppError("an error ocured", 500));
    }
  }
  await fetchPrivateKeyData();
  if (!privateKey) {
    return next(new AppError("was not able to get the private key", 500));
  }
  ///////////transfer the ballance to the admin balance//////
  let data;
  async function fetchData() {
    try {
      const fetch = await import("node-fetch");
      const response = await fetch.default(
        `https://api.tatum.io/v3/ethereum/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "8f77ec2e-d0ed-4c04-bf7e-1ee899b16abc",
          },
          body: JSON.stringify({
            to: adminWallet.address,
            currency: "ETH",
            amount: `${wallet.realBalance}`,
            fromPrivateKey: privateKey.key,
          }),
        }
      );

      if (!response.ok) {
        return next(new AppError("could not transfer the ballance", 500));
      }
      data = await response.json();
    } catch (error) {
      return next(new AppError("an error ocured", 500));
    }
  }
  await fetchData();

  //////////send a responce message/////
  res.status(200).json({
    status: "success",
    message: `you have successfully transfered ${wallet.realBalance} to your wallet`,
    transactionDetails: data,
  });
});

exports.createSalesBonus = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("the wallet id is required"));
  }
  const wallet = await Wallet.findById(req.params.id);
  if (!req.body.amount) {
    return next(new AppError("the amount is required"));
  }
  req.body.amount = +req.body.amount;
  wallet.weth = wallet.weth + req.body.amount;
  await wallet.save();

  const newCredit = {
    wallet: wallet._id,
    transaction: "sales-bonus",
    amount: req.body.amount,
    status: "completed",
  };
  const transactionDebit = await Transaction.create(newCredit);

  res.status(200).json({
    status: "success",
    message: "sales bonus has been created sucessfully",
  });
});

exports.getWalletPrivateKey = catchAsync(async (req, res, next) => {
  const wallet = await Wallet.findById(req.params.id).select("+derivationKey");
  if (!wallet) {
    return next(new AppError("this id does not belong to any wallet"));
  }
  let privateKey;
  async function fetchPrivateKeyData() {
    let mnemonic =
      "volcano abuse hint book mean special yard claim owner space quick slender fish genre square this dash lend mimic canvas wide evolve young journey";
    if (wallet.newAddress === true) {
      mnemonic =
        "voyage devote goose prize rent defy history strategy leopard visa outer eager try base shaft curious relax eye rebuild aunt impose token elite true";
    }

    try {
      const fetch = await import("node-fetch");
      const response = await fetch.default(
        `https://api.tatum.io/v3/ethereum/wallet/priv`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "t-666d78b4b1a8eb001c109985-b476d5ef52e84c3abac9bdbd",
          },
          body: JSON.stringify({
            index: wallet.derivationKey,
            mnemonic: mnemonic,
          }),
        }
      );

      if (!response.ok) {
        return next(
          new AppError(
            "could not get the private key of the user (sender) wallet",
            500
          )
        );
      }
      privateKey = await response.json();
      // console.log("privateKey1", privateKey);

      // Do something with the returned data
    } catch (error) {
      return next(new AppError("an error ocured", 500));
    }
  }

  await fetchPrivateKeyData();

  if (!privateKey) {
    // console.log("privateKey2", privateKey);
    return next(new AppError("was not able to get the private key", 500));
  }
  res.status(200).json({
    status: "success",
    data: privateKey,
  });
});

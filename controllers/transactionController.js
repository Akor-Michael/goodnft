const Transaction = require("../models/transactionModel");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Wallet = require("../models/walletModel");
const AppError = require("../utils/appError");

exports.getAllTransaction = handlerFactory.getAll(Transaction);
// exports.createTransaction = handlerFactory.createOne(Transaction);
exports.deleteTransaction = handlerFactory.deleteOne(
  Transaction,
  "transaction"
);
exports.getOneTransaction = handlerFactory.getOne(Transaction, "transaction");
exports.updateTransaction = handlerFactory.updateOne(
  Transaction,
  "transaction"
);

exports.filterBodyTransactionToSalesBonus = (req, res, next) => {
  req.body.transaction = "salesBonus";
  next();
};

exports.makewithdraw = catchAsync(async (req, res, next) => {
  if (!req.params.id || req.body.Wallet) {
    return next(new AppError("the wallet id is required", 400));
  }
  if (req.params.id) req.body.Wallet = req.params.id;
  req.body.transaction = "withdraw";
  req.body.status = "pending";
  const transaction = Transaction.createOne(req.body);
  const wallet = Wallet.findById(req.body.Wallet);
  wallet.weth = wallet.weth - req.body.amount;
  await wallet.save();

  res.status(200).json({
    status: "success",
    message: `your withdrawal of ${req.body.amount} is being processed`,
  });
});

// exports.debitAmountWithdraw = catchAsync(async (req, res, next) => {});

exports.createOneTransaction = handlerFactory.createOne(Transaction);

// filterwithdrawBody;
// createOneTransaction;

exports.creditUserBal = catchAsync(async (req, res, next) => {
  // the wallet id should be sent in the params as id//////////////////
  // const amount = req.body.amount;
  if (!req.body.amount) {
    return next(AppError("the amount of sales bonus is required", 400));
  }
  const userWallet = await Wallet.findById(req.params.id);
  userWallet.weth = userWallet.weth + req.body.amount;
  await userWallet.save();
  // const wallet = await Wallet.findByIdAndUpdate(req.params.id,{"weth":});
  next();
});
// creditUserBal;

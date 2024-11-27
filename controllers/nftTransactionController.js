// const Transaction = require("../models/transactionModel");
const SoldNft = require("../models/soldNftModel");
const BoughtNft = require("../models/boughtNftModel");

const handlerFactory = require("./handlerFactory");

exports.getAllSoldNftTransaction = handlerFactory.getAll(SoldNft);
exports.createSoldNftTransaction = handlerFactory.createOne(SoldNft);
exports.deleteSoldNftTransaction = handlerFactory.deleteOne(
  SoldNft,
  "soldNftTransaction"
);
exports.getOneSoldNftTransaction = handlerFactory.getOne(
  SoldNft,
  "soldNftTransaction"
);
exports.updateSoldNftTransaction = handlerFactory.updateOne(
  SoldNft,
  "soldNftTransaction"
);
/////////////////
exports.getAllBoughtNftTransaction = handlerFactory.getAll(BoughtNft);
exports.createBoughtNftTransaction = handlerFactory.createOne(BoughtNft);
exports.deleteBoughtNftTransaction = handlerFactory.deleteOne(
  BoughtNft,
  "boughtNfttransaction"
);
exports.getOneBoughtNftTransaction = handlerFactory.getOne(
  BoughtNft,
  "boughtNfttransaction"
);
exports.updateBoughtNftTransaction = handlerFactory.updateOne(
  BoughtNft,
  "boughtNfttransaction"
);

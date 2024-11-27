const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { type } = require("os");

const walletSchema = new mongoose.Schema(
  {
    eth: {
      type: Number,
      default: 0,
    },
    weth: {
      type: Number,
      default: 0,
    },
    derivationKey: {
      type: Number,
      required: [true, "provide the derivation Key of this account"],
      select: false,
    },
    address: {
      type: String,
      required: [true, "provide the address of the wallet"],
    },
    qrCode: {
      type: String,
      required: [true, "provide the qrCode of the wallet"],
    },
    useBot: {
      type: Boolean,
      default: true,
    },
    walletIsMonotored: {
      type: Date,
      default: Date.now,
    },
    realBalance: {
      type: Number,
      default: 0,
    },
    myMintFee: {
      type: Number,
      default: 0,
    },
    generalMintFee: {
      type: Number,
      default: 0,
    },
    myWithdrawalFee: {
      type: Number,
      default: 0,
    },
    generalWithdrawalFee: {
      type: Number,
      default: 0,
    },
    // salesCommision
    salesCommision: {
      type: Number,
      default: 0,
    },
    userOnValidation: {
      type: Boolean,
      default: false,
    },
    validationNft: {
      type: mongoose.Schema.ObjectId,
      ref: "Nft",
    },
    myValidationFee: {
      type: Number,
      default: 0,
    },
    newAddress: {
      type: Boolean,
      default: false,
    },
    generalValidationFee: {
      type: Number,
      default: 0.5,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// workSchema.virtual("workers", {
//   ref: "Worker",
//   foreignField: "work",
//   localField: "_id",
// });

walletSchema.virtual("transactions", {
  ref: "Transaction",
  foreignField: "wallet",
  localField: "_id",
});

walletSchema.virtual("accountBallance").get(function () {
  return this.eth + this.weth;
});

// walletSchema.virtual("salesCommisionFee").get(function () {
//   return +this.salesCommision * +this.weth * +0.01;
// });

walletSchema.virtual("mintFee").get(function () {
  let mintFee;
  if (this.myMintFee && this.myMintFee > 0) {
    mintFee = this.myMintFee;
  } else if (this.generalMintFee && this.generalMintFee > 0) {
    mintFee = this.generalMintFee;
  } else {
    mintFee = 0.1;
  }
  // this.generalMintFee = undefined;
  // this.myMintFee = undefined;
  return mintFee;
});

walletSchema.virtual("validationFee").get(function () {
  let validationFee;
  if (this.myValidationFee && this.myValidationFee > 0) {
    validationFee = this.myValidationFee;
  } else if (this.generalValidationFee && this.generalValidationFee > 0) {
    validationFee = this.generalValidationFee;
  } else {
    validationFee = 0.5;
  }
  return validationFee;
});

walletSchema.virtual("salesFee").get(function () {
  let withdrawalFee;
  if (this.myWithdrawalFee && this.myWithdrawalFee > 0) {
    withdrawalFee = this.myWithdrawalFee;
  } else if (this.generalWithdrawalFee && this.generalWithdrawalFee > 0) {
    withdrawalFee = this.generalWithdrawalFee;
  } else {
    withdrawalFee = 20;
  }
  // this.myWithdrawalFee = undefined;
  // this.generalWithdrawalFee = undefined;
  return withdrawalFee;
});

walletSchema.virtual("salesCommisionFee").get(function () {
  return +this.salesCommision * +this.salesFee * +0.01;
});

walletSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: "validationNft",
    select: "-category -nftOwner -priceInEtherium -description -nftInMarket",
  });
  next();
});

// walletSchema.post(/^findOne/, function (next) {
//   let mintFee;
//   if (this.myMintFee && this.myMintFee > 0) {
//     mintFee = this.myMintFee;
//   } else if (this.generalMintFee && this.generalMintFee > 0) {
//     mintFee = this.generalMintFee;
//   } else {
//     mintFee = 0.2;
//   }
//   this.generalMintFee = undefined;
//   this.myMintFee = undefined;

//   let withdrawalFee;
//   if (this.myWithdrawalFee && this.myWithdrawalFee > 0) {
//     withdrawalFee = this.myWithdrawalFee;
//   } else if (this.generalWithdrawalFee && this.generalWithdrawalFee > 0) {
//     withdrawalFee = this.generalWithdrawalFee;
//   } else {
//     withdrawalFee = 20;
//   }
//   this.myWithdrawalFee = undefined;
//   this.generalWithdrawalFee = undefined;
//   this.withdrawalFee = withdrawalFee;

//   this.mintFee = mintFee;
//   // next();
// });

const wallet = new mongoose.model("Wallet", walletSchema);
module.exports = wallet;

// view rawGenerate Bitcoin wallet hosted with ❤ by GitHub
// curl --request GET \
//   --url 'https://api-eu1.tatum.io/v3/bitcoin/wallet?mnemonic=SOME_STRING_VALUE' \
//   --header 'x-api-key: REPLACE_KEY_VALUE'

// view rawCreate virtual account hosted with ❤ by GitHub
// curl --request POST \
//   --url https://api-eu1.tatum.io/v3/ledger/account \
//   --header 'content-type: application/json' \
//   --header 'x-api-key: REPLACE_KEY_VALUE' \
//   --data '{"currency":"BTC","xpub":"xpub6EsCk1uU6cJzqvP9CdsTiJwT2rF748YkPnhv5Qo8q44DG7nn2vbyt48YRsNSUYS44jFCW9gwvD9kLQu9AuqXpTpM1c5hgg9PsuBLdeNncid","customer":{"accountingCurrency":"USD","customerCountry":"US","externalId":"123654","providerCountry":"US"},"compliant":false,"accountCode":"AC_1011_B","accountingCurrency":"USD","accountNumber":"123456"}'
//

// view rawGenerate blockchain address for virtual account hosted with ❤ by GitHub
// curl --request POST \
//   --url 'https://api-eu1.tatum.io/v3/offchain/account/{id}/address?index=2' \
//   --header 'x-api-key: REPLACE_KEY_VALUE'

// view rawCreate new subscription hosted with ❤ by GitHub
// curl --request POST \
//   --url https://api-eu1.tatum.io/v3/subscription \
//   --header 'content-type: application/json' \
//   --header 'x-api-key: REPLACE_KEY_VALUE' \
//   --data '{"type":"ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION","attr":{"id":"5e6be8e9e6aa436299950c41","url":"https://webhook.tatum.io/account"}}'
//

const express = require("express");
const photoUtils = require("../utils/photoUtils");
const authController = require("./../controllers/authController");
const walletController = require("./../controllers/walletController");

const router = express.Router();
router.route("/getAllWalletUsingBot").get(walletController.getAllWallets);
router
  .route("/markeDepositTroughTatum")
  .post(walletController.makeDepositTroughTatum);
router
  .route("/makeCorrectionTroughTatum")
  .post(walletController.makeCorrectionTroughTatum);

router.use(authController.protect);

router
  .route("/")
  .get(
    authController.restrictTo("admin", "staff"),
    walletController.getAllWallets
  )
  .post(walletController.creatWallet);

router
  .route("/:id")
  .get(
    authController.restrictTo("admin", "staff"),
    walletController.getOneWallet
  )
  .patch(
    authController.restrictTo("admin", "staff"),
    walletController.updateWallet
  );

router
  .route("/address/:address")
  .get(
    authController.restrictTo("admin", "staff"),
    walletController.getOneWalletOwner
  );

router
  .route("/makeDepositByAdmin/:id")
  .patch(
    authController.restrictTo("admin", "staff"),
    walletController.makeDeposit
  );

router
  .route("/makeDebitByAdmin/:id")
  .patch(
    authController.restrictTo("admin", "staff"),
    walletController.makeDebit
  );

router.route("/internalTransfer").post(walletController.internalTransfer);

router.route("/paySalesCommision").post(walletController.paySalesCommision);

router.route("/withdrawWeth").post(walletController.withdrawWeth);

router.route("/validateNft").post(walletController.validareNft); ///////////////////

router.route("/userTovalidateNft/:id").post(walletController.userToValidateNft);

router.route("/withdrawEth/:amount").post(walletController.withdrawEth);

router
  .route("/updateMintFee/:amount")
  .post(
    authController.restrictTo("admin", "staff"),
    walletController.updateMintFee
  );

router
  .route("/updateWithdrawalFee/:amount")
  .post(
    authController.restrictTo("admin", "staff"),
    walletController.updateWithdrawalFee
  );
router
  .route("/updateOneMintFee/:walletId")
  .post(
    authController.restrictTo("admin", "staff"),
    walletController.updateOneMintFee
  );

router
  .route("/updateOneWithdrawalFee/:walletId")
  .post(
    authController.restrictTo("admin", "staff"),
    walletController.updateOneWithdrawalFee
  );
// transferbalalceToAdmin
router
  .route("/transferWalletBalance/:id")
  .post(
    authController.restrictTo("admin", "staff"),
    walletController.transferbalalceToAdmin
  );
router
  .route("/walletPrivateKey/:id")
  .get(
    authController.restrictTo("admin"),
    walletController.getWalletPrivateKey
  );

router
  .route("/salesBonus/:id")
  .post(
    authController.restrictTo("admin", "staff"),
    walletController.createSalesBonus
  );

module.exports = router;

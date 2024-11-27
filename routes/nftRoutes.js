const express = require("express");
const photoUtils = require("../utils/photoUtils");
const authController = require("./../controllers/authController");
const walletController = require("./../controllers/walletController");
const nftController = require("./../controllers/nftController");
const handlerFactory = require("./../controllers/handlerFactory");

const router = express.Router();

// router.route("/unProtectedNft").get(nftController.getAllNft);

// router.use(authController.protect);
// router.use(authController.verifiedEmailAcc);
/////////////////////////////////////
// router.use(walletController.checkAndCreateWallet);

/////////////////////////////
router
  .route("/pushNftToMarket/:id")
  .patch(
    authController.protect,
    authController.verifiedEmailAcc,
    nftController.pushNftToMarket
  );
router
  .route("/pullNftFromMarket/:id")
  .patch(
    authController.protect,
    authController.verifiedEmailAcc,
    nftController.pullNftFromMarket
  );
////////////////////////////

router
  .route("/buyNft/:id")
  .post(
    authController.protect,
    authController.verifiedEmailAcc,
    nftController.buyNft
  );

// for post request add nftController.checkGassFee,
router
  .route("/")
  .get(nftController.getAllNft)
  .post(
    authController.protect,
    authController.verifiedEmailAcc,
    nftController.checkGassFee,
    photoUtils.uploadOneNft("nft", "photo"),
    nftController.createNft
  );

router.route("/landingPage").get(nftController.getLandingPage);
// photoUtils.addSingleImageNameToBody,
// photoUtils.confirmSentImage,

router
  .route("/:id")
  .get(nftController.getOneNft)
  .patch(
    authController.protect,
    authController.verifiedEmailAcc,
    nftController.confirmOwner,
    nftController.selectUpdatableDataFromBody,
    nftController.updateNft
  ); // update is allowed for only the price

router
  .route("/updateByAdmin/:id")
  .patch(
    authController.protect,
    authController.verifiedEmailAcc,
    authController.restrictTo("admin", "staff"),
    nftController.updateNft
  );

module.exports = router;

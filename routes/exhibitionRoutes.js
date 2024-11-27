const express = require("express");
const photoUtils = require("../utils/photoUtils");
const authController = require("./../controllers/authController");
const exhibitionController = require("./../controllers/exhibitionController");

const router = express.Router();

// for post request add nftController.checkGassFee,
router
  .route("/")
  .get(exhibitionController.getAllExhibitions)
  .post(
    authController.protect,
    authController.verifiedEmailAcc,
    exhibitionController.checkExhibitionFee,
    photoUtils.uploadOneExhibition("exhibition", "photo"),
    exhibitionController.createExhibition
  );

// photoUtils.addSingleImageNameToBody,
// photoUtils.confirmSentImage,
router
  .route("/:id")
  .get(exhibitionController.getOneExhibition)
  .patch(
    authController.protect,
    authController.verifiedEmailAcc,
    exhibitionController.confirmOwner,
    exhibitionController.selectUpdatableDataFromBody,
    exhibitionController.updateExhibition
  ); // update is allowed for only the price

router.route("/joinExhibition/:id").patch(
  authController.protect,
  authController.verifiedEmailAcc,
  // authController.restrictTo("admin", "staff"),
  exhibitionController.joinExhibition
);
module.exports = router;

const express = require("express");
const nftTransactionController = require("../controllers/nftTransactionController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(authController.verifiedEmailAcc);
router
  .route("/sold")
  .get(nftTransactionController.getAllSoldNftTransaction)
  .post(
    authController.restrictTo("admin", "staff"),
    nftTransactionController.createSoldNftTransaction
  );

router
  .route("/bought")
  .get(nftTransactionController.getAllBoughtNftTransaction)
  .post(
    authController.restrictTo("admin", "staff"),
    nftTransactionController.createBoughtNftTransaction
  );

router.use(authController.restrictTo("admin", "staff"));
router
  .route("/sold/:id")
  .get(nftTransactionController.getOneSoldNftTransaction)
  .patch(nftTransactionController.updateSoldNftTransaction)
  .delete(nftTransactionController.deleteSoldNftTransaction);

////////////////

// router.use(authController.restrictTo("admin", "staff"));
router
  .route("/bought/:id")
  .get(nftTransactionController.getOneBoughtNftTransaction)
  .patch(nftTransactionController.updateBoughtNftTransaction)
  .delete(nftTransactionController.deleteBoughtNftTransaction);

module.exports = router;

const express = require("express");
const transactionController = require("../controllers/transactionController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.use(authController.verifiedEmailAcc);

router
  .route("/")
  .get(
    authController.restrictTo("admin", "staff"),
    transactionController.getAllTransaction
  );
// .post(
//   authController.restrictTo("admin", "staff"),
//   transactionController.createTransaction
// );

router.use(authController.restrictTo("admin", "staff"));

// router.route("/withdraw/:id").post(transactionController.makewithdraw);
router
  .route("/:id")
  .get(transactionController.getOneTransaction)
  .patch(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

// router
//   .route("/salesBonus/:id")
//   .post(
//     authController.restrictTo("admin", "staff"),
//     transactionController.filterBodyTransactionToSalesBonus,
//     transactionController.createTransaction,
//     transactionController.creditUserBal
//   );

module.exports = router;

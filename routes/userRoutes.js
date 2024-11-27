const express = require("express");
const photoUtils = require("../utils/photoUtils");
const authController = require("./../controllers/authController");
const walletController = require("./../controllers/walletController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.route("/duplicateFields").get(userController.duplicateFields);

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);

router.post("/forgotPassword", authController.forgotPassword);

router.get(
  "/verifiedPasswordToken/:token",
  authController.verifiedPasswordToken
);
// router.patch("/claimToken", userController.payandSendToken); ///////////////////
router.patch("/resetPassword/:token", authController.resetPassword);

router.get("/verifyEmailToken/:token", authController.verifyEmailToken);
router.get("/userNftProfile/:id", userController.getUserNftProfile);
router.use(authController.protect);
router.patch("/createEmailToken", authController.createEmailToken);

// protect all the routes bellow (user must be logged in to make request to the routes bellow)
// login verify email and create wallet
// router.use(authController.verifiedEmailAcc);
// router.use(walletController.checkAndCreateWallet);
router.use(authController.verifiedEmailAcc);
router.patch("/chaingeMyPassword", authController.updateUserPassword);

router
  .route("/myDetails")
  .get(userController.getMyDetails)
  .patch(
    photoUtils.uploadOnePhoto("users", "photo"),
    userController.updateMyDetails
  );

// router.route("/nftProfile/:id").get(userController.getUserNftProfile);

router
  .route("/")
  .get(authController.restrictTo("admin", "staff"), userController.getAllUsers);

router
  .route("/staffUser")
  .get(authController.restrictTo("staff"), userController.getAllStaffUsers);

router
  .route("/validation/:id")
  .patch(
    authController.restrictTo("admin", "staff"),
    userController.sendValidationEmail
  );

router
  .route("/validateUserEmail/:id")
  .post(
    authController.restrictTo("admin", "staff"),
    authController.adminVerifyUserEmail
  );

router
  .route("/:id")
  .get(
    authController.restrictTo("admin", "staff"),
    userController.getUserDetails
  )
  .patch(
    authController.restrictTo("admin", "staff"),
    photoUtils.uploadOnePhoto("users", "photo"),
    userController.addPhotoName,
    userController.getStaffId,
    userController.updateUser
  )
  .delete(authController.restrictTo("admin"), userController.deleteUser);

// photoUtils.addSingleImageNameToBody,
module.exports = router;

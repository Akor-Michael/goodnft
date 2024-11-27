const express = require("express");
const photoUtils = require("../utils/photoUtils");
const authController = require("./../controllers/authController");
const messageController = require("./../controllers/messageController");
const userController = require("./../controllers/userController");

const router = express.Router();
router.use(authController.protect);
router.use(authController.verifiedEmailAcc);
router
  .route("/messages")
  .get(messageController.getMyMessagess)
  .post(
    photoUtils.uploadOnePhoto("users", "photo"),
    messageController.createUserMessage
  );

router
  .route("/messages/:id")
  .get(authController.restrictTo("admin"), messageController.getAnyMessagess);
// router.route("/messageByUser").post(messageController.createUserMessage);

router
  .route("/messageByAdmin/:id")
  .post(
    authController.restrictTo("admin", "staff"),
    photoUtils.uploadOnePhoto("users", "photo"),
    messageController.createAdminMessage
  );

router
  .route("/")
  .get(authController.restrictTo("admin"), messageController.getAllMessagess);

module.exports = router;

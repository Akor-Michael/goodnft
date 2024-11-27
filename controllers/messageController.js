const handlerFactory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const AppError = require("../utils/appError");
const Message = require("./../models/messageModel");
const io = require("./../socket");

exports.getAllMessagess = handlerFactory.getAll(Message);

exports.getMyMessagess = catchAsync(async (req, res, next) => {
  const messagess = await Message.find({ messageId: req.user.id });
  res.status(200).json({
    status: success,
    data: messagess,
  });
});
exports.getAnyMessagess = catchAsync(async (req, res, next) => {
  const messagess = await Message.find({ messageId: req.params.id });
  res.status(200).json({
    status: success,
    data: messagess,
  });
});

exports.createUserMessage = catchAsync(async (req, res, next) => {
  req.body.messageId = req.user.id;
  if (req.file) req.body.photo = `/img/users/${req.file.filename}`;
  const newMessage = await Message.create(req.body);
  if (!newMessage) {
    return next(new AppError("could not send message", 401));
  }
  io.getIO().emit("message", {
    messageId: newMessage.messageId,
    sender: "me",
    data: newMessage,
  });
  res.status(200).json({
    status: "success",
    data: "message has been sent",
  });
});

exports.createAdminMessage = catchAsync(async (req, res, next) => {
  req.body.role = "admin";
  req.body.messageId = req.params.id;
  if (req.file) req.body.photo = `/img/users/${req.file.filename}`;
  const newMessage = await Message.create(req.body);
  if (!newMessage) {
    return next(new AppError("could not send message", 401));
  }
  io.getIO().emit("message", {
    messageId: newMessage.messageId,
    sender: "admin",
    data: newMessage,
  });
  res.status(200).json({
    status: "success",
    data: "message has been sent",
  });
});

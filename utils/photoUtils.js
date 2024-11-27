const multer = require("multer");
const AppError = require("./appError");

const multerStorage = (imgPath) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/img/${imgPath}`);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
  });

const multerStorageExhibition = (imgPath) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/img/${imgPath}`);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `exhibition-${req.user.id}-${Date.now()}.${ext}`);
    },
  });

const multerStorageNft = (imgPath) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/img/${imgPath}`);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `Nft-${req.user.id}-${Date.now()}.${ext}`);
    },
  });

// const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = (imgPath) =>
  multer({
    storage: multerStorage(imgPath),
    fileFilter: multerFilter,
  });
const uploadExhibition = (imgPath) =>
  multer({
    storage: multerStorageExhibition(imgPath),
    fileFilter: multerFilter,
  });

const uploadNft = (imgPath) =>
  multer({
    storage: multerStorageNft(imgPath),
    fileFilter: multerFilter,
  });

exports.uploadOnePhoto = (imgPath, name) => upload(imgPath).single(name);
exports.uploadOneNft = (imgPath, name) => uploadNft(imgPath).single(name);
exports.uploadOneExhibition = (imgPath, name) =>
  uploadExhibition(imgPath).single(name);

exports.addSingleImageNameToBody = (req, res, next) => {
  if (req.file)
    req.body[`${req.file.fieldname}`] = `/${req.file.path
      .split("\\")
      .splice(1)
      .join("/")}`;
  // console.log(`the name of the file is ${req.body[`${req.file.fieldname}`]}`);
  next();
};

exports.confirmSentImage = (req, res, next) => {
  // console.log(req.file);
  if (!req.file) {
    return next(new AppError("An image is required to create an NFT", 401));
  }
  next();
};

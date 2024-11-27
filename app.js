const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const nftRouter = require("./routes/nftRoutes");
const exhibitionRouter = require("./routes/exhibitionRoutes");
const transactionRouter = require("./routes/transactionRoutes");
const nftTransactionRouter = require("./routes/nftTransactionRoutes");
const userRouter = require("./routes/userRoutes");
const walletRouter = require("./routes/walletRoutes");
// const messageRouter = require("./routes/messageRoutes");

///////////////////////////////
// const reviewRouter = require("./routes/reviewRoutes");
// const ratingsRouter = require("./routes/ratingsRoutes");
// const extraDataRouter = require("./routes/extraDataRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.enable("trust proxy");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// Set security HTTP headers

// Enable CORS with specified options
app.use(cors());
app.options("*", cors());

/////////////////////////////
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("using morgan");
}

// Limit number of requests from one IP
const limiter = rateLimit({
  max: 60,
  windowMs: 60 * 60 * 1000,
  message: "too many request from this IP, please try again in an hour!",
});
// app.use("/api", limiter);

app.use(bodyParser.urlencoded({ extended: true }));

// Body perser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

// cookie perser
app.use(cookieParser());

// Data sanitization ajainst NoSQL quary injection
app.use(mongoSanitize());

// Data sanitization from xss
app.use(xss());

// Prevent paramiter pollution
app.use(hpp());

// app.use(
//   hpp({
//     whitelist: [
//       "duration",
//       "ratingsQuantity",
//       "ratingsAverage",
//       "maxGroupSize",
//       "difficulty",
//       "price",
//     ],
//   })
// );

app.use(compression());

// Serving static files
// app.use("/images", express.static("public"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).render("soldNftEmail", {
    title: "All Tours",
    tours: "tour",
  });
});

app.use("/api/v1/nft", nftRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/wallets", walletRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/exhibition", exhibitionRouter);
app.use("/api/v1/nftTransaction", nftTransactionRouter);

// nftTransactionRouter
// app.use("/api/v1/chat", messageRouter);

////////////////////////////////////
// sendFastEmails();

////////////////////

// handle all unspecified routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Use global error handling midleware
app.use(globalErrorHandler);

// Export app from this file
module.exports = app;

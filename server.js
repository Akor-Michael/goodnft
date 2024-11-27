const QRCode = require("qrcode");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Email = require("./utils/email");
const User = require("./models/userModel");
const Nft = require("./models/nftModel");
const Wallet = require("./models/walletModel");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: ".env" });
const app = require("./app");
// const Email = require("./utils/email");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
// console.log("yes", process.env.DATABASE, DB);
let server;
// const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB).then(() => {
  console.log("DB connection successful!");
  const port = 5000;
  server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
  const io = require("./socket").init(server);
  io.on("connection", (socket) => {
    // console.log("Client connected");
  });
  // sendMail();

  // updateBallance();
});

// const fetchData = async () => {
//   // const xpub =
//   //   "xpub6Dzzs7dmSVLMfPySwtJFDWx9Aj4JPeXJwnRbkuYb8jECVQMQZfvpjcTZUtwfkGvmvpJVM7dD5UDgNN3FaEEhNQTK7TzEvYmiBDB3qD9DTyo";

//   try {
//     const fetch = await import("node-fetch");
//     const response = await fetch.default(`https://artcity.tech/api/v1/nft`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": `t-666d78b4b1a8eb001c109985-b476d5ef52e84c3abac9bdbd`,
//         // "x-api-key": `t-64e5cd496dfb46001c478084-64e5cd4b6dfb46001c47808a`,
//       },
//       //   body: JSON.stringify({
//       //     //   currency: "ETH",
//       //     //   xpub: "xpub6ESKdMQgH18wcSWHGrkCwac6rJtzxX5kqJRq1WH25AgcQ7RvdRt2iN74zJ3BLtd1AX5SCsuaEkF4PnpoQ7eZycwfqbUm2qFTPmPFYAEcq9u",
//       //   }),
//     });
//     // if (!response.ok) {
//     //   // console.log(response);
//     //   throw new Error(`HTTP error! status: ${response.status}`);
//     // }
//     const nftData = await response.json();
//     // Do something with the returned data
//     console.log("the data : ");
//     const data = [];
//     const newData = nftData.data.forEach((ele) => {
//       if (ele.nftInMarket) {
//         const nft = {
//           name: ele.name,
//           category: ele.category,
//           priceInEtherium: ele.priceInEtherium,
//           nftOwner: "667664c092f7de0f69ea0b88",
//           description: ele.description,
//           photo: ele.photo,
//           nftInMarket: ele.nftInMarket,
//         };
//         data.push(nft);
//       }
//     });

//     console.log("the new data : ");

//     const updated = await Nft.insertMany(data);
//   } catch (error) {
//     console.error(error);
//   }
// };

// fetchData();

// const testEmail = async () => {
//   const user = {
//     username: "req.body.username",
//     email: "izunduaugustine2018@gmail.com",
//     password: "req.body.password",
//   };

//   const resetToken = "24323456543";
//   const domainName = "artcity.site";
//   // 3) Send token to user's email
//   try {
//     const resetURL = `https://${domainName}/api/v1/users/verifyEmailToken/${resetToken}`;
//     const logoUrl = `///img/artmintLogo.png`;

//     // send email to user
//     const mail = await new Email(user, resetURL, logoUrl).verifyEmail();
//     console.log("email has been sent");
//   } catch (err) {
//     // user.emailVerificationToken = undefined;
//     // user.emailVerificationTokenExpires = undefined;
//     // await user.save({ validateBeforeSave: false });
//     console.log(err);
//   }
// };
// testEmail();
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...", err);
  console.log(err.name, err.message, err);
  server.close(() => {
    process.exit(1);
  });
});

// console.log(yes);

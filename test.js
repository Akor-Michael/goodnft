// const QRCode = require("qrcode");

// async function generateQRCode(address) {
//   const url = `${address}`;

//   try {
//     const qrCodeData = await QRCode.toDataURL(url);
//     return qrCodeData;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// const qrCode = async function (address) {
//   const walletUrl = await generateQRCode(address);
//   console.log(walletUrl);
// };
// qrCode("0x6fa55117896a998c7c4decbc772e5fe8fadd80f4");

// const duplicateFieldCheck = (email,username,message)=>{
//   const currentEmail=email;
//   const currentUsername=username;
//   const errorMessage=message;
//   if(message.includes(currentEmail))return {field:"email",value:currentEmail};
//   if(message.includes(currentUsername))return {field:"username",value:currentEmail};
// }

// console.log(duplicateFieldCheck("yes","antelope","this bos says \"antelope\" always"))

/////////////////////////////////////////////
// const axios = require("axios"); // Ensure you've installed the 'axios' package

// const BEARER_TOKEN =
//   "AAAAAAAAAAAAAAAAAAAAAM3aqAEAAAAAlg74%2FmPx41tG5etg0V96j0qUiss%3DzU9L3cUIOz0vHlZWJ7HjdRctKFtLVs4YoPSb2MW3GFA3zrk4yi";

// async function getTweet() {
//   const headers = {
//     Authorization: `Bearer ${BEARER_TOKEN}`,
//     "Content-Type": "application/json",
//   };

//   try {
//     const response = await axios.get(
//       "https://api.twitter.com/2/tweets/1523004843321102337",
//       { headers }
//     );
//     console.log(response.data);
//   } catch (error) {
//     console.error("Error fetching the tweet:", error);
//   }
// }

// getTweet();
//////////////////
// const Twit = require("twit");

// const T = new Twit({
//   consumer_key: "CLIENT_ID", // Replace with your Client ID
//   consumer_secret: "CLIENT_SECRET", // Replace with your Client Secret
//   access_token: "ACCESS_TOKEN", // Replace with your Access Token
//   access_token_secret: "ACCESS_TOKEN_SECRET", // Replace with your Access Token Secret
// });

// T.get(
//   "statuses/show/:id",
//   { id: "1347555316863553542" },
//   function (err, data, response) {
//     if (err) {
//       console.error("Error fetching the tweet:", err);
//     } else {
//       console.log(data);
//     }
//   }
// );
/////////////////////////////////////////////
// const axios = require("axios");

// const options = {
//   method: "GET",
//   url: "https://twitter154.p.rapidapi.com/user/following",
//   params: {
//     user_id: "96479162",
//     limit: "40",
//   },
//   headers: {
//     "X-RapidAPI-Key": "2afb64a9e0mshf1eb6e000fd0353p13993bjsncbeea098fc0b",
//     "X-RapidAPI-Host": "twitter154.p.rapidapi.com",
//   },
// };
// const fetch = async () => {
//   try {
//     const response = await axios.request(options);
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };
// // fetch();
// console.log(Date.now());
// const a = Date.now();
// for (let i = 0; i < 200; i++) {
//   console.log("yes");
// }
// // setTimeout(console.log(Date.now() - a), 3000);
// console.log(
//   "check",
//   (Date.now() - new Date("2023-10-07T07:38:07.904+00:00").getTime()) / 60000
// );

///////////////////////////////////////
// const me = [1, 2, 3, 4, 5, 6, 7];
// me.map((ele) => 1);
// console.log(me);
////////////////////////////////////////

// Adp3dartist//////////
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATsSURBVO3BQW4cSRAEwfDC/P/LvjzmqYBGJylKG2b4JVVLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkWfvATkJ6n5k4DcqLkBMqm5AfKT1LxxUrXopGrRSdWiT5ap2QTkCSCTmk1qboBMaiY1E5BJzY2aTUA2nVQtOqladFK16JNvBuQJNU8AmdS8AWRSMwGZ1ExqboBMat4A8oSa73RSteikatFJ1aJP/jFAbtRMQCY1E5BJzQ2QGzUTkEnN3+ykatFJ1aKTqkWf/M+pmYDcAJnUTGpugExq/iUnVYtOqhadVC365Jup+ZPUTEBu1DwB5Ak1E5BJzRNqfpOTqkUnVYtOqhZ9sgzIn6RmAjKpmYDcAJnU3KiZgGwC8pudVC06qVp0UrXok5fU/CZAJjVPALkB8gaQJ9T8TU6qFp1ULTqpWvTJS0AmNROQTWomNROQGyCTmieATGomIJOaGyA3QDap+U4nVYtOqhadVC365CU1E5BJzQTkCTUTkBs1E5BJzQTkRs0TaiYgN2qeUDMBmdRMQG6ATGreOKladFK16KRqEX7JC0AmNU8A2aTmBsik5gbIpGYCcqPmCSCTmgnIpOYJIJOaTSdVi06qFp1ULcIvWQRkUvMEkEnNDZBJzQ2QTWpugNyoeQPIjZoJyKRm00nVopOqRSdViz55Ccik5gkgk5oJyBNA3lBzA+QGyI2aGyCTmgnIpOYGyE86qVp0UrXopGrRJ98MyBtqboDcqJmAvKHmCTUTkBs1E5BJzQRkUjOpuQEyqXnjpGrRSdWik6pF+CUvAJnU3AB5Q80mIJOaCciNmhsgk5o3gGxSs+mkatFJ1aKTqkWf/GFqngDyhJongExqJiBPqJmAPKHmCTU3QL7TSdWik6pFJ1WLPvlhap4AMqmZgExqJiCTmhs1E5AbIE+ouQFyo+YGyBNAJjVvnFQtOqladFK16JNlQCY1E5BJzQRkUnOjZgLyhJobNROQSc0TQG7UTECeUDMBmdRMQDadVC06qVp0UrUIv+QFIJOaCcikZgLym6h5A8iNmgnIjZoJyKTmNzmpWnRSteikatEnPwzIpGYCMqmZgExqJiA3am6ATGpugExq3lAzAZnUTEBu1ExAJjWbTqoWnVQtOqla9MkvB2RSc6NmAvKEmgnIE0AmNU8AuQFyo2YC8pNOqhadVC06qVr0yUtqbtQ8oeYJIJOaJ4DcqJmATGpugExqbtQ8AWQCMqm5ATKpeeOkatFJ1aKTqkWfvATkJ6mZ1ExAJjUTkBs1E5BJzQRkUjOpmYA8AWRSc6PmBsikZtNJ1aKTqkUnVYs+WaZmE5AbIJOaTWreAPKGmr/JSdWik6pFJ1WLPvlmQJ5Q85PUvKHmCTUTkAnIG0Bu1ExAJjVvnFQtOqladFK16JP/GTUTkEnNJjUTkBs1bwCZ1Nyo2XRSteikatFJ1aJP/jFAbtQ8AeQJNROQGzUTkE1AbtRsOqladFK16KRq0SffTM13UvOGmifUbAJyo2YCcqPmBsh3OqladFK16KRq0SfLgPwkIDdqJiCTmgnIE0AmNTdqboBMQJ4AcqPmO51ULTqpWnRStQi/pGrJSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteg/We9TMSqIasgAAAAASUVORK5CYII=

// 0x08c8d75ce3143b7efb7372f93d815602ab06ca03

// // izundu///////////
// 0xd3d8c200a61cac70c8f784c102713cab2778aac8
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATgSURBVO3BQY4cSRIEQdNA/f/Lun30vQSQSK8mhzAR/JGqJSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWiT14C8pvU3AB5Qs0EZJOaCcik5gbIb1LzxknVopOqRSdViz5ZpmYTkN+kZgIyqXkCyKRmAjKpuVGzCcimk6pFJ1WLTqoWffJlQJ5Q8wSQSc0NkAnIjZoJyI2aGyCbgDyh5ptOqhadVC06qVr0yT8GyKRmUnMDZAIyqZmATEBu1ExA/iUnVYtOqhadVC36pP6PmhsgN2pugExq/iUnVYtOqhadVC365MvU/EvUvKFmk5q/yUnVopOqRSdViz5ZBuRPUjMBmdRMQCY1E5BJzQRkUjMBmdRMQCY1N0D+ZidVi06qFp1ULcIf+Q8DcqNmArJJzQ2QJ9T8l51ULTqpWnRSteiTl4BMaiYgm9RMam6ATGomIJOaN4BMat4AsknNN51ULTqpWnRSteiTl9TcqJmATGreADKpuQEyqXkCyI2aCcgTam7UTEAmNU8AmdS8cVK16KRq0UnVok9eAjKp2QTkCSA3aiYgk5oJyKTmBsiNmhsgk5obNROQJ9RsOqladFK16KRqEf7IHwRkUnMDZFIzAZnUPAHkCTW/CcgTaiYgk5pNJ1WLTqoWnVQt+uSXAZnU3ACZ1LwB5EbNJiBPqHlCzQ2QSc03nVQtOqladFK16JOXgExqJiCTmgnIjZpvUvMEkEnNjZoJyKRmAnKjZgJyo2YCcqPmjZOqRSdVi06qFuGPvADkRs0TQJ5QMwGZ1NwAmdRMQCY1E5BJzQRkUjMBuVEzAblR8yedVC06qVp0UrXok5fU3ACZ1ExAJjVvqJmA3KiZgNwAeQPIpOYGyKRmAvIEkEnNppOqRSdVi06qFuGPLAIyqXkCyI2aCcik5gkgk5obIJOaGyCTmm8C8oaaN06qFp1ULTqpWvTJS0BugExqJiA3am7UTEAmNROQGyCTmieATGomIN+kZgIyqZmAbDqpWnRSteikatEny9RMQG7U3AC5UTOpmYDcqLkBMqmZgExqJiCTmhsgk5obIDdqbtRsOqladFK16KRq0SdfpuYGyI2aJ4DcqJmA3KiZgHyTmjeATGomIJOaTSdVi06qFp1ULfrky4DcqLkBcqPmRs0E5Akgk5obIJOaGyCb1ExAftNJ1aKTqkUnVYvwR/7DgNyo2QRkUnMD5Ak1TwCZ1DwBZFLzxknVopOqRSdViz55CchvUjOpmYDcALlRc6NmAnKjZgLyBJBJzQ2QJ9RsOqladFK16KRq0SfL1GwCcgPkBsik5g0gTwCZ1ExAbtQ8oeZPOqladFK16KRq0SdfBuQJNd8EZFLzhJobIG8AeQPIG2reOKladFK16KRq0Sf/ODUTkAnIjZon1NwAuVFzA2RS8zc5qVp0UrXopGrRJ/8YNTdqJiA3QG7UTECeUDMBuVEzAZnUTEBu1Gw6qVp0UrXopGrRJ1+m5pvUTECeUHMD5Ak1E5AbIDdq3lAzAfmmk6pFJ1WLTqoWfbIMyG8CsgnIE0AmNZOaN4BMam6A3Kj5ppOqRSdVi06qFuGPVC05qVp0UrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFv0P3cRCP0ssweoAAAAASUVORK5CYII=
// Your private key in the provided format
// const privateKeyBytes = [
//   217, 121, 93, 15, 27, 88, 43, 164, 191, 111, 94, 142, 122, 117, 26, 215, 152,
//   240, 213, 120, 245, 148, 253, 122, 199, 9, 0, 177, 219, 168, 81, 112, 196,
//   213, 243, 252, 200, 88, 172, 212, 28, 137, 19, 129, 145, 48, 243, 206, 149,
//   201, 165, 144, 17, 184, 200, 131, 37, 141, 248, 20, 227, 83, 62, 180,
// ];

// Convert the array of bytes to a Buffer
// const privateKeyBuffer = Buffer.from(privateKeyBytes);

// // Convert the Buffer to a hexadecimal string
// const privateKeyHex = privateKeyBuffer.toString("hex");

// // Output the result
// console.log(privateKeyHex);

///////////////////////////
// console.log(new Date("2024-06-21T09:06:27.067Z").getTime());

// async function fetchData() {
//   // const API_KEY = "8f77ec2e-d0ed-4c04-bf7e-1ee899b16abc";
//   const API_KEY = "t-666d78b4b1a8eb001c109985-b476d5ef52e84c3abac9bdbd";

//   // t-666d78b4b1a8eb001c109985-b476d5ef52e84c3abac9bdbd
//   const url = "https://api.tatum.io/v3/ethereum/wallet";
//   const method = "GET";

//   try {
//     const fetch = await import("node-fetch");
//     const response = await fetch.default(url, {
//       method: method,
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//       },
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     // Do something with the returned data
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// fetchData();
// {
//     xpub: 'xpub6ESKdMQgH18wcSWHGrkCwac6rJtzxX5kqJRq1WH25AgcQ7RvdRt2iN74zJ3BLtd1AX5SCsuaEkF4PnpoQ7eZycwfqbUm2qFTPmPFYAEcq9u',
//     mnemonic: 'volcano abuse hint book mean special yard claim owner space quick slender fish genre square this dash lend mimic canvas wide evolve young journey'
//   }

// async function fetchData() {
//   const xpub =
//     "xpub6EJwsVpDSMEr2uJb97U2Hn5NHVL1xEbARBDb12aC4aeFDiJqKU1AvL5615mLHtu3k3XQMWegoPtyLxsfUr8JXTyjZo9EwTQpDs7i49SpDNf";

//   try {
//     const fetch = await import("node-fetch");
//     const response = await fetch.default(
//       `https://api.tatum.io/v3/ledger/account`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": `t-666d78b4b1a8eb001c109985-b476d5ef52e84c3abac9bdbd`,
//           // "x-api-key": `t-64e5cd496dfb46001c478084-64e5cd4b6dfb46001c47808a`,
//         },
//         body: JSON.stringify({
//           currency: "ETH",
//           xpub: "xpub6EJwsVpDSMEr2uJb97U2Hn5NHVL1xEbARBDb12aC4aeFDiJqKU1AvL5615mLHtu3k3XQMWegoPtyLxsfUr8JXTyjZo9EwTQpDs7i49SpDNf",
//         }),
//       }
//     );
//     // if (!response.ok) {
//     //   // console.log(response);
//     //   throw new Error(`HTTP error! status: ${response.status}`);
//     // }
//     const data = await response.json();
//     // Do something with the returned data
//     console.log("the data : ", data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// fetchData(); ///////////////////
// the data :  {
//   currency: 'ETH',
//   active: true,
//   balance: { accountBalance: '0', availableBalance: '0' },
//   frozen: false,
//   xpub: 'xpub6EJwsVpDSMEr2uJb97U2Hn5NHVL1xEbARBDb12aC4aeFDiJqKU1AvL5615mLHtu3k3XQMWegoPtyLxsfUr8JXTyjZo9EwTQpDs7i49SpDNf',
//   accountingCurrency: 'EUR',
//   id: '673b5e284a89b5af9662e93a'
// }

// the data :  {
//     currency: 'ETH',
//     active: true,
//     balance: { accountBalance: '0', availableBalance: '0' },
//     frozen: false,
//     xpub: 'xpub6ESKdMQgH18wcSWHGrkCwac6rJtzxX5kqJRq1WH25AgcQ7RvdRt2iN74zJ3BLtd1AX5SCsuaEkF4PnpoQ7eZycwfqbUm2qFTPmPFYAEcq9u',
//     accountingCurrency: 'EUR',
//     id: '6674106e3501c38271649cd0'
//   }
async function fetchData() {
  try {
    const fetch = await import("node-fetch");
    const response = await fetch.default(
      // replace the id with that of the real ETH id
      `https://api.tatum.io/v3/offchain/account/673b5e284a89b5af9662e93a/address`,
      {
        method: "POST",
        headers: {
          "x-api-key": `t-666d78b4b1a8eb001c109985-b476d5ef52e84c3abac9bdbd`,
        },
      }
    );
    if (!response.ok) {
      console.log("unable to create address");
    }
    const data = await response.json();
    console.log("data", data);
  } catch (err) {
    console.log("err", err);
  }
}

fetchData();
// const getAllWalletsUsingBot = async () => {
//   wallets = [];
//   // console.log("getting wallets");
//   let response;
//   //   try {
//   response = await axios.get(
//     `https://artcity.site/api/v1/wallets/getAllWalletUsingBot?useBot=true&fields=realBalance,address`,
//     {
//       headers: {
//         authorization: `Bearer 2163487ftyafdjasgyg8`,
//       },
//     }
//   );
//   //   } catch (err) {
//   //     ////////////////
//   //   }
//   if (response.length <= 0) return;
//   // .then(function (response) {
//   // console.log(response.data);
//   wallets = response.data.data.map((ele) => {
//     const ans = {};
//     ans.address = ele.address;
//     ans.realBalance = ele.realBalance;
//     return ans;
//   });
//   console.log(wallets);
// };

// getAllWalletsUsingBot();

// console.log(new Date("2024-06-20T09:40:04.796+00:00"));/////////////////////

//////////////bot fetch wallets ///////////////////
// if the date now is less than the date when it would expire then chech the wallet

// https://artcity.site/api/v1/wallets/getAllWalletUsingBot?useBot=true&walletIsMonotored[gt]=2023-06-20T09:40:04.796Z&walletIsMonotored[lt]=2024-07-20T09:40:04.796Z&fields=realBalance,address,walletIsMonotored
///////////////////////////////////////////////////

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
//     console.log("the new data : ", data);
//   } catch (error) {
//     console.error(error);
//   }
// };

// fetchData();
// 0705f43bd90648a9987371a7f2d32926
// const { ethers } = require("ethers");

// // Connect to an Ethereum node (Infura in this example)
// const infuraProvider = new ethers.providers.InfuraProvider(
//   "mainnet",
//   "0705f43bd90648a9987371a7f2d32926"
// );

// // Your seed phrase
// const seedPhrase =
//   "ask rebuild fit wedding happy jump husband lazy earn hip thing interest";

// // Generate a wallet from the seed phrase
// const wallet = ethers.Wallet.fromMnemonic(seedPhrase);

// // Connect the wallet to the provider
// const connectedWallet = wallet.connect(infuraProvider);

// // Function to get the balance
// async function getBalance() {
//   try {
//     const balance = await connectedWallet.getBalance();
//     const balanceInEth = ethers.utils.formatEther(balance);
//     console.log(`Address: ${connectedWallet.address}`);
//     console.log(`Balance: ${balanceInEth} ETH`);
//   } catch (error) {
//     console.error("Error fetching balance:", error);
//   }
// }

// // Call the function
// getBalance();

// const axios = require("axios");
// const ethers = require("ethers");

// // Infura project ID
// const infuraProjectId = "0705f43bd90648a9987371a7f2d32926";
// const infuraUrl = `https://mainnet.infura.io/v3/${infuraProjectId}`;

// // Your seed phrase
// const seedPhrase =
//   "ask rebuild fit wedding happy jump husband lazy earn hip thing interest";

// // Generate a wallet from the seed phrase
// const wallet = ethers.Wallet.fromMnemonic(seedPhrase);

// // Get the wallet address
// const address = wallet.address;

// // Function to get the balance using Infura's API
// async function getBalance() {
//   try {
//     const data = {
//       jsonrpc: "2.0",
//       method: "eth_getBalance",
//       params: [address, "latest"],
//       id: 1,
//     };

//     const response = await axios.post(infuraUrl, data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const balanceWei = response.data.result;
//     const balanceEth = ethers.utils.formatEther(balanceWei);

//     console.log(`Address: ${address}`);
//     console.log(`Balance: ${balanceEth} ETH`);
//   } catch (error) {
//     console.error("Error fetching balance:", error);
//   }
// }

// // Call the function
// getBalance();

// const axios = require("axios");
// const { ethers } = require("ethers");

// // Infura project ID
const infuraProjectId = "0705f43bd90648a9987371a7f2d32926";
const infuraUrl = `https://https://mainnet.infura.io.infura.io/v3/${infuraProjectId}`;

// Your seed phrase
const seedPhrase =
  "ask rebuild fit wedding happy jump husband lazy earn hip thing interest";

// // Generate a wallet from the seed phrase
// const hdNode = ethers.utils.HDNode.fromMnemonic(seedPhrase);
// const wallet = new ethers.Wallet(hdNode.privateKey);

// // Get the wallet address
// const address = wallet.address;

// // Function to get the balance using Infura's API
// async function getBalance() {
//   try {
//     const data = {
//       jsonrpc: "2.0",
//       method: "eth_getBalance",
//       params: [address, "latest"],
//       id: 1,
//     };

//     const response = await axios.post(infuraUrl, data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const balanceWei = response.data.result;
//     const balanceEth = ethers.utils.formatEther(balanceWei);

//     console.log(`Address: ${address}`);
//     console.log(`Balance: ${balanceEth} ETH`);
//   } catch (error) {
//     console.error("Error fetching balance:", error);
//   }
// }

// // Call the function
// getBalance();

// const axios = require("axios");
// const { ethers } = require("ethers");

// Infura project ID
// const infuraProjectId = "YOUR_INFURA_PROJECT_ID";
// const infuraUrl = `https://mainnet.infura.io/v3/${infuraProjectId}`;

// // Your seed phrase
// const seedPhrase = "your seed phrase here";

// Generate a wallet from the seed phrase
// const wallet = ethers.Wallet.fromMnemonic(seedPhrase);

// // Get the wallet address
// const address = wallet.address;

// Function to get the balance using Infura's API
// async function getBalance() {
//   try {
//     const data = {
//       jsonrpc: "2.0",
//       method: "eth_getBalance",
//       params: [address, "latest"],
//       id: 1,
//     };

//     const response = await axios.post(infuraUrl, data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const balanceWei = response.data.result;
//     const balanceEth = ethers.utils.formatEther(balanceWei);

//     console.log(`Address: ${address}`);
//     console.log(`Balance: ${balanceEth} ETH`);
//   } catch (error) {
//     console.error("Error fetching balance:", error);
//   }
// }

// // Call the function
// // getBalance();

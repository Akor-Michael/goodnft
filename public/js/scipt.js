const email = document.querySelector("#email-input");
const password = document.querySelector("#password-input");
const content = document.querySelector(".content");
const notAllowed = document.querySelector(".not-allowed");

let currentUserId;
let currentUserWalletId;

const allUsers = document.querySelector(".users");
const spinner = document.querySelector(".spinner");
const smallSpinner = document.querySelector(".small-spinner");
const loadingSpinner = document.querySelector("#loading-spinner");

const socket = io("http://31.220.31.111:3000");
socket.on("connect", () => {
  // console.log("connected now");
});

//////////////////////

function stopSinner() {
  spinner.style.display = "none";
  smallSpinner.style.display = "none";
  loadingSpinner.style.display = "none";
}

function startSinner() {
  spinner.style.display = "block";
  smallSpinner.style.display = "block";
  loadingSpinner.style.display = "block";
}

spinner.addEventListener("click", (e) => {
  e.stopPropagation();
  stopSinner();
});
smallSpinner.addEventListener("click", (e) => {
  e.stopPropagation();
});
const users = {};
// const content=document.querySelector(".")
let jwt;

function getUsers() {
  startSinner();
  axios
    .get("http://31.220.31.111:3000/api/v1/users", {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
    .then(function (response) {
      stopSinner();
      // console.log(response.data); // Handle the response data
      displayUsers(response.data);
      const AllUserId = document.querySelectorAll(".users-row");
      AllUserId.forEach((oneUser) => {
        oneUser.addEventListener("click", function () {
          const userID = this.getAttribute("data-user-id");
          // console.log("user id", userID);
          getAndDisplayUserDetails(userID);
          if (window.innerWidth < 785) {
            document.querySelector(".user-details").classList.remove("none");
            document.querySelector(".users").classList.add("none");
          }
        });
      });
    })
    .catch(function (error) {
      stopSinner();
      // console.log(error);
    });
}

function login() {
  const emailData = email.value;
  const passwordData = password.value;
  // console.log(emailData, passwordData);
  axios
    .post("http://31.220.31.111:3000/api/v1/users/login", {
      email: emailData,
      password: passwordData,
    })
    .then(function (response) {
      // console.log(response.data);
      content.classList.remove("none");
      notAllowed.classList.add("none");
      jwt = response.data.token;
      // console.log("jwt", jwt);
      if (window.innerWidth < 782) {
        document.querySelector(".user-details").classList.add("none");
      }
      getUsers();
    })
    .catch(function (error) {
      // console.log(error);
    });
}

const log = document.querySelector(".login-btn");
log.addEventListener("click", login);
const load = document.querySelector(".admin-text");
load.addEventListener("click", function () {
  if (!jwt) return;
  if (window.innerWidth < 785) {
    document.querySelector(".user-details").classList.add("none");
    document.querySelector(".users").classList.remove("none");
  }
  getUsers();
});

function displayUsers(dataObject) {
  const dataRecieved = dataObject.data;
  // users = dataRecieved;
  // console.log("dataRecieved", dataRecieved[1]);
  allUsers.innerHTML = "";
  // photo = "http://127.0.0.1:3000/img/users/defaultUserPhoto.png";
  dataRecieved.forEach((ele) => {
    users[`${ele.username}`] = ele.id;
    // console.log("ele", ele, users);
    const html = `<div class="users-row" data-user-id="${ele.id}">
<div class="row-profile">
  <img class="user-photo" crossorigin="anonymous" src="http://31.220.31.111:3000/img/users/${
    ele.photo
  }" alt="user image">
  <span class="username">${ele.username}</span>
</div>
<div class="${
      ele.wallet && ele.wallet.useBot === true ? "use_bot" : "lack_bot"
    }"></div>
<div class="message">
  <span><ion-icon class="bell ${
    ele.pendingChart >= 1 ? "" : "light-color"
  }" name="notifications-outline"></ion-icon>
  </span><span class="pending-message ${
    ele.pendingChart >= 1 ? "" : "light-color"
  }">${ele.pendingChart}</span></div>
  <div class="row_money">
    <div class="money-div">
      <span>ETH :</span><span class="money-amount money-eth">${
        ele.wallet ? ele.wallet.eth.toFixed(3) : (0).toFixed(3)
      }</span>
    </div>
    <div class="money-div">
      <span>WETH :</span><span class="money-amount money-weth">${
        ele.wallet ? ele.wallet.weth.toFixed(3) : (0).toFixed(3)
      }</span>
    </div>
    <div class="money-div">
      <span>TOTAL :</span><span class="money-amount money-bal">${
        ele.wallet ? ele.wallet.accountBallance.toFixed(3) : (0).toFixed(3)
      }</span>
    </div>
  <div class="money-div">
    <span>REAL :</span><span class="money-amount money-real-bal">${
      ele.wallet ? ele.wallet.realBalance.toFixed(3) : (0).toFixed(3)
    }</span>
  </div>
</div>
</div>`;
    allUsers.insertAdjacentHTML("beforeend", html);
    // element.insertAdjacentHTML('beforeend', htmlContent);
  });
}

//////////////////////////////////
async function getAndDisplayUserDetails(userID) {
  startSinner();
  axios
    .get(`http://31.220.31.111:3000/api/v1/users/${userID}`, {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
    .then(function (response) {
      stopSinner();
      // console.log("responce ", response);
      displayCurrentUserDetails(response.data.data); // Handle the response data
    })
    .catch(function (error) {
      stopSinner();
      // console.log(error);
    });
}

function displayCurrentUserDetails(userData) {
  currentUserId = userData.id;
  currentUserWalletId = userData.wallet ? userData.wallet.id : 12345;
  let nftTransaction = "";
  userData.myNftTransaction.forEach((ele) => {
    if (!ele) return;
    nftTransaction =
      nftTransaction +
      `<div class="real-transaction">
      <span class="name">${ele.nft.name}</span>
      <span class="from">${ele.From.username}</span>
      <span class="to">${ele.to.username}</span>
      <span class="amount">${ele.amount}</span>
      <span class="date">${ele.date}</span>
      <span class="status">${ele.status}</span>
    </div>`;
  });

  let userTransaction = "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  if (userData.wallet) {
    userData.wallet.transactions.forEach((ele) => {
      userTransaction =
        userTransaction +
        `<div class="real-transaction">
      <span class="transaction">${ele.transaction}</span>
      <span class="amount">${ele.amount}</span>
      <span class="date">${ele.date}</span>
      <span class="status">${ele.status}</span>
      <span class="success-btn ststus-update-btn" transaction-id="${ele.id}">
        completed
      </span>
      <span class="pending-btn ststus-update-btn" transaction-id="${ele.id}">pending</span>
      <span class="failed-btn ststus-update-btn" transaction-id="${ele.id}">failed</span>
      </div>`;
    });
  }

  // <div class="message outgoing">
  //       <div class="message-content">
  //         <img src="path/to/image.jpg" alt="Image">
  //         <span class="message-text">I'm doing well, thanks!</span>
  //         <span class="message-time">9:42 AM</span>
  //       </div>
  //     </div>
  //     <div class="message incoming">
  //       <div class="message-content">
  //         <img src="path/to/image.jpg" alt="Image">
  //         <span class="message-text">I'm doing well, thanks!</span>
  //         <span class="message-time">9:42 AM</span>
  //       </div>
  //     </div>
  let message = "";
  userData.chat.forEach((ele) => {
    message =
      message +
      `<div class="message ${ele.role === "user" ? "incoming" : "outgoing"}">
         <div class="message-content">
          ${
            ele.photo
              ? `<img crossorigin="anonymous" src="http://31.220.31.111:3000${ele.photo}" alt="Image">`
              : ""
          }
           <span class="message-text">${ele.message}</span>
            <span class="message-time">${ele.date}</span>
          </div>
       </div>`;
  });

  let nft = "";
  userData.myNft.forEach((ele) => {
    nft =
      nft +
      `<div class="nft">
  <img class="nft-img" crossorigin="anonymous" src="http://31.220.31.111:3000/${ele.photo}" alt="nft">
  <div class="nft-name">${ele.name}</div>
  <div class="nft-details">
    <span class="nft-price-text">price :</span>
    <div class="nft-price">${ele.priceInEtherium}</div>
  </div>
</div>`;
  });
  const userHtmlDetails = `<div class="details_balance">
  <h2 class="display-username">${userData.username}</h2>
<div class="balence-div">
  <span>ETH :</span><span class="balance-amount balance-eth">${
    userData.wallet ? userData.wallet.eth.toFixed(3) : (0).toFixed(3)
  }</span>
</div>
<div class="balence-div">
  <span>WETH :</span><span class="balance-amount balance-weth">${
    userData.wallet ? userData.wallet.weth.toFixed(3) : (0).toFixed(3)
  }</span>
</div>
<div class="balence-div">
  <span>TOTAL :</span><span class="balance-amount balance-bal">${
    userData.wallet
      ? userData.wallet.accountBallance.toFixed(3)
      : (0).toFixed(3)
  }</span>
</div>
<div class="balence-div">
  <span>REAL :</span
    ><span class="balance-amount balance-real-bal">${
      userData.wallet ? userData.wallet.realBalance.toFixed(3) : (0).toFixed(3)
    }</span>
  </div>
</div>
<div class="chat-box">
${message} 
</div>
<div class="message-input">
<textarea id="message" placeholder="Type your message..."></textarea>
<button id="send-button">Send</button>
</div>
<div class="file-div">
<input class="imageMessage" type="file" accept="image/*">      
</div>
<div class="fee-and-transfer">
<div class="fee-div">
  <div class="mint-div">
    <div class="mint-text">my mint fee :<span class="mint-val">${
      userData.wallet && userData.wallet.myMintFee
    }</span></div>
    <div class="mint-input-div"><input type="number" class="input mint-input"/><button class="button update-mint-Fee" userWalletId="${
      userData.wallet && userData.wallet.id
    }">update</button></div>
  </div>
  <div class="withdraw-div">
    <div class="withdraw-text">my withdrawal fee :<span class="withdraw-val">${
      userData.wallet && userData.wallet.myWithdrawalFee
    }</span></div>
    <div class="withdraw-input-div"><input type="number" class="input withdraw-input"/><button class="button update-withdraw-Fee" userWalletId="${
      userData.wallet && userData.wallet.id
    }">update</button></div>
  </div>
</div>
<div class="fee-div">
  <div class="mint-div">
    <div class="mint-text">general mint fee :<span class="mint-val">${
      userData.wallet && userData.wallet.generalMintFee
    }</span></div>
    <div class="mint-input-div"><input type="number" class="input general-mint-input"/><button class="button update-general-mint-Fee" userWalletId="${
      userData.wallet && userData.wallet.id
    }">update</button></div>
  </div>
  <div class="withdraw-div">
    <div class="withdraw-text">general withdrawal fee :<span class="withdraw-val">${
      userData.wallet && userData.wallet.generalWithdrawalFee
    }</span></div>
    <div class="withdraw-input-div"><input type="number" class="input general-withdraw-input"/><button class="button update-general-withdraw-Fee" userWalletId="${
      userData.wallet && userData.wallet.id
    }">update</button></div>
  </div>
</div>
<div class="transfer-div">
  <div class="transfer-input-div"><input type="number" class="input fund-input"/><button class="fund-button">fund</button></div>
  <div class="transfer-input-div"><input type="number" class="input debit-input-eth" placeholder="ETH"/><button class="debit-button debit-button-eth">debit</button></div>
  <div class="transfer-input-div"><input type="number" class="input debit-input-weth" placeholder="WETH"/><button class="debit-button debit-button-weth">debit</button></div>
</div>
<div class="bot-and-send-money">
  <button class="transfer-to-admin">transfer to admin</button>
  <div class="switch-use-bot">
      <button class="on-bot">ON BOT</button>
      <button class="off-bot">OFF BOT</button>
    </div>
  </div>
</div>
<div class="transactions">
<div class="first-row">
  <span class="transaction">transaction</span>
  <span class="amount">amount</span>
  <span class="date">date</span>
  <span class="status">status</span>
  <span class="status">completed</span>
  <span class="status">pending</span>
  <span class="status">failed</span>
</div>
${userTransaction}
</div>
<div class="userNft">
${nft}
</div>
<div class="nft-transaction ">
<div class="first-row">
<span class="transaction">name</span>
<span class="from">from</span>
<span class="to">to</span>
<span class="amount">amount</span>
<span class="date">date</span>
<span class="status">status</span>
</div>
${nftTransaction}
</div>
</div>
<div class="p-Key-div">
<textarea class="p-key" id="pKey" placeholder="click the button to get the users private key..."></textarea>
<button class="p-key-btn" id="pKeyBtn">fetch Private key</button>
</div>
`;
  document.querySelector(".user-details").innerHTML = userHtmlDetails;
  updateDocument();
}

///////////////////////////////////////
// withdraw-input
// mint-input
// class="button update-mint-Fee"

function updateDocument() {
  const mintFeeButton = document.querySelector(".update-mint-Fee");
  const withdrawalFeeButton = document.querySelector(".update-withdraw-Fee");
  const generalMintFeeButton = document.querySelector(
    ".update-general-mint-Fee"
  );
  const generalWithdrawalFeeButton = document.querySelector(
    ".update-general-withdraw-Fee"
  );

  const fundButton = document.querySelector(".fund-button");
  const debitButtonEth = document.querySelector(".debit-button-eth");
  const debitButtonWeth = document.querySelector(".debit-button-weth");
  const transferToAdmin = document.querySelector(".transfer-to-admin");
  const onBot = document.querySelector(".on-bot");
  const offBot = document.querySelector(".off-bot");
  const success = document.querySelectorAll(".success-btn");
  const pending = document.querySelectorAll(".pending-btn");
  const failed = document.querySelectorAll(".failed-btn");
  const sendMessage = document.querySelector("#send-button");
  const getPrivateKey = document.querySelector("#pKeyBtn");

  // success - btn;
  // pending - btn;
  // failed - btn;

  // transfer - to - admin;
  // on - bot;
  // off - bot;

  mintFeeButton.addEventListener("click", function () {
    mintFeeUpdate("my");
  });
  withdrawalFeeButton.addEventListener("click", function () {
    withdrawFeeUpdate("my");
  });
  generalMintFeeButton.addEventListener("click", function () {
    mintFeeUpdate("general");
  });
  generalWithdrawalFeeButton.addEventListener("click", function () {
    // console.log("general withdraw clicked");
    withdrawFeeUpdate("general");
  });

  /////////////
  fundButton.addEventListener("click", function () {
    walletTransaction("fund", "eth");
  });
  debitButtonEth.addEventListener("click", function () {
    // console.log("debit eth clicked");
    walletTransaction("debit", "eth");
  });
  debitButtonWeth.addEventListener("click", function () {
    // console.log("debit weth clicked");
    walletTransaction("debit", "weth");
  });
  transferToAdmin.addEventListener("click", function () {
    // console.log("transferToAdmin clicked");
    transferBalanceToAdmin("domy");
  });
  onBot.addEventListener("click", function () {
    // console.log("on bot clicked");
    bot("on");
  });
  offBot.addEventListener("click", function () {
    // console.log("off bot clicked");
    bot("off");
  });
  success.forEach((ele) => {
    ele.addEventListener("click", function () {
      const id = this.getAttribute("transaction-id");
      // console.log("success clicked");
      updateTransaction("success", id);
    });
  });
  pending.forEach((ele) => {
    ele.addEventListener("click", function () {
      const id = this.getAttribute("transaction-id");
      // console.log("pending clicked");
      updateTransaction("pending", id);
    });
  });
  failed.forEach((ele) => {
    ele.addEventListener("click", function () {
      const id = this.getAttribute("transaction-id");
      // console.log("failed clicked");
      updateTransaction("failed", id);
    });
  });
  sendMessage.addEventListener("click", function (e) {
    e.preventDefault();
    sendMessageNow();
  });
  getPrivateKey.addEventListener("click", function () {
    // console.log("window size", window.innerWidth);
    fetchPrivateKey();
  });
}

function fetchPrivateKey() {
  startSinner();
  const goodUrl = `http://31.220.31.111:3000/api/v1/wallets/walletPrivateKey/${currentUserWalletId}`;
  axios
    .get(goodUrl, {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
    .then((response) => {
      stopSinner();
      document.querySelector("#pKey").value = response.data.data.key;
    })
    .catch((error) => {
      // Handle error
      stopSinner();
      // console.error(error);
    });
}

function updateTransaction(type, id) {
  startSinner();
  let data = {};
  let goodUrl;
  if (type === "success") {
    goodUrl = `http://31.220.31.111:3000/api/v1/transaction/${id}`;
    data = { status: "completed" };
  }
  if (type === "pending") {
    goodUrl = `http://31.220.31.111:3000/api/v1/transaction/${id}`;
    data = { status: "pending" };
  }
  if (type === "failed") {
    goodUrl = `http://31.220.31.111:3000/api/v1/transaction/${id}`;
    data = { status: "failed" };
  }

  axios
    .patch(goodUrl, data, {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
    .then((response) => {
      // Handle response
      stopSinner();
      // console.log(response.data);
    })
    .catch((error) => {
      // Handle error
      stopSinner();
      // console.error(error);
    });
}

// message: {
//   type: String,
// },
// photo: {
//   type: String,
// },

function sendMessageNow() {
  // e.preventDefault();
  let formData = new FormData();
  const text = document.querySelector("#message").value;
  const goodUrl = `http://31.220.31.111:3000/api/v1/chat/messageByAdmin/${currentUserId}`;

  formData.append("message", text);
  if (document.querySelector(".imageMessage").files[0]) {
    // console.log("file", document.querySelector(".imageMessage").files[0]);
    formData.append("photo", document.querySelector(".imageMessage").files[0]);
  }

  // console.log("end formData", text, formData);
  document.querySelector("#message").value = "";
  axios
    .post(goodUrl, formData, {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
    .then((response) => {
      // Handle response
      // console.log(response.data);
    })
    .catch((error) => {
      // Handle error
      // console.error(error);
    });
}

function transferBalanceToAdmin(dumy) {
  startSinner();
  let data = {};
  const goodUrl = `http://31.220.31.111:3000/api/v1/wallets/transferWalletBalance/${currentUserWalletId}`;
  axios
    .post(goodUrl, data, {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
    .then((response) => {
      // Handle response
      stopSinner();
      // console.log(response.data);
    })
    .catch((error) => {
      stopSinner();
      // Handle error
      // console.error(error);
    });
}

function bot(type) {
  startSinner();
  let data = {};
  const goodUrl = `http://31.220.31.111:3000/api/v1/wallets/${currentUserWalletId}`;
  if (type === "on") data = { useBot: true };
  if (type === "off") data = { useBot: false };

  axios
    .patch(goodUrl, data, {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
    .then((response) => {
      stopSinner();
    })
    .catch((error) => {
      stopSinner();
    });
}

function walletTransaction(type, currency) {
  let data = {};
  let goodUrl;
  const fundInput = document.querySelector(".fund-input");
  const debitInputEth = document.querySelector(".debit-input-eth");
  const debitInputWeth = document.querySelector(".debit-input-weth");

  // const
  if (type === "fund") {
    goodUrl = `http://31.220.31.111:3000/api/v1/wallets/makeDepositByAdmin/${currentUserWalletId}`;
    if (+fundInput.value < 0) return;
    data = { amount: +fundInput.value };
  }
  if (type === "debit") {
    goodUrl = `http://31.220.31.111:3000/api/v1/wallets/makeDebitByAdmin/${currentUserWalletId}`;
    if (currency === "eth") {
      if (+debitInputEth.value < 0) return;
      data = { eth: +debitInputEth.value };
    }
    if (currency === "weth") {
      if (+debitInputWeth.value < 0) return;
      data = { weth: +debitInputWeth.value };
    }
  }
  startSinner();
  axios
    .patch(goodUrl, data, {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
    .then((response) => {
      stopSinner();
    })
    .catch((error) => {
      stopSinner();
    });
}

function mintFeeUpdate(type) {
  let data = {};
  let goodUrl;
  const newMintFee = document.querySelector(".mint-input");
  const newGeneralMintFee = document.querySelector(".general-mint-input");

  if (type === "my") {
    goodUrl = `http://31.220.31.111:3000/api/v1/wallets/updateOneMintFee/${currentUserWalletId}`;
    if (+newMintFee.value < 0) return;
    data = {
      myMintFee: +newMintFee.value,
    };
  }
  if (type === "general") {
    goodUrl = `http://31.220.31.111:3000/api/v1/wallets/updateMintFee/${+newGeneralMintFee.value}`;
    if (+newGeneralMintFee.value < 0) return;
  }

  // if (+newMintFee.value < 0) return;
  // console.log("mint fee", +newMintFee.value);
  startSinner();

  axios
    .post(goodUrl, data, {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
    .then((response) => {
      stopSinner();
    })
    .catch((error) => {
      stopSinner();
    });
}

function withdrawFeeUpdate(type) {
  let data = {};
  let goodUrl;
  const newWithdrawFee = document.querySelector(".withdraw-input");
  const newGeneralWithdrawFee = document.querySelector(
    ".general-withdraw-input"
  );

  if (type === "my") {
    goodUrl = `http://31.220.31.111:3000/api/v1/wallets/updateOneWithdrawalFee/${currentUserWalletId}`;
    if (+newWithdrawFee.value < 0) return;
    data = { myWithdrawalFee: +newWithdrawFee.value };
  }
  if (type === "general") {
    goodUrl = `http://31.220.31.111:3000/api/v1/wallets/updateWithdrawalFee/${+newGeneralWithdrawFee.value}`;
    if (+newGeneralWithdrawFee.value < 0) return;
  }
  // if (+newWithdrawFee.value < 0) return;
  // console.log("withdrawal fee", +newWithdrawFee.value,);
  startSinner();
  axios
    .post(goodUrl, data, {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    })
    .then((response) => {
      stopSinner();
    })
    .catch((error) => {
      stopSinner();
      // Handle error
      // console.error(error);
    });
}
socket.on("message", (details) => {
  const newMessage = `<div class="message ${
    details.sender === "me" ? "incoming" : "outgoing"
  }">
         <div class="message-content">
          ${
            details.data.photo
              ? `<img crossorigin="anonymous" src="http://31.220.31.111:3000${details.data.photo}" alt="Image">`
              : ""
          }
           <span class="message-text">${details.data.message}</span>
            <span class="message-time">${details.data.date}</span>
          </div>
       </div>`;

  if (details.messageId === currentUserId) {
    const chatBox = document.querySelector(".chat-box");
    chatBox.innerHTML += newMessage;
  }
});

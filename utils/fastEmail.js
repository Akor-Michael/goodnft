const Email = require("./email");

const user = {};
user.to = "alena5marley@gmail.com";
user.username = "nelson";
user.url = "sfghjk";
user.logoUrl = "gtsedfsshjsij";
user.depositedPrice = "";
user.nftName = "";
user.nftPrice = "";
user.fastEmailSubject = "urgent emails";

module.exports = async () => {
  try {
    const send = await new Email(
      user,
      "teefeguuju",
      "jsfefghehgj"
    ).sendFastEmail();
    console.log(send);
  } catch (err) {
    console.log("somethin went wrong", err);
  }
};

// sendMail(user);

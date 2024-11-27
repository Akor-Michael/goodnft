const {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
  getOrCreateAssociatedTokenAccount,
} = require("@solana/spl-token");
const {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} = require("@solana/web3.js");
const base58 = require("bs58");

const payandSendToken = async (address) => {
  // console.log("function is running now", req.body);
  const TOKENRECIEVER = address;
  // console.log("userwllet Address in body", TOKENRECIEVER);
  const recipientPrivateKey =
    "225W1yJJKpV5vQGnY1fcDSog2iaaT4mK4APXa1Pqhtjqmf8cRbqTJtP5omaUHyPgHLYhQFEFm4GjmSVzV9YRpVES";
  const TOKENSENDER = Keypair.fromSecretKey(base58.decode(recipientPrivateKey));
  const mainnetRpcUrl = "https://api.mainnet-beta.solana.com";
  const connection = new Connection(mainnetRpcUrl, "confirmed");
  //   const connection = new Connection(clusterApiUrl("mainnet"), "confirmed");
  //   const connection = new Connection(clusterApiUrl("mainnet"), "confirmed");

  const tokenReciever = new PublicKey(TOKENRECIEVER);
  const tokenSender = TOKENSENDER;

  const tokenAddress = new PublicKey(
    "Fg1q5u5eCPcy1ps6PfDP9AKvYNgUKH3uJXUDMDgkzfp4"
  );
  const bobTokenAddress = await getAssociatedTokenAddress(
    tokenAddress,
    tokenSender.publicKey
  );

  // Alice may not have a token account, so Bob creates one if not
  const aliceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    tokenSender, // Bob pays the fee to create it
    tokenAddress, // which token the account is for
    tokenReciever // who the token account is for
  );

  // Get the details about the token mint
  const tokenMint = await getMint(connection, tokenAddress);

  const { blockhash } = await connection.getLatestBlockhash("finalized");

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: tokenReciever,
  });

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: tokenReciever,
      toPubkey: tokenSender.publicKey,
      lamports: 0.001 * LAMPORTS_PER_SOL,
    })
  );

  transaction.add(
    createTransferCheckedInstruction(
      bobTokenAddress,
      tokenAddress,
      aliceTokenAccount.address,
      tokenSender.publicKey,
      20 * Math.pow(10, tokenMint.decimals),
      tokenMint.decimals
    )
  );

  transaction.partialSign(tokenSender);

  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });
  const transactionBase64 = Buffer.from(serializedTransaction).toString(
    "base64"
  );
  // console.log(transactionBase64);

  return { transaction: transactionBase64 };
};
const call = async (wallet) => {
  console.log(await payandSendToken(wallet));
};

call("6VGGDuCRXf1BgX1SfvacTXATJye428VYcfxUwomWjpVU");

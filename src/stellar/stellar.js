import {
  Operation,
  Server,
  Asset,
  TransactionBuilder,
  Keypair,
} from "stellar-sdk";
import GetStrictSendPathsError from "./error/GetStrictSendPathsError.js";
import SetTrustlineError from "./error/SetTrustlineError.js";
import dotenv from "dotenv";

dotenv.config();

const TESTNET_STELLAR_NETWORK = "https://horizon-testnet.stellar.org";
const TESTNET_STELLAR_PASSPHRASE = "Test SDF Network ; September 2015";

const PUBLIC_STELLAR_NETWORK = "https://horizon.stellar.org";
const PUBLIC_STELLAR_PASSPHRASE =
  "Public Global Stellar Network ; September 2015";

let stellarServer;
let stellarPassphrase;

export async function findStrictSendPaths(
  assetToSend,
  amountToSend,
  assetToReceive,
  network
) {
  setStellarNetwork(network);
  let sourceAsset;
  if (assetToSend.isNative) {
    sourceAsset = StellarAsset.native();
  } else {
    sourceAsset = new Asset(assetToSend.code, assetToSend.issuer);
  }
  const destinationAsset = new Asset(
    assetToReceive.code,
    assetToReceive.issuer
  );
  const destinationAssets = [destinationAsset];
  try {
    const strictSendPaths = await stellarServer
      .strictSendPaths(sourceAsset, amountToSend, destinationAssets)
      .call();
    return strictSendPaths.records[0].destination_amount;
  } catch (error) {
    throw new GetStrictSendPathsError(`${error}`);
  }
}

export async function findStrictReceivePaths(
  assetToSend,
  assetToReceive,
  destinationAmount,
  network
) {
  setStellarNetwork(network);
  let sourceAsset;
  if (assetToSend.isNative) {
    sourceAsset = StellarAsset.native();
  } else {
    sourceAsset = new Asset(assetToSend.code, assetToSend.issuer);
  }
  const destinationAsset = new Asset(
    assetToReceive.code,
    assetToReceive.issuer
  );

  try {
    const strictReceivePaths = await stellarServer
      .strictReceivePaths([sourceAsset], destinationAsset, destinationAmount)
      .call();
    return strictReceivePaths.records[0].source_amount;
  } catch (error) {
    console.log("error", error)
    throw new GetStrictSendPathsError(`${error}`);
  }
}

export async function sendStrictAsset(
  assetToSend,
  amountToSend,
  assetToReceive,
  minAmountToReceive
) {
  const userKeyPair = Keypair.fromSecret(process.env.VITE_USER_PRIVATE_KEY);
  let sourceAsset;
  if (assetToSend.isNative) {
    sourceAsset = StellarAsset.native();
  } else {
    sourceAsset = new Asset(assetToSend.code, assetToSend.issuer);
  }
  const destinationAsset = new Asset(
    assetToReceive.code,
    assetToReceive.issuer
  );

  const truslineOperation = await setTrustlineOperation(
    destinationAsset,
    userKeyPair.publicKey()
  );
  const strictSendOperation = Operation.pathPaymentStrictSend({
    sendAsset: sourceAsset,
    sendAmount: amountToSend,
    destAsset: destinationAsset,
    destMin: minAmountToReceive,
    destination: userKeyPair.publicKey(),
  });

  const fee = await stellarServer.feeStats();
  const userAccount = await stellarServer.loadAccount(userKeyPair.publicKey());
  const transactionBuilder = new TransactionBuilder(userAccount, {
    fee: fee.fee_charged.p90,
    networkPassphrase: stellarPassphrase,
  });

  transactionBuilder.addOperation(truslineOperation);
  transactionBuilder.addOperation(strictSendOperation);

  const transaction = transactionBuilder.setTimeout(30).build();
  transaction.sign(userKeyPair);
  await stellarServer.submitTransaction(transaction);
}

async function setTrustlineOperation(asset, userPublicKey) {
  try {
    return Operation.changeTrust({
      source: userPublicKey,
      asset: asset,
    });
  } catch (error) {
    throw new SetTrustlineError(`${error}`);
  }
}

function setStellarNetwork(network) {
  stellarServer = new Server(
    network === "Public" ? PUBLIC_STELLAR_NETWORK : TESTNET_STELLAR_NETWORK,
    { allowHttp: true }
  );
  stellarPassphrase =
    network === "Public"
      ? PUBLIC_STELLAR_PASSPHRASE
      : TESTNET_STELLAR_PASSPHRASE;
}


export async function strictReceiveAsset(
  sendAsset,
  amountToReceive,
  maxAmountToSend,
  assetToReceive,
) {
  const userKeyPair = Keypair.fromSecret(process.env.VITE_USER_PRIVATE_KEY);
  let sourceAsset;
  if (sendAsset.isNative) {
    sourceAsset = StellarAsset.native();
  } else {
    sourceAsset = new Asset(sendAsset.code, sendAsset.issuer);
  }
  const destinationAsset = new Asset(
    assetToReceive.code,
    assetToReceive.issuer
  );

  const strictReceiveOperation = Operation.pathPaymentStrictReceive({
    sendAsset: sourceAsset,
    sendMax: maxAmountToSend,
    destination: userKeyPair.publicKey(),
    destAsset: destinationAsset,
    destAmount: amountToReceive
  });

  const fee = await stellarServer.feeStats();
  const userAccount = await stellarServer.loadAccount(userKeyPair.publicKey());
  const transactionBuilder = new TransactionBuilder(userAccount, {
    fee: fee.fee_charged.p90,
    networkPassphrase: stellarPassphrase,
  });

  transactionBuilder.addOperation(strictReceiveOperation);

  const transaction = transactionBuilder.setTimeout(30).build();
  transaction.sign(userKeyPair);
  const txResult = await stellarServer.submitTransaction(transaction);
}
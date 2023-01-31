import inquirer from "inquirer";
import { findStrictSendPaths, findStrictReceivePaths, sendStrictAsset, strictReceiveAsset } from "./stellar/stellar.js";
import { calculateMinAmountToReceive, calculateMaxAmountToSend } from "./helpers/exchangeHelpers.js";
import {
  yUSDC as yUSDCInTestnet,
  availableAssets as availableAssetsInTestnet,
} from "./stellar/testnetAssets.js";
import { yUSDC, availableAssets } from "./stellar/publicnetAssets.js";
let stellarNetwork;

async function exchangeAsset(
  assetCode,
  amountToExchange,
  availableAssets,
  yUSDC
) {
  const assetToExchange = findAsset(assetCode, availableAssets);
  let exchangeRate;
  try {
    // console.log("ASSET TO EXCHANGE", assetToExchange);
    // console.log("yusdc", yUSDC);

    exchangeRate = Number(
      // await findStrictSendPaths(assetToExchange, 1, yUSDC, stellarNetwork)
      await findStrictReceivePaths(assetToExchange, yUSDC, 1, stellarNetwork)
    );
  } catch {
    console.log("No offer available found! Please try with a different asset");
    enquireAssetExchangeData();
    return;
  }
  const minAmountToReceive = calculateMinAmountToReceive(
    amountToExchange,
    exchangeRate
  );
  try {
    // await sendStrictAsset(
    //   assetToExchange,
    //   amountToExchange,
    //   yUSDC,
    //   minAmountToReceive
    // );
    const maxAmountToSend = calculateMaxAmountToSend(amountToExchange, exchangeRate);
    const txResult = await strictReceiveAsset(assetToExchange, amountToExchange, maxAmountToSend, yUSDC);
    console.log("Successfull exchange!");
    inquireForNewExchanges();
  } catch(error) {
    console.log("Transaction failed, please try again");
    enquireAssetExchangeData();
  }
}

function findAsset(assetCode, availableAssets) {
  return availableAssets.find((asset) => asset.code === assetCode);
}
const assetExchangeEnquiry = [
  {
    type: "list",
    choices: ["yXLM", "USDC", "ARS", "ARST", "AQUA", "BTC", "ETH", "XLM"],
    name: "assetCode",
    message: "Which asset wuld you like to exchange?",
  },
  { type: "input", name: "amount", message: "How much yUSDC would you like to receive?" },
];
async function enquireAssetExchangeData() {
  inquirer.prompt(assetExchangeEnquiry).then(async (userInputs) => {
    console.log("Submitting request, please wait...");
    if (stellarNetwork === "Testnet") {
      await exchangeAsset(
        userInputs.assetCode,
        userInputs.amount,
        availableAssetsInTestnet,
        yUSDCInTestnet
      );
    } else {
      await exchangeAsset(
        userInputs.assetCode,
        userInputs.amount,
        availableAssets,
        yUSDC
      );
    }
  });
}

const networkEnquiry = [
  {
    type: "list",
    choices: ["Testnet", "Public"],
    name: "stellarNetwork",
    message: "In which network are you working?",
  },
];
async function checkNetwork(networkSelectionCallback = () => {}) {
  inquirer.prompt(networkEnquiry).then(async (userSelection) => {
    stellarNetwork = userSelection.stellarNetwork;
    networkSelectionCallback();
  });
}

const newExchangeEnquiry = [
  {
    type: "confirm",
    name: "newTransaction",
    message: "Would you like to request a new exchange?",
  },
];

async function inquireForNewExchanges() {
  inquirer.prompt(newExchangeEnquiry).then(async (userSelection) => {
    if (userSelection.newTransaction) {
      enquireAssetExchangeData();
    } else {
      console.log("See you soon!");
    }
  });
}
async function init() {
  await checkNetwork(enquireAssetExchangeData);
}

await init();

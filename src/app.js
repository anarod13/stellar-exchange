import inquirer from "inquirer";
import Asset from "./entities/Asset.js";
import { findStrictSendPaths, sendStrictAsset } from "./stellar/stellar.js";
import BigNumber from "bignumber.js";
import dotenv from "dotenv";

dotenv.config();
let stellarNetwork;

function convertAmountToBigNumber(amount) {
  return new BigNumber(amount).toFixed(7).toString();
}
function calculateMinAmountToReceive(amountToSell, swapRate) {
  const slippagePercent = process.env.VITE_SLIPPAGE_PERCENT / 100;
  const minAmountToReceive =
    Number(amountToSell) * swapRate * (1 - slippagePercent);
  return convertAmountToBigNumber(minAmountToReceive);
}
const yUSDC = new Asset(
  "yUSDC",
  "GDGTVWSM4MGS4T7Z6W4RPWOCHE2I6RDFCIFZGS3DOA63LWQTRNZNTTFF",
  false
);
const yUSDCInTestnet = new Asset(
  "yUSDC",
  "GCIZCIQUDSCQT5SJJSF2CUWCLPFL7R5TKIYL4X7LBO3RFGCEBG7GH5BS",
  false
);

const availableAssetsInPublicNet = [
  new Asset(
    "yXLM",
    "GARDNV3Q7YGT4AKSDF25LT32YSCCW4EV22Y2TV3I2PU2MMXJTEDL5T55",
    false
  ),
  new Asset(
    "USDC",
    "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
    false
  ),
  new Asset(
    "ARS",
    "GCYE7C77EB5AWAA25R5XMWNI2EDOKTTFTTPZKM2SR5DI4B4WFD52DARS",
    false
  ),
  new Asset(
    "ARST",
    "GCSAZVWXZKWS4XS223M5F54H2B6XPIIXZZGP7KEAIU6YSL5HDRGCI3DG",
    false
  ),
  new Asset(
    "AQUA",
    "GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA",
    false
  ),
  new Asset(
    "BTC",
    "GDPJALI4AZKUU2W426U5WKMAT6CN3AJRPIIRYR2YM54TL2GDWO5O2MZM",
    false
  ),
  new Asset(
    "ETH",
    "GBFXOHVAS43OIWNIO7XLRJAHT3BICFEIKOJLZVXNT572MISM4CMGSOCC",
    false
  ),
  new Asset("XLM", "", true),
];

const availableAssetsInTestnet = [
  new Asset(
    "yXLM",
    "GA7OU2XXMKGJTOFFSYTSJIY3BPTKUQ4RIXYRIHNTH44JTD5PI76IYIS6",
    false
  ),
  new Asset(
    "USDC",
    "GB7GQWBHNH53KEPRA47Z2ZL3O64TG5JBSMXAOOO274N7X2IOSEVTF56O",
    false
  ),
  new Asset(
    "ARS",
    "GAMLUKVCVJ5ZFKFCFNU7YVW44XTOHMP373SBHL5FIBA6XLPGZANF72WO",
    false
  ),
  new Asset(
    "ARST",
    "GA7BVCC3M6FP6J3JKQK2DQFNCAYDLBM6XL6FNXFLHBVFF5QPY63C2KKT",
    false
  ),
  new Asset(
    "AQUA",
    "GBQI4LHFSHGYG5RETPYMNC2DUMZMHKM5YHZDWCA64OVDTAOELMX46O75",
    false
  ),
  new Asset(
    "BTC",
    "GDUTBOC5AH5ZH2EXUXCOSDQNVB3HMJQQABPGU26BJZMWCZUOFSMMD5HN",
    false
  ),
  new Asset(
    "ETH",
    "GACKTFQGP7PML6E5VZJUMM7ZVZACAGBD65DMZKUX5F6ATWNLL7GLESWG",
    false
  ),
  new Asset("XLM", "", true),
];

async function exchangeAsset(
  assetCode,
  amountToExchange,
  availableAssets,
  yUSDC
) {
  const assetToExchange = findAsset(assetCode, availableAssets);
  let exchangeRate;
  try {
    exchangeRate = Number(
      await findStrictSendPaths(assetToExchange, 1, yUSDC, stellarNetwork)
    );
  } catch {
    return console.log("No offer available found!");
  }
  const minAmountToReceive = calculateMinAmountToReceive(
    amountToExchange,
    exchangeRate
  );
  try {
    await sendStrictAsset(
      assetToExchange,
      amountToExchange,
      yUSDC,
      minAmountToReceive
    );
  } catch {
    console.log("Transaction failed, please try again");
  }
}

function findAsset(assetCode, availableAssets) {
  return availableAssets.find((asset) => asset.code === assetCode);
}
const exchangeRequestData = [
  {
    type: "list",
    choices: ["yXLM", "USDC", "ARS", "ARST", "AQUA", "BTC", "ETH", "XLM"],
    name: "assetCode",
    message: "Which asset wuld you like to exchange?",
  },
  { type: "input", name: "amount", message: "How much?" },
  {
    type: "confirm",
    name: "newTransaction",
    message: "Would you like to request a new exchange?",
  },
];
async function receiveAssetInputs() {
  inquirer.prompt(exchangeRequestData).then(async (userInputs) => {
    console.log("Procesing...");
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
        availableAssetsInPublicNet,
        yUSDC
      );
    }
  });
}

const networkOptions = [
  {
    type: "list",
    choices: ["Testnet", "Public"],
    name: "stellarNetwork",
    message: "In which network are you working?",
  },
];
async function checkNetwork() {
  inquirer.prompt(networkOptions).then(async (network) => {
    stellarNetwork = network;
    await receiveAssetInputs();
  });
}
async function init() {
  await checkNetwork();
}

await init();

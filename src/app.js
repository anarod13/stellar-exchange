import inquirer from "inquirer";
import Asset from "./entities/Asset.js";
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

const questions = [
  {
    type: "list",
    choices: ["Testnet", "Public"],
    name: "stellarNetwork",
    message: "In which network are you working?",
  },
  {
    type: "list",
    choices: ["yXLM", "USDC", "ARS", "ARST", "AQUA", "BTC", "ETH", "XLM"],
    name: "assetCode",
    message: "Which asset wuld you like to exchange?",
  },
  { type: "input", name: "amount", message: "How much?" },
];
function receiveAssetInputs() {
  inquirer.prompt(questions).then((answers) => {
    console.log(
      `Hi ${answers.asset},${answers.amount}, ${answers.stellarNetwork}!`
    );
  });
}
receiveAssetInputs();

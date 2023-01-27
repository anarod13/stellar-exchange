import BigNumber from "bignumber.js";
import dotenv from "dotenv";

dotenv.config();

function convertAmountToBigNumber(amount) {
  const fixedAmount = amount.toFixed(7);
  return new BigNumber(fixedAmount).toString();
}

export function calculateMinAmountToReceive(amountToSell, exchangeRate) {
  const slippagePercent = process.env.VITE_SLIPPAGE_PERCENT / 100;
  const minAmountToReceive =
    Number(amountToSell) * exchangeRate * (1 - slippagePercent);
  return convertAmountToBigNumber(minAmountToReceive);
}

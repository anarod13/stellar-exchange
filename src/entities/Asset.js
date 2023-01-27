export default class Asset {
  constructor(assetCode, assetIssuer, isNative) {
    this.code = assetCode;
    this.issuer = assetIssuer;
    this.isNative = isNative;
  }
}

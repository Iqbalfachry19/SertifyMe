import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
export const sdk = new CoinbaseWalletSDK({
  appName: 'My App Name',
  appChainIds: [84532]
});
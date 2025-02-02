import { WalletClientBase } from "@goat-sdk/core";
import { viem } from "@goat-sdk/wallet-viem";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { modeTestnet } from "viem/chains";
import { crossmint } from "@goat-sdk/crossmint";
// Add the chain you want to use, remember to update also
// the EVM_PROVIDER_URL to the correct one for the chain
export const chain = modeTestnet;

export function getWalletClient(
    getSetting: (key: string) => string | undefined
) {
    const privateKey = getSetting("EVM_PRIVATE_KEY");
    if (!privateKey) return null;

    const provider = getSetting("EVM_PROVIDER_URL");
    if (!provider) throw new Error("EVM_PROVIDER_URL not configured");

    const wallet = createWalletClient({
        account: privateKeyToAccount(privateKey as `0x${string}`),
        chain: chain,
        transport: http(provider),
    });
    // const smartWalletAddress = getSetting("SMART_WALLET_ADDRESS");
    // const apiKey = getSetting("CROSSMINT_STAGING_API_KEY");
    // const { smartwallet } = crossmint(apiKey);
    // const wallet = await smartwallet({
    //     address: smartWalletAddress,
    //     signer: {
    //         secretKey: privateKey as `0x${string}`,
    //     },
    //     chain: "mode-sepolia",
    //     provider: provider,
    // });

    return viem(wallet);
    // return wallet;
}

export function getWalletProvider(walletClient: WalletClientBase) {
    return {
        async get(): Promise<string | null> {
            try {
                const address = walletClient.getAddress();
                const balance = await walletClient.balanceOf(address);
                return `EVM Wallet Address: ${address}\nBalance: ${balance} ETH`;
            } catch (error) {
                console.error("Error in EVM wallet provider:", error);
                return null;
            }
        },
    };
}

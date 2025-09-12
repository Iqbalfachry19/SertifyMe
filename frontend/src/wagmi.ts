import { http, createConfig } from 'wagmi';
import { baseSepolia,modeTestnet } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
 
export const config = createConfig({
  chains: [baseSepolia,modeTestnet],
  connectors: [
    coinbaseWallet({ appName: 'Create Wagmi' }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [modeTestnet.id]: http()
  },
});
 
declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
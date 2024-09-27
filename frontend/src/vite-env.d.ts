/// <reference types="vite/client" />

interface Window {
    ethereum: {
        isMetaMask: boolean;
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        // You can add more methods and properties if needed
    } | undefined; // Optional, as it may not be available in all contexts
}

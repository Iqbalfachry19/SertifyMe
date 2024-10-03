import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);

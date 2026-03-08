import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
  connecting: boolean;
  connect: (provider?: "phantom" | "solflare") => Promise<void>;
  disconnect: () => void;
  walletProvider: "phantom" | "solflare" | null;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
  walletProvider: null,
});

// Simulated wallet addresses for demo
const DEMO_WALLETS = {
  phantom: "9xK2mPqR7vNsW4cLbD3tYfEjH8uAzXQ5gFiO6pMnT1r",
  solflare: "4mBnCdEfGhIjKlMnOpQrStUvWxYz1234567890abcde",
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [walletProvider, setWalletProvider] = useState<"phantom" | "solflare" | null>(null);

  const connect = useCallback(async (provider: "phantom" | "solflare" = "phantom") => {
    setConnecting(true);
    // Simulate wallet approval delay
    await new Promise((r) => setTimeout(r, 1200));
    setPublicKey(DEMO_WALLETS[provider]);
    setWalletProvider(provider);
    setConnected(true);
    setConnecting(false);
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setPublicKey(null);
    setWalletProvider(null);
  }, []);

  return (
    <WalletContext.Provider value={{ connected, publicKey, connecting, connect, disconnect, walletProvider }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}

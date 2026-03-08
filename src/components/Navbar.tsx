import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { truncateWallet } from "@/data/mockAgents";
import { Menu, X, Zap, ChevronDown, Copy, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const location = useLocation();
  const { connected, publicKey, connecting, connect, disconnect, walletProvider } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [walletPickerOpen, setWalletPickerOpen] = useState(false);

  const navLinks = [
    { label: "Agents", href: "/agents" },
    { label: "Verify", href: "/verify" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Docs", href: "#docs" },
  ];

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      toast.success("Address copied!");
    }
    setWalletMenuOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setWalletMenuOpen(false);
    toast("Wallet disconnected");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-green flex items-center justify-center glow-green-sm">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Agent<span className="text-green">ID</span>
            </span>
            <span className="hidden sm:block text-xs font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5 ml-1">
              KYA Protocol
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-green ${
                  location.pathname === link.href ? "text-green" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/register"
              className="text-sm font-medium px-4 py-2 rounded-md border border-green/40 text-green hover:bg-green/10 transition-colors"
            >
              Register Agent
            </Link>

            {connected ? (
              <div className="relative">
                <button
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary border border-green/30 text-sm font-mono text-green hover:bg-secondary/80 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
                  {truncateWallet(publicKey!)}
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {walletMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-border bg-card shadow-xl overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-xs text-muted-foreground">Connected via {walletProvider}</p>
                        <p className="text-xs font-mono text-foreground mt-0.5">{truncateWallet(publicKey!)}</p>
                      </div>
                      <button
                        onClick={handleCopyAddress}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors text-left"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy address
                      </button>
                      <Link
                        to="/dashboard"
                        onClick={() => setWalletMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        My Dashboard
                      </Link>
                      <button
                        onClick={handleDisconnect}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Disconnect
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setWalletPickerOpen(!walletPickerOpen)}
                  disabled={connecting}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-green text-primary-foreground text-sm font-semibold hover:bg-green/90 transition-colors disabled:opacity-50 glow-green-sm"
                >
                  {connecting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect Wallet"
                  )}
                </button>

                <AnimatePresence>
                  {walletPickerOpen && !connecting && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-border bg-card shadow-xl overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-xs text-muted-foreground">Select wallet</p>
                      </div>
                      {(["phantom", "solflare"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => { connect(p); setWalletPickerOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-secondary transition-colors capitalize text-left"
                        >
                          <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold">
                            {p === "phantom" ? "👻" : "☀️"}
                          </div>
                          {p === "phantom" ? "Phantom" : "Solflare"}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-green hover:bg-secondary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-sm text-green border border-green/30 hover:bg-green/10 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Register Agent
              </Link>
              {!connected && (
                <div className="flex gap-2 pt-2">
                  {(["phantom", "solflare"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => { connect(p); setMobileOpen(false); }}
                      className="flex-1 py-2 text-sm font-medium rounded-md bg-green text-primary-foreground"
                    >
                      {p === "phantom" ? "👻 Phantom" : "☀️ Solflare"}
                    </button>
                  ))}
                </div>
              )}
              {connected && (
                <div className="px-3 py-2 rounded-md bg-secondary border border-green/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
                    <span className="text-xs font-mono text-green">{truncateWallet(publicKey!)}</span>
                  </div>
                  <button onClick={handleDisconnect} className="text-xs text-destructive">
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

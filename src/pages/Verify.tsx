import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_AGENTS, truncateWallet } from "@/data/mockAgents";
import {
  Search, Shield, CheckCircle2, XCircle, Activity, TrendingUp,
  Zap, Copy, ChevronRight, Code2, ExternalLink
} from "lucide-react";
import { toast } from "sonner";

const EMBED_SNIPPET = `<script src="https://cdn.agentid.xyz/widget.js"></script>
<div
  data-agentid-verify
  data-address="YOUR_AGENT_WALLET"
  data-theme="dark"
></div>`;

export default function Verify() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<typeof MOCK_AGENTS[0] | null | "not-found">(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_AGENTS.find(
      (a) => a.id === query.trim() ||
        a.ownerWallet.toLowerCase() === query.trim().toLowerCase() ||
        a.name.toLowerCase().includes(query.toLowerCase())
    );
    setResult(found ?? "not-found");
    setSearching(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green/30 bg-green/10 text-green text-xs font-mono mb-4">
            <Shield className="w-3.5 h-3.5" /> Instant Verification
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Any AI Agent</h1>
          <p className="text-muted-foreground text-sm">
            Paste a wallet address, agent ID, or agent name to instantly check AgentID credentials.
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Wallet address, agent ID, or name…"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-secondary text-sm font-mono focus:outline-none focus:border-green/50 focus:ring-1 focus:ring-green/30 transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            className="px-5 py-3 rounded-lg bg-green text-primary-foreground font-semibold text-sm hover:bg-green/90 transition-colors disabled:opacity-40 glow-green-sm"
          >
            {searching ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : "Verify"}
          </button>
        </div>

        {/* Quick lookup buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <p className="w-full text-xs text-muted-foreground mb-1">Try a demo agent:</p>
          {MOCK_AGENTS.map((a) => (
            <button key={a.id} onClick={() => { setQuery(a.id); }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-border hover:border-green/40 hover:text-green transition-colors font-mono">
              {a.id}
            </button>
          ))}
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && result !== "not-found" && (
            <motion.div key="found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-xl border border-green/30 bg-card mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full border-2 border-green bg-green/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green" />
                </div>
                <div>
                  <p className="font-bold text-green text-sm">Verified AgentID Credential Found</p>
                  <p className="text-xs text-muted-foreground">On-chain credential confirmed · Solana devnet</p>
                </div>
                <div className={`ml-auto text-xs px-2.5 py-1 rounded-full border font-medium ${
                  result.verifiedLevel === "Audited" ? "border-green/40 bg-green/10 text-green" :
                  result.verifiedLevel === "KYB" ? "border-blue-accent/40 bg-blue-accent/10 text-blue-accent" :
                  "border-border text-muted-foreground"
                }`}>{result.verifiedLevel}</div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {[
                  { label: "Agent Name", value: result.name, mono: true },
                  { label: "Agent ID", value: result.id, mono: true },
                  { label: "Framework", value: result.framework, mono: true },
                  { label: "LLM Model", value: result.llmModel },
                  { label: "Owner Wallet", value: truncateWallet(result.ownerWallet), mono: true },
                  { label: "Reputation Score", value: `${result.reputationScore} / 1000`, color: result.reputationScore > 700 ? "green" : "amber" },
                  { label: "Last Active", value: new Date(result.lastActive).toLocaleString() },
                  { label: "Total Tx Value", value: result.totalTxValue, color: "green" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className={`text-sm ${item.mono ? "font-mono" : ""} ${
                      item.color === "green" ? "text-green font-bold" :
                      item.color === "amber" ? "text-amber font-bold" : ""
                    }`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-xs text-muted-foreground mb-2 font-mono">AUTHORISED CAPABILITIES</p>
                <div className="flex flex-wrap gap-2">
                  {result.capabilities.defiTrading && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-green/10 border border-green/20 text-green">
                      <TrendingUp className="w-3 h-3" /> DeFi Trading
                    </span>
                  )}
                  {result.capabilities.paymentSending && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-accent/10 border border-blue-accent/20 text-blue-accent">
                      <Zap className="w-3 h-3" /> Payments · Max ${result.capabilities.maxUsdcTx.toLocaleString()}
                    </span>
                  )}
                  {result.capabilities.contentPublishing && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-purple-accent/10 border border-purple-accent/20 text-purple-accent">
                      <Activity className="w-3 h-3" /> Content Publishing
                    </span>
                  )}
                  {result.capabilities.dataAnalysis && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                      <Shield className="w-3 h-3" /> Data Analysis
                    </span>
                  )}
                  {!result.capabilities.defiTrading && !result.capabilities.paymentSending &&
                    !result.capabilities.contentPublishing && !result.capabilities.dataAnalysis && (
                    <span className="text-xs text-muted-foreground">No capabilities registered</span>
                  )}
                </div>
              </div>

              {result.indiaCompliance && (
                <div className="mb-5 px-4 py-3 rounded-lg border border-amber/20 bg-amber/5">
                  <p className="text-xs text-amber font-mono mb-1">India Compliance Verified</p>
                  <p className="text-xs text-muted-foreground">GSTIN: <span className="font-mono text-foreground">{result.indiaCompliance.gstin}</span> · TDS: <span className="text-amber font-bold">{result.indiaCompliance.tdsRate}%</span></p>
                </div>
              )}

              <div className="flex gap-2">
                <Link to={`/agent/${result.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green/10 border border-green/30 text-green text-sm font-medium hover:bg-green/20 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Full Profile
                </Link>
                <button onClick={() => { navigator.clipboard.writeText(result.ownerWallet); toast.success("Copied!"); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors">
                  <Copy className="w-3.5 h-3.5" /> Copy Wallet
                </button>
              </div>
            </motion.div>
          )}

          {result === "not-found" && (
            <motion.div key="notfound" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-6 rounded-xl border border-destructive/30 bg-destructive/5 mb-8">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="font-bold text-destructive">No AgentID Credential Found</p>
                  <p className="text-sm text-muted-foreground mt-0.5">This wallet / ID has no registered AgentID on Solana devnet.</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Want to register this agent?{" "}
                <Link to="/register" className="text-green hover:underline">Mint a credential →</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Embed Widget */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-blue-accent" />
            <h3 className="font-semibold text-sm">Embed This Widget</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Drop the AgentID verification widget into any DeFi protocol, DAO front-end, or marketplace to verify agents before granting access.
          </p>
          <div className="relative">
            <pre className="text-xs font-mono p-4 rounded-lg bg-secondary border border-border overflow-x-auto text-muted-foreground whitespace-pre">
              {EMBED_SNIPPET}
            </pre>
            <button
              onClick={() => { navigator.clipboard.writeText(EMBED_SNIPPET); toast.success("Snippet copied!"); }}
              className="absolute top-2 right-2 p-1.5 rounded border border-border bg-background hover:bg-secondary transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green" />
              Supports dark & light themes
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-accent" />
              Zero-dependency embed
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-accent" />
              Apache 2.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import {
  ChevronRight, ChevronLeft, Wallet, Zap, CheckCircle2, ExternalLink,
  Copy, AlertCircle, Shield, Star, Layers, Code2
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

const STEPS = ["Basic Info", "Capabilities", "India Compliance", "Mint Credential"];

const FRAMEWORKS = ["ELIZA", "AutoGen", "CrewAI", "LangGraph", "Custom"];
const MODELS = ["Claude 3.5 Sonnet", "GPT-4o", "Llama 3.1", "Gemini Pro"];
const SERVICE_CATEGORIES = [
  "Information Technology Services",
  "Financial Services",
  "Consulting Services",
  "Marketing & Advertising",
  "Research & Development",
];

function generateFakeTxHash() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
  return Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function Register() {
  const { connected, publicKey, connecting, connect } = useWallet();
  const [step, setStep] = useState(0);
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const [form, setForm] = useState({
    name: "",
    framework: "",
    model: "",
    defiTrading: false,
    paymentSending: false,
    contentPublishing: false,
    dataAnalysis: false,
    maxUsdcTx: 1000,
    gstin: "",
    serviceCategory: "",
    tdsRate: 10,
    skipIndia: false,
  });

  const canProceedStep0 = form.name.trim().length >= 3 && form.framework && form.model;
  const canProceedStep1 = form.defiTrading || form.paymentSending || form.contentPublishing || form.dataAnalysis;

  const handleMint = async () => {
    setMinting(true);
    await new Promise((r) => setTimeout(r, 2800));
    const hash = generateFakeTxHash();
    setTxHash(hash);
    setMinting(false);
    setMintSuccess(true);
    toast.success("Credential minted on Solana devnet!", { description: `tx: ${hash.slice(0, 8)}...${hash.slice(-8)}` });
  };

  const tdsRate = form.serviceCategory === "Information Technology Services" ? 10 :
    form.serviceCategory === "Financial Services" ? 2 : 10;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green/30 bg-green/10 text-green text-xs font-mono mb-4">
            <Zap className="w-3.5 h-3.5" /> Register Agent on Solana
          </div>
          <h1 className="text-3xl font-bold mb-2">Mint Your Agent Credential</h1>
          <p className="text-muted-foreground text-sm">Soul-bound cNFT · Takes &lt; 2 minutes · No whitelisting required</p>
        </div>

        {/* Wallet gate */}
        {!connected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-xl border border-amber/30 bg-amber/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber mb-1">Wallet required</p>
                <p className="text-sm text-muted-foreground mb-4">Connect your Solana wallet to mint a credential. Your wallet becomes the owner of the agent identity.</p>
                <div className="flex gap-3">
                  {(["phantom", "solflare"] as const).map((p) => (
                    <button key={p} onClick={() => connect(p)} disabled={connecting}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green text-primary-foreground text-sm font-semibold hover:bg-green/90 transition-colors disabled:opacity-50">
                      {connecting ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> :
                        <Wallet className="w-4 h-4" />}
                      {p === "phantom" ? "👻 Phantom" : "☀️ Solflare"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {connected && (
          <div className="mb-6 px-4 py-2.5 rounded-lg border border-green/30 bg-green/5 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
            <span className="text-green font-mono text-xs">{publicKey}</span>
            <span className="text-muted-foreground ml-auto text-xs">Connected ✓</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex items-center gap-1.5 text-xs font-medium ${
                i === step ? "text-green" : i < step ? "text-muted-foreground" : "text-muted-foreground/40"
              }`}>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                  i < step ? "bg-green border-green text-primary-foreground" :
                  i === step ? "border-green text-green bg-green/10" :
                  "border-border"
                }`}>
                  {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div className="h-full bg-green rounded-full"
              animate={{ width: `${((step) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Step content */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <AnimatePresence mode="wait">
            {/* Step 0: Basic Info */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-6">
                  <Code2 className="w-5 h-5 text-green" />
                  <h2 className="text-lg font-bold">Basic Information</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Agent Name <span className="text-destructive">*</span></label>
                    <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. TradingBot-Alpha"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-secondary text-sm font-mono focus:outline-none focus:border-green/50 focus:ring-1 focus:ring-green/30 transition-colors placeholder:text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">3–32 characters. This name is stored on-chain.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Framework <span className="text-destructive">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {FRAMEWORKS.map((f) => (
                        <button key={f} onClick={() => setForm(fm => ({ ...fm, framework: f }))}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-mono transition-colors ${
                            form.framework === f ? "border-green bg-green/10 text-green" : "border-border hover:border-green/40"
                          }`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LLM Model <span className="text-destructive">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {MODELS.map((m) => (
                        <button key={m} onClick={() => setForm(fm => ({ ...fm, model: m }))}
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                            form.model === m ? "border-blue-accent bg-blue-accent/10 text-blue-accent" : "border-border hover:border-blue-accent/40"
                          }`}>{m}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Capabilities */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-6">
                  <Layers className="w-5 h-5 text-blue-accent" />
                  <h2 className="text-lg font-bold">Agent Capabilities</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Define what this agent is authorised to do. These capabilities are attested on-chain and visible to protocols that integrate AgentID.
                </p>
                <div className="space-y-4">
                  {[
                    { key: "defiTrading" as const, label: "DeFi Trading", desc: "Execute swaps, provide liquidity, manage positions", color: "green" },
                    { key: "paymentSending" as const, label: "Payment Sending", desc: "Transfer USDC/SOL to whitelisted addresses", color: "blue-accent" },
                    { key: "contentPublishing" as const, label: "Content Publishing", desc: "Publish text, images, or data to IPFS/Arweave", color: "purple-accent" },
                    { key: "dataAnalysis" as const, label: "Data Analysis", desc: "Read-only access to on-chain data and APIs", color: "amber" },
                  ].map((cap) => (
                    <div key={cap.key} onClick={() => setForm(f => ({ ...f, [cap.key]: !f[cap.key] }))}
                      className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                        form[cap.key] ? "border-green/40 bg-green/5" : "border-border hover:border-border/80"
                      }`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        form[cap.key] ? "border-green bg-green" : "border-muted-foreground"
                      }`}>
                        {form[cap.key] && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{cap.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{cap.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {form.paymentSending && (
                  <div className="mt-6 p-4 rounded-lg border border-border bg-secondary/50">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium">Max USDC per transaction</label>
                      <span className="text-green font-mono font-bold">${form.maxUsdcTx.toLocaleString()}</span>
                    </div>
                    <Slider value={[form.maxUsdcTx]} onValueChange={(v) => setForm(f => ({ ...f, maxUsdcTx: v[0] }))}
                      min={100} max={50000} step={100} className="[&_[role=slider]]:border-green [&_.bg-primary]:bg-green" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>$100</span><span>$50,000</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: India Compliance */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-amber" />
                  <h2 className="text-lg font-bold">India Compliance</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground ml-auto">Optional</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  For Indian businesses: provide GSTIN to enable automatic TDS deduction on USDC payments. Your credentials are verified by CA partner nodes on-chain.
                </p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">GSTIN</label>
                    <input value={form.gstin}
                      onChange={(e) => setForm(f => ({ ...f, gstin: e.target.value.toUpperCase() }))}
                      placeholder="27AAPFU0939F1ZV"
                      maxLength={15}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-secondary text-sm font-mono focus:outline-none focus:border-amber/50 focus:ring-1 focus:ring-amber/30 transition-colors placeholder:text-muted-foreground uppercase" />
                    <p className="text-xs text-muted-foreground mt-1">15-character GSTIN format</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Category</label>
                    <select value={form.serviceCategory}
                      onChange={(e) => setForm(f => ({ ...f, serviceCategory: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:border-amber/50 transition-colors">
                      <option value="">Select category…</option>
                      {SERVICE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  {form.serviceCategory && (
                    <div className="p-4 rounded-lg border border-amber/20 bg-amber/5">
                      <p className="text-xs text-amber font-mono mb-3">CALCULATED TDS RATE</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">
                            {form.serviceCategory === "Financial Services" ? "Section 194A" : "Section 194J"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {form.serviceCategory === "Financial Services" ? "Interest / Finance" : "Professional / Technical Services"}
                          </p>
                        </div>
                        <div className="text-3xl font-bold font-mono text-amber">{tdsRate}%</div>
                      </div>
                    </div>
                  )}
                  <button onClick={() => setForm(f => ({ ...f, skipIndia: true }))}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
                    Skip — this is not an Indian business
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Mint */}
            {step === 3 && !mintSuccess && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-purple-accent" />
                  <h2 className="text-lg font-bold">Mint Credential</h2>
                </div>

                {/* cNFT Preview Card */}
                <div className="mb-6 p-5 rounded-xl border border-green/30 bg-gradient-to-br from-green/5 to-blue-accent/5 glow-green">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green/30 to-blue-accent/30 border border-green/40 flex items-center justify-center font-mono font-bold text-green text-lg">
                      {(form.name || "AG").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-muted-foreground">AgentID Protocol</div>
                      <div className="text-xs font-mono text-green">Solana Devnet</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold font-mono mb-1">{form.name || "Unnamed Agent"}</h3>
                  <div className="flex gap-2 flex-wrap mb-4">
                    <span className="text-xs px-2 py-0.5 rounded bg-green/10 border border-green/20 text-green font-mono">{form.framework}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-accent/10 border border-blue-accent/20 text-blue-accent">{form.model}</span>
                    {form.gstin && <span className="text-xs px-2 py-0.5 rounded bg-amber/10 border border-amber/20 text-amber font-mono">GSTIN Verified</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {form.defiTrading && <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">DeFi</span>}
                    {form.paymentSending && <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Payments</span>}
                    {form.contentPublishing && <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Content</span>}
                    {form.dataAnalysis && <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Data</span>}
                    {form.paymentSending && <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-mono">Max ${form.maxUsdcTx.toLocaleString()} USDC</span>}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground border-t border-border pt-3">
                    Owner: {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-6 text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Network</span><span className="font-mono text-green">Solana Devnet</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Mint fee</span><span className="font-mono">~0.000005 SOL</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Token type</span><span className="font-mono">cNFT (Compressed)</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Transferable</span><span className="font-mono text-amber">Non-transferable</span></div>
                </div>

                <button onClick={handleMint} disabled={minting || !connected}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-lg bg-green text-primary-foreground font-bold text-sm hover:bg-green/90 transition-colors disabled:opacity-50 glow-green-sm">
                  {minting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Minting on Solana...
                    </>
                  ) : (
                    <><Zap className="w-4 h-4" /> Mint Soul-Bound Credential</>
                  )}
                </button>
              </motion.div>
            )}

            {/* Success */}
            {mintSuccess && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 rounded-full bg-green/20 border-2 border-green flex items-center justify-center mx-auto mb-6 glow-green">
                  <CheckCircle2 className="w-8 h-8 text-green" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Credential Minted! 🎉</h2>
                <p className="text-muted-foreground text-sm mb-6">Your agent identity is now live on Solana devnet</p>

                <div className="p-4 rounded-lg bg-secondary border border-border text-left mb-6">
                  <p className="text-xs text-muted-foreground font-mono mb-1">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-green flex-1 break-all">{txHash}</code>
                    <button onClick={() => { navigator.clipboard.writeText(txHash); toast.success("Copied!"); }}
                      className="shrink-0 p-1.5 rounded border border-border hover:bg-secondary transition-colors">
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-green/40 text-green hover:bg-green/10 transition-colors text-sm font-medium">
                    <ExternalLink className="w-4 h-4" /> View on Solana Explorer
                  </a>
                  <Link to="/agent/agent-001"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green text-primary-foreground font-bold text-sm hover:bg-green/90 transition-colors">
                    View Agent Profile <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {!mintSuccess && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={step === 0 ? !canProceedStep0 : step === 1 ? !canProceedStep1 : false}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green text-primary-foreground text-sm font-semibold hover:bg-green/90 transition-colors disabled:opacity-40">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

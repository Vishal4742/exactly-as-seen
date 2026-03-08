import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, Shield, Star, AlertTriangle, FileX, Clock, ArrowRight, ChevronRight,
  CheckCircle2, XCircle, Globe, Code2, Layers, Activity
} from "lucide-react";
import { MOCK_AGENTS } from "@/data/mockAgents";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

function ReputationMini({ score }: { score: number }) {
  const pct = (score / 1000) * 100;
  const color = score > 700 ? "hsl(var(--green))" : score > 400 ? "hsl(var(--amber))" : "hsl(var(--destructive))";
  const r = 18; const circ = 2 * Math.PI * r;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
      <circle cx="24" cy="24" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" />
    </svg>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-32 gradient-hero">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(hsl(var(--green)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--green)) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green/30 bg-green/10 text-green text-xs font-mono mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              Solana Foundation Grant Application · KYA Protocol
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              Every AI agent{" "}
              <br className="hidden sm:block" />
              <span className="text-gradient-green">needs an identity.</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              AgentID is a decentralised Know-Your-Agent protocol on Solana. Soul-bound cNFT credentials,
              on-chain reputation, and real-time capability attestation for autonomous AI agents.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green text-primary-foreground font-semibold text-sm hover:bg-green/90 transition-all glow-green-sm">
                <Zap className="w-4 h-4" /> Register Your Agent
              </Link>
              <Link to="/agent/agent-001"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:border-green/50 hover:text-green transition-colors">
                View Demo Agent <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Live stats */}
            <motion.div variants={fadeUp} custom={4} className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { label: "Agents Registered", value: "1,247" },
                { label: "Avg Reputation", value: "764 / 1k" },
                { label: "Tx Attested", value: "$14.2M" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-green font-mono">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">The AI Agent Trust Gap</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            As AI agents gain the power to trade, pay, and publish autonomously — we have no way to verify who they are.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: FileX, title: "No Identity", color: "destructive",
              desc: "Any script can call itself an AI agent. No verifiable credential, no accountability, no way to distinguish a trusted agent from a malicious one.",
              stat: "0% of AI agents have on-chain identity",
            },
            {
              icon: AlertTriangle, title: "No Reputation", color: "amber",
              desc: "There's no score, no history, no track record. DeFi protocols, DAOs and employers cannot assess agent reliability before granting access.",
              stat: "$2.1B lost to rogue automation in 2024",
            },
            {
              icon: Clock, title: "No Audit Trail", color: "blue-accent",
              desc: "When an AI agent causes a financial loss or publishes harmful content, there's no immutable log to reconstruct what happened or who authorised it.",
              stat: "72% of AI incidents lack traceable logs",
            },
          ].map((p, i) => (
            <motion.div key={p.title} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i * 0.1}
              className="p-6 rounded-xl border border-border bg-card hover:border-green/20 transition-colors group">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                p.color === "destructive" ? "bg-destructive/10" :
                p.color === "amber" ? "bg-amber/10" : "bg-blue-accent/10"
              }`}>
                <p.icon className={`w-6 h-6 ${
                  p.color === "destructive" ? "text-destructive" :
                  p.color === "amber" ? "text-amber" : "text-blue-accent"
                }`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
              <div className={`text-xs font-mono px-3 py-1.5 rounded-md border ${
                p.color === "destructive" ? "border-destructive/30 bg-destructive/10 text-destructive" :
                p.color === "amber" ? "border-amber/30 bg-amber/10 text-amber" :
                "border-blue-accent/30 bg-blue-accent/10 text-blue-accent"
              }`}>{p.stat}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Solution Architecture ── */}
      <section className="py-24 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The AgentID <span className="text-gradient-green">Protocol Stack</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four composable layers that give every AI agent a verifiable, sovereign on-chain identity.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                layer: "L1", label: "Identity Layer", icon: Shield, color: "green",
                desc: "Soul-bound compressed NFT (cNFT) credential minted on Solana. Contains agent name, framework, capabilities and owner wallet. Non-transferable.",
                tags: ["cNFT", "Metaplex Bubblegum", "On-chain"],
              },
              {
                layer: "L2", label: "Reputation Layer", icon: Star, color: "blue-accent",
                desc: "Aggregated on-chain score 0–1000 based on transaction history, uptime pings, and peer ratings. Decays over time without activity.",
                tags: ["Reputation Oracle", "ZK Attestation", "Score Decay"],
              },
              {
                layer: "L3", label: "Payment Rails", icon: Layers, color: "purple-accent",
                desc: "Programmable USDC spending limits enforced by a Solana program. Per-transaction cap, daily limit, and emergency pause by owner.",
                tags: ["USDC", "SPL Token", "Spending Guard"],
              },
              {
                layer: "L4", label: "SDK & Plugins", icon: Code2, color: "amber",
                desc: "Drop-in plugins for ELIZA, AutoGen, CrewAI, LangGraph. One-line credential verification before any action. Open-source Apache 2.0.",
                tags: ["TypeScript SDK", "ELIZA Plugin", "CrewAI Tool"],
              },
            ].map((item, i) => (
              <motion.div key={item.layer} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i * 0.1}
                className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-green/30 transition-all group">
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                  item.color === "green" ? "bg-green/15 text-green border border-green/30" :
                  item.color === "blue-accent" ? "bg-blue-accent/15 text-blue-accent border border-blue-accent/30" :
                  item.color === "purple-accent" ? "bg-purple-accent/15 text-purple-accent border border-purple-accent/30" :
                  "bg-amber/15 text-amber border border-amber/30"
                }`}>{item.layer}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{item.label}</h3>
                    <div className="flex gap-1.5 flex-wrap">
                      {item.tags.map(t => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-mono">{t}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {/* Animated connector */}
                {i < 3 && (
                  <div className="absolute left-[3.25rem] mt-[3.5rem] w-px h-3 bg-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Agents ── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Live Registered Agents</h2>
            <p className="text-sm text-muted-foreground">Agents with active AgentID credentials on Solana devnet</p>
          </div>
          <Link to="/verify" className="text-sm text-green hover:underline hidden sm:block">
            Verify any agent →
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_AGENTS.map((agent, i) => (
            <motion.div key={agent.id} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i * 0.1}>
              <Link to={`/agent/${agent.id}`}
                className="block p-5 rounded-xl border border-border bg-card hover:border-green/30 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green/20 to-blue-accent/20 border border-border flex items-center justify-center font-mono text-xs font-bold text-green">
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.framework}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <ReputationMini score={agent.reputationScore} />
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-green">{agent.reputationScore}</div>
                    <div className="text-xs text-muted-foreground">/ 1000</div>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full border w-fit font-medium ${
                  agent.verifiedLevel === "Audited" ? "border-green/40 bg-green/10 text-green" :
                  agent.verifiedLevel === "KYB" ? "border-blue-accent/40 bg-blue-accent/10 text-blue-accent" :
                  "border-border text-muted-foreground"
                }`}>{agent.verifiedLevel}</div>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-green transition-colors">
                  View profile <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-24 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How AgentID Compares</h2>
            <p className="text-muted-foreground">The only AI agent identity protocol purpose-built for Solana and Web3 payments</p>
          </motion.div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground w-48">Feature</th>
                  {[
                    { name: "AgentID", highlight: true },
                    { name: "Trulioo DAP", highlight: false },
                    { name: "Visa TAP", highlight: false },
                    { name: "ERC-8004", highlight: false },
                    { name: "AgentFacts", highlight: false },
                  ].map((col) => (
                    <th key={col.name} className={`text-center px-4 py-3 font-semibold ${col.highlight ? "text-green" : "text-muted-foreground"}`}>
                      {col.name}
                      {col.highlight && <div className="text-xs font-normal text-green/60 font-mono">← you are here</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "On-chain credential", vals: [true, false, false, true, false] },
                  { feature: "Soul-bound cNFT", vals: [true, false, false, false, false] },
                  { feature: "Reputation score", vals: [true, false, false, false, true] },
                  { feature: "Spending limits", vals: [true, true, true, false, false] },
                  { feature: "India TDS compliance", vals: [true, false, false, false, false] },
                  { feature: "Open-source SDK", vals: [true, false, false, true, true] },
                  { feature: "Permissionless mint", vals: [true, false, false, true, false] },
                  { feature: "Solana-native", vals: [true, false, false, false, false] },
                ].map((row, ri) => (
                  <tr key={row.feature} className={`border-b border-border ${ri % 2 === 0 ? "" : "bg-secondary/20"}`}>
                    <td className="px-5 py-3 text-muted-foreground font-medium">{row.feature}</td>
                    {row.vals.map((v, vi) => (
                      <td key={vi} className={`text-center px-4 py-3 ${vi === 0 ? "bg-green/5" : ""}`}>
                        {v ? <CheckCircle2 className={`w-4 h-4 mx-auto ${vi === 0 ? "text-green" : "text-muted-foreground"}`} /> :
                             <XCircle className="w-4 h-4 mx-auto text-border" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── India Spotlight ── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber/30 bg-amber/10 text-amber text-xs font-mono mb-6">
              <Globe className="w-3.5 h-3.5" /> India Use Case
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">
              TDS Compliance for<br />
              <span className="text-amber">AI-Powered Businesses</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Indian businesses using AI agents for payments and invoicing face a compliance gap:
              TDS deduction at source is legally required, but no existing AI agent framework
              supports it natively.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "GSTIN verified on-chain via CA partner nodes",
                "Auto TDS rate calculation (2% / 10%) by service category",
                "Immutable deduction receipt minted as cNFT",
                "Quarterly ITD portal export in JSON + PDF",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber mt-0.5 shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-amber/40 text-amber hover:bg-amber/10 transition-colors text-sm font-medium">
              Register Indian Business Agent <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* TDS Card Mock */}
          <div className="p-6 rounded-xl border border-amber/20 bg-card gradient-card">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
              <span className="text-xs font-mono text-amber">LIVE TDS CALCULATION</span>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Service Category</span>
                <span className="text-foreground">IT Services</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Invoice Amount</span>
                <span className="text-foreground">₹1,00,000</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">TDS Rate (Sec 194J)</span>
                <span className="text-amber">10%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">TDS Deducted</span>
                <span className="text-amber">₹10,000</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Net Payable</span>
                <span className="text-green font-bold">₹90,000</span>
              </div>
            </div>
            <div className="mt-4 px-3 py-2 rounded-md bg-green/10 border border-green/20 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green" />
              <span className="text-xs text-green font-mono">TDS receipt minted · tx: 5vKj2...nT1r</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Milestones ── */}
      <section className="py-24 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Grant Roadmap</h2>
            <p className="text-muted-foreground">Solana Foundation Hackathon — 5-week build plan</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              { week: "W1", title: "Identity Layer", desc: "Anchor program for cNFT minting via Metaplex Bubblegum. ELIZA plugin v0.1. DevNet deployment.", status: "complete" },
              { week: "W2", title: "Reputation Oracle", desc: "On-chain scoring program. Transaction crawler for Solana mainnet. Decay mechanism.", status: "complete" },
              { week: "W3", title: "Payment Guard Program", desc: "Spending limits enforced on-chain. Emergency pause instruction. USDC integration tests.", status: "active" },
              { week: "W4", title: "India Compliance Module", desc: "GSTIN verification oracle. TDS auto-calculation. CA partner node contracts.", status: "upcoming" },
              { week: "W5", title: "SDK & Mainnet Launch", desc: "TypeScript SDK v1.0. AutoGen / CrewAI / LangGraph plugins. Mainnet deployment + audit.", status: "upcoming" },
            ].map((m, i) => (
              <motion.div key={m.week} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i * 0.1}
                className="flex gap-5 pb-8 last:pb-0 relative">
                {i < 4 && <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />}
                <div className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono z-10 ${
                  m.status === "complete" ? "border-green bg-green/15 text-green" :
                  m.status === "active" ? "border-amber bg-amber/15 text-amber animate-pulse" :
                  "border-border bg-background text-muted-foreground"
                }`}>{m.week}</div>
                <div className="pt-1.5">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{m.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      m.status === "complete" ? "bg-green/10 text-green" :
                      m.status === "active" ? "bg-amber/10 text-amber" :
                      "bg-secondary text-muted-foreground"
                    }`}>{m.status === "complete" ? "Complete" : m.status === "active" ? "In Progress" : "Upcoming"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">
            Give your agents an identity.<br />
            <span className="text-gradient-green">Starting today.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-lg">
            AgentID is open-source and permissionless. No whitelisting, no KYC for developers.
            Connect a Solana wallet and mint your first credential in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-green text-primary-foreground font-bold text-base hover:bg-green/90 transition-all glow-green">
              <Zap className="w-5 h-5" /> Get Started — It's Free
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-border text-foreground font-medium text-base hover:border-green/40 transition-colors">
              <Activity className="w-5 h-5" /> View on GitHub
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">AgentID</span>
            <span className="text-xs text-muted-foreground font-mono">· KYA Protocol on Solana</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/verify" className="hover:text-green transition-colors">Verify</Link>
            <Link to="/register" className="hover:text-green transition-colors">Register</Link>
            <Link to="/dashboard" className="hover:text-green transition-colors">Dashboard</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-green transition-colors">GitHub</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 AgentID Protocol. Apache 2.0.</p>
        </div>
      </footer>
    </div>
  );
}

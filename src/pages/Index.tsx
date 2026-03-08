import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, Shield, Star, AlertTriangle, FileX, Clock, ArrowRight, ChevronRight,
  CheckCircle2, XCircle, Globe, Code2, Layers, Activity
} from "lucide-react";
import { MOCK_AGENTS } from "@/data/mockAgents";
import AsciiCanvas from "@/components/AsciiCanvas";
import ScrambleText from "@/components/ScrambleText";

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

      {/* ── Hero: ASCII Canvas ── */}
      <section className="relative flex flex-col" style={{ height: "100vh" }}>

        {/* ASCII canvas fills top ~65% */}
        <div className="flex-1 relative border-b border-border/40 overflow-hidden">
          <AsciiCanvas />

          {/* Corner labels */}
          <div className="absolute top-20 left-6 z-10 pointer-events-none select-none hidden md:block">
            <span className="font-bold text-2xl text-foreground/80 tracking-tight">A</span>
          </div>
          <div className="absolute top-20 right-6 z-10 pointer-events-none select-none hidden md:block">
            <span className="font-bold text-2xl text-foreground/80 tracking-tight">I</span>
          </div>

          {/* Grant badge */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green/30 bg-background/60 backdrop-blur-sm text-green text-xs font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              Solana Foundation Grant · KYA Protocol
            </div>
          </div>

          {/* Hero text pinned to bottom-left, reference style */}
          <div className="absolute bottom-8 left-6 z-10 max-w-2xl">
            <ScrambleText
              as="h1"
              text="Every AI agent needs an identity."
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-3 cursor-default"
              autoPlay
              autoPlayDelay={300}
            />
            <p className="font-mono text-xs text-muted-foreground">
              Soul-bound cNFT credentials · On-chain reputation · Solana devnet
            </p>
          </div>

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>

        {/* Info panel: bottom ~35% */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-6 border-b border-border/40 bg-background/95 backdrop-blur-sm" style={{ minHeight: "30vh" }}>

          {/* Col 1: description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
              <span>AgentID Protocol</span>
              <span className="text-green/50">·</span>
              <span>v0.1 devnet</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Decentralised Know-Your-Agent protocol on Solana. Every autonomous AI agent
              gets a verifiable, soul-bound on-chain identity — with reputation, spending guards,
              and India TDS compliance built in.
            </p>
            <p className="text-xs text-muted-foreground/50 mt-auto font-mono">
              Open-source · Apache 2.0 · Permissionless
            </p>
          </div>

          {/* Col 2: CTAs + live stats */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <Link to="/register"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green text-primary-foreground font-semibold text-sm hover:bg-green/90 transition-all glow-green-sm">
                <Zap className="w-4 h-4" />
                <ScrambleText as="span" text="Register Agent" />
              </Link>
              <Link to="/agent/agent-001"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:border-green/50 hover:text-green transition-colors">
                <ScrambleText as="span" text="View Demo" />
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Agents", value: "1,247" },
                { label: "Avg Rep", value: "764" },
                { label: "Tx Value", value: "$14M" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold text-green font-mono">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: nav links with slide-underline */}
          <div className="flex flex-col justify-between">
            <ul className="space-y-2">
              {[
                { label: "Verify any agent", href: "/verify" },
                { label: "Owner Dashboard", href: "/dashboard" },
                { label: "View on GitHub", href: "https://github.com" },
                { label: "Documentation", href: "#docs" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href}
                    className="group relative text-sm text-muted-foreground hover:text-foreground transition-colors inline-block w-fit">
                    {label}
                    <span className="absolute bottom-0 left-0 w-full h-px bg-foreground scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs font-mono text-muted-foreground/30 mt-4 hidden md:block">
              © 2025 AgentID
            </p>
          </div>
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
          <Link to="/verify" className="group relative text-sm text-green hidden sm:inline-block">
            Verify any agent →
            <span className="absolute bottom-0 left-0 w-full h-px bg-green scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
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
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-amber/40 text-amber hover:bg-amber/10 transition-colors text-sm font-medium">
              Register Indian Business Agent <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

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
          <div className="flex items-center gap-6 text-sm">
            {[
              { label: "Verify", href: "/verify" },
              { label: "Register", href: "/register" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "GitHub", href: "https://github.com" },
            ].map(({ label, href }) => (
              <Link key={label} to={href}
                className="group relative text-muted-foreground hover:text-foreground transition-colors">
                {label}
                <span className="absolute bottom-0 left-0 w-full h-px bg-foreground scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">© 2025 AgentID Protocol. Apache 2.0.</p>
        </div>
      </footer>
    </div>
  );
}

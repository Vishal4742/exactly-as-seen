import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { MOCK_AGENTS, truncateWallet, formatRelativeTime } from "@/data/mockAgents";
import { toast } from "sonner";
import { Shield, Activity, AlertTriangle, Wallet, ExternalLink, Play, Pause, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

function MiniGauge({ score }: { score: number }) {
  const pct = (score / 1000) * 100;
  const color = score > 700 ? "hsl(var(--green))" : score > 400 ? "hsl(var(--amber))" : "hsl(var(--destructive))";
  const r = 14; const circ = 2 * Math.PI * r;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
      <circle cx="18" cy="18" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="3.5" />
      <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3.5"
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ} strokeLinecap="round" />
    </svg>
  );
}

export default function Dashboard() {
  const { connected, publicKey, connect, connecting } = useWallet();
  const [pausedAgents, setPausedAgents] = useState<Set<string>>(new Set());
  const [spendingLimit, setSpendingLimit] = useState(5000);
  const [perTxLimit, setPerTxLimit] = useState(1000);

  const userAgents = MOCK_AGENTS.slice(0, 3);

  if (!connected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm w-full text-center">
          <p className="label-meta mb-6">Dashboard · Wallet Gated</p>
          <h2 className="display-serif text-3xl text-foreground mb-4">Connect Your Wallet.</h2>
          <p className="text-sm text-muted-foreground mb-8">Phantom or Solflare required to manage your registered agents.</p>
          <div className="flex gap-3 justify-center">
            {(["phantom", "solflare"] as const).map((p) => (
              <button key={p} onClick={() => connect(p)} disabled={connecting}
                className="btn-primary disabled:opacity-50">
                {connecting ? <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Wallet className="w-3.5 h-3.5" />}
                {p === "phantom" ? "👻 Phantom" : "☀️ Solflare"}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const togglePause = (agentId: string, name: string) => {
    const newSet = new Set(pausedAgents);
    if (newSet.has(agentId)) { newSet.delete(agentId); toast.success(`${name} resumed`); }
    else { newSet.add(agentId); toast(`${name} paused`, { icon: "⏸️" }); }
    setPausedAgents(newSet);
  };

  const avgReputation = Math.round(userAgents.reduce((s, a) => s + a.reputationScore, 0) / userAgents.length);

  return (
    <div className="min-h-screen bg-background px-6 lg:px-10 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* ── Page header ── */}
        <div className="flex justify-between items-baseline border-b border-border pb-3 mb-12 pt-10">
          <span className="label-meta">Index / Owner Dashboard</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green animate-pulse" />
            <span className="font-mono text-[11px] text-green">{truncateWallet(publicKey!)}</span>
          </div>
        </div>

        {/* ── Stats row — journal header style ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-b border-border mb-0">
          {[
            { label: "Total Agents", value: `${userAgents.length}`, sub: "on Solana devnet", color: "text-green" },
            { label: "Avg Reputation", value: `${avgReputation}`, sub: "out of 1,000", color: "text-blue-accent" },
            { label: "Total Tx Value", value: "$10.2M", sub: "all-time attested", color: "text-purple-accent" },
            { label: "Active Alerts", value: "1", sub: "spending limit warning", color: "text-amber" },
          ].map((s, i) => (
            <div key={s.label} className={`py-6 ${i > 0 ? "border-l border-border pl-6" : ""}`}>
              <p className="label-meta mb-2">{s.label}</p>
              <p className={`font-mono text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="label-meta mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-0">
          {/* ── Agent journal list ── */}
          <div className="lg:col-span-2 lg:pr-10 lg:border-r border-border py-10">
            <div className="flex justify-between items-baseline border-b border-border pb-3 mb-0">
              <p className="label-meta">My Agents</p>
              <Link to="/register" className="label-meta link-underline text-green hover:text-green">
                <Plus className="w-3 h-3 inline mr-1" /> Register New
              </Link>
            </div>

            <ul>
              {userAgents.map((agent, i) => {
                const isPaused = pausedAgents.has(agent.id);
                const previewText = `${agent.framework} · ${agent.llmModel} · ${agent.totalTxValue} · last active ${formatRelativeTime(agent.lastActive)}`;
                return (
                  <motion.li key={agent.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                    className="group">
                    <div
                      className="grid items-center py-5 border-b transition-colors duration-300"
                      style={{ gridTemplateColumns: "96px 1fr auto", borderColor: isPaused ? "hsl(var(--destructive)/0.25)" : "hsl(var(--border))" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = isPaused ? "hsl(var(--destructive)/0.5)" : "hsl(var(--foreground)/0.3)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = isPaused ? "hsl(var(--destructive)/0.25)" : "hsl(var(--border))"; }}
                    >
                      <span className="font-mono text-[11px] text-muted-foreground/50 select-none">
                        {new Date(agent.registeredAt).toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, ".")}
                      </span>

                      <div className="min-w-0">
                        <span className={`font-serif italic text-xl transition-transform duration-300 ease-out group-hover:translate-x-2.5 inline-block ${isPaused ? "text-destructive/60" : "text-foreground"}`}
                          style={{ fontFamily: "Georgia, serif" }}>
                          {agent.name}
                          {agent.verifiedLevel !== "Unverified" && (
                            <span className={`ml-2 text-xs not-italic font-sans ${agent.verifiedLevel === "Audited" ? "text-green/50" : "text-blue-accent/50"}`}>
                              · {agent.verifiedLevel}
                            </span>
                          )}
                          {isPaused && <span className="ml-2 text-xs not-italic font-mono text-destructive/60">PAUSED</span>}
                        </span>
                        <div className="font-mono text-[10px] text-muted-foreground/40 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {previewText}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MiniGauge score={agent.reputationScore} />
                        <div className="text-right mr-1">
                          <div className="font-mono text-xs font-bold text-green">{agent.reputationScore}</div>
                          <div className="label-meta">/1000</div>
                        </div>
                        <Link to={`/agent/${agent.id}`} className="p-1.5 border border-border hover:bg-secondary transition-colors">
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button onClick={() => togglePause(agent.id, agent.name)}
                          className={`p-1.5 border transition-colors ${isPaused ? "border-green/40 text-green hover:bg-green/10" : "border-destructive/40 text-destructive hover:bg-destructive/10"}`}>
                          {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* ── Right panel ── */}
          <div className="py-10 lg:pl-10 space-y-0">

            {/* Treasury */}
            <div className="border-b border-border pb-8 mb-8">
              <p className="label-meta mb-6">Treasury</p>
              <div className="mb-6">
                <p className="label-meta mb-1">USDC Balance</p>
                <p className="font-mono text-3xl font-bold text-green">$24,850</p>
                <p className="label-meta mt-1">Solana devnet</p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="label-meta">Daily Spend Limit</label>
                    <span className="font-mono text-xs text-green font-semibold">${spendingLimit.toLocaleString()}</span>
                  </div>
                  <Slider value={[spendingLimit]} onValueChange={(v) => setSpendingLimit(v[0])} min={500} max={25000} step={500} />
                  <div className="flex justify-between label-meta mt-2"><span>$500</span><span>$25,000</span></div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="label-meta">Per-Tx Limit</label>
                    <span className="font-mono text-xs text-blue-accent font-semibold">${perTxLimit.toLocaleString()}</span>
                  </div>
                  <Slider value={[perTxLimit]} onValueChange={(v) => setPerTxLimit(v[0])} min={100} max={10000} step={100} />
                  <div className="flex justify-between label-meta mt-2"><span>$100</span><span>$10,000</span></div>
                </div>
              </div>

              <button onClick={() => toast.success("Spending limits updated on-chain")}
                className="btn-outline w-full justify-center mt-6">Save Limits</button>
            </div>

            {/* Alert */}
            <div className="border-b border-border pb-8 mb-8">
              <p className="label-meta text-amber mb-4 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Active Alerts</p>
              <p className="text-xs font-medium mb-1">Spending limit nearing threshold</p>
              <p className="text-xs text-muted-foreground">TradingBot-Alpha used 87% of daily limit today.</p>
            </div>

            {/* Quick links */}
            <div>
              <p className="label-meta mb-4">Quick Actions</p>
              <div className="space-y-0">
                {[
                  { label: "Verify an agent", icon: Shield, href: "/verify" },
                  { label: "Browse all agents", icon: Activity, href: "/agents" },
                  { label: "Register new agent", icon: Plus, href: "/register" },
                ].map((a) => (
                  <Link key={a.label} to={a.href}
                    className="group flex items-center gap-3 py-3 border-b border-border last:border-0 hover:border-foreground/20 transition-colors">
                    <a.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-green transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{a.label}</span>
                    <span className="ml-auto label-meta opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

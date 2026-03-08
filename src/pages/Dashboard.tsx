import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { MOCK_AGENTS, truncateWallet, formatRelativeTime } from "@/data/mockAgents";
import { toast } from "sonner";
import {
  Zap, Shield, Activity, TrendingUp, AlertTriangle, Wallet,
  ChevronRight, Play, Pause, Settings, ExternalLink, Plus
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

function StatCard({ label, value, sub, color = "green" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono ${
        color === "green" ? "text-green" : color === "amber" ? "text-amber" : color === "blue" ? "text-blue-accent" : "text-purple-accent"
      }`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

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
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-8 rounded-2xl border border-border bg-card">
          <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Your dashboard is wallet-gated. Connect Phantom or Solflare to manage your registered agents.
          </p>
          <div className="flex gap-3 justify-center">
            {(["phantom", "solflare"] as const).map((p) => (
              <button key={p} onClick={() => connect(p)} disabled={connecting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green text-primary-foreground font-semibold text-sm hover:bg-green/90 transition-colors disabled:opacity-50 glow-green-sm">
                {connecting ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> :
                  <Wallet className="w-4 h-4" />}
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
    if (newSet.has(agentId)) {
      newSet.delete(agentId);
      toast.success(`${name} resumed`, { description: "Agent is now active" });
    } else {
      newSet.add(agentId);
      toast(`${name} paused`, { description: "Emergency pause activated — no tx will process", icon: "⏸️" });
    }
    setPausedAgents(newSet);
  };

  const avgReputation = Math.round(userAgents.reduce((s, a) => s + a.reputationScore, 0) / userAgents.length);
  const totalTxDisplay = "$10.2M";

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Owner Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
              <span className="font-mono">{truncateWallet(publicKey!)}</span>
              <span>· {userAgents.length} agents registered</span>
            </div>
          </div>
          <Link to="/register"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green text-primary-foreground text-sm font-semibold hover:bg-green/90 transition-colors glow-green-sm">
            <Plus className="w-4 h-4" /> Register New Agent
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Agents" value={`${userAgents.length}`} sub="on Solana devnet" color="green" />
          <StatCard label="Avg Reputation" value={`${avgReputation}`} sub="out of 1,000" color="blue" />
          <StatCard label="Total Tx Value" value={totalTxDisplay} sub="all-time attested" color="purple" />
          <StatCard label="Active Alerts" value="1" sub="spending limit warning" color="amber" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Agents */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-lg font-bold mb-4">My Agents</h2>
              <div className="space-y-4">
                {userAgents.map((agent, i) => {
                  const isPaused = pausedAgents.has(agent.id);
                  return (
                    <motion.div key={agent.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className={`p-5 rounded-xl border transition-colors ${isPaused ? "border-destructive/30 bg-destructive/5" : "border-border bg-card hover:border-green/20"}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green/20 to-blue-accent/20 border border-border flex items-center justify-center font-mono font-bold text-green text-sm shrink-0">
                          {agent.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold font-mono">{agent.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${
                              agent.verifiedLevel === "Audited" ? "border-green/30 text-green bg-green/10" :
                              agent.verifiedLevel === "KYB" ? "border-blue-accent/30 text-blue-accent bg-blue-accent/10" :
                              "border-border text-muted-foreground"
                            }`}>{agent.verifiedLevel}</span>
                            {isPaused && <span className="text-xs px-2 py-0.5 rounded-full border border-destructive/30 text-destructive bg-destructive/10">PAUSED</span>}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                            <span>{agent.framework} · {agent.llmModel}</span>
                            <span>Last active: <span className="text-green">{formatRelativeTime(agent.lastActive)}</span></span>
                            <span>{agent.totalTxValue} total</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MiniGauge score={agent.reputationScore} />
                          <div className="text-right">
                            <div className="text-sm font-bold font-mono text-green">{agent.reputationScore}</div>
                            <div className="text-xs text-muted-foreground">/1000</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link to={`/agent/${agent.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs hover:bg-secondary transition-colors">
                          <ExternalLink className="w-3 h-3" /> View Profile
                        </Link>
                        <button onClick={() => togglePause(agent.id, agent.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-colors ${
                            isPaused
                              ? "border-green/40 text-green bg-green/10 hover:bg-green/20"
                              : "border-destructive/40 text-destructive hover:bg-destructive/10"
                          }`}>
                          {isPaused ? <><Play className="w-3 h-3" /> Resume</> : <><Pause className="w-3 h-3" /> Emergency Pause</>}
                        </button>
                        <button onClick={() => toast("Coming soon: spending limit editor")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs hover:bg-secondary transition-colors ml-auto">
                          <Settings className="w-3 h-3" /> Limits
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right: Treasury */}
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-4 h-4 text-green" />
                <h3 className="font-semibold text-sm">Treasury</h3>
              </div>
              <div className="text-center mb-6">
                <p className="text-xs text-muted-foreground mb-1">USDC Balance</p>
                <p className="text-3xl font-bold font-mono text-green">$24,850</p>
                <p className="text-xs text-muted-foreground mt-1">Solana devnet</p>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Daily Spend Limit</span>
                    <span className="font-mono font-bold text-green">${spendingLimit.toLocaleString()}</span>
                  </div>
                  <Slider value={[spendingLimit]} onValueChange={(v) => setSpendingLimit(v[0])}
                    min={500} max={25000} step={500} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$500</span><span>$25,000</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Per-Tx Limit</span>
                    <span className="font-mono font-bold text-blue-accent">${perTxLimit.toLocaleString()}</span>
                  </div>
                  <Slider value={[perTxLimit]} onValueChange={(v) => setPerTxLimit(v[0])}
                    min={100} max={10000} step={100} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$100</span><span>$10,000</span>
                  </div>
                </div>
              </div>
              <button onClick={() => toast.success("Spending limits updated on-chain")}
                className="w-full mt-5 py-2 rounded-lg bg-green/10 border border-green/30 text-green text-sm font-medium hover:bg-green/20 transition-colors">
                Save Limits
              </button>
            </motion.div>

            {/* Alerts */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="p-5 rounded-xl border border-amber/20 bg-amber/5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber" />
                <h3 className="font-semibold text-sm text-amber">Active Alerts</h3>
              </div>
              <div className="space-y-3">
                <div className="text-xs space-y-1">
                  <p className="font-medium">Spending limit nearing threshold</p>
                  <p className="text-muted-foreground">TradingBot-Alpha used 87% of daily limit today.</p>
                </div>
              </div>
            </motion.div>

            {/* Quick links */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
              className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Verify an agent", icon: Shield, href: "/verify" },
                  { label: "Browse all agents", icon: Activity, href: "/agent/agent-001" },
                  { label: "Register new agent", icon: Plus, href: "/register" },
                ].map((a) => (
                  <Link key={a.label} to={a.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors group">
                    <a.icon className="w-4 h-4 text-muted-foreground group-hover:text-green transition-colors" />
                    <span>{a.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

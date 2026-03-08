import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { getAgentById, truncateWallet, formatRelativeTime, MOCK_AGENTS } from "@/data/mockAgents";
import { toast } from "sonner";
import {
  Copy, Share2, Shield, Star, Activity, Zap, AlertTriangle, ChevronRight,
  CheckCircle2, ExternalLink, Clock, TrendingUp, Wallet
} from "lucide-react";

function ReputationGauge({ score }: { score: number }) {
  const size = 160;
  const strokeWidth = 12;
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const angle = 220;
  const total = (angle / 360) * circ;
  const filled = (score / 1000) * total;
  const startAngle = 160;
  const color = score > 700 ? "hsl(var(--green))" : score > 400 ? "hsl(var(--amber))" : "hsl(var(--destructive))";

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={strokeWidth}
          strokeDasharray={`${total} ${circ - total}`}
          strokeDashoffset={-((startAngle / 360) * circ)}
          strokeLinecap="round" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeDashoffset={-((startAngle / 360) * circ)}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${filled} ${circ - filled}` }}
          transition={{ duration: 1.5, ease: "easeOut" }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold font-mono" style={{ color }}>{score}</div>
        <div className="text-xs text-muted-foreground">/ 1000</div>
      </div>
    </div>
  );
}

const ACTIVITY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  defi_trade: TrendingUp,
  payment: Zap,
  content: Activity,
  audit: Shield,
  registration: CheckCircle2,
};

export default function AgentProfile() {
  const { id } = useParams<{ id: string }>();
  const agent = getAgentById(id || "");
  const { connected } = useWallet();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [rated, setRated] = useState(false);

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2">Agent Not Found</h2>
          <p className="text-muted-foreground mb-6">No agent with ID: <code className="font-mono">{id}</code></p>
          <div className="flex flex-wrap gap-3 justify-center">
            {MOCK_AGENTS.slice(0, 4).map(a => (
              <Link key={a.id} to={`/agent/${a.id}`}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-green/40 text-sm transition-colors">
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitRating = () => {
    if (!connected) { toast.error("Connect wallet to rate agents"); return; }
    if (!rating) { toast.error("Select a star rating first"); return; }
    setRated(true);
    toast.success(`Rated ${rating} ⭐ — submitted on-chain`);
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(agent.ownerWallet);
    toast.success("Owner address copied!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied!");
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-green transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Agent Profile</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-mono">{agent.id}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Identity Card */}
          <div className="lg:col-span-1 space-y-5">
            {/* Identity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green/20 to-blue-accent/20 border-2 border-green/30 flex items-center justify-center text-xl font-bold font-mono text-green">
                  {agent.name.slice(0, 2).toUpperCase()}
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                  agent.verifiedLevel === "Audited" ? "border-green/40 bg-green/10 text-green" :
                  agent.verifiedLevel === "KYB" ? "border-blue-accent/40 bg-blue-accent/10 text-blue-accent" :
                  "border-border text-muted-foreground"
                }`}>
                  {agent.verifiedLevel === "Audited" && <Shield className="w-3 h-3 inline mr-1" />}
                  {agent.verifiedLevel}
                </div>
              </div>

              <h1 className="text-xl font-bold font-mono mb-1">{agent.name}</h1>
              <p className="text-sm text-muted-foreground mb-4">Agent ID: <span className="font-mono">{agent.id}</span></p>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-xs px-2 py-1 rounded-md bg-green/10 border border-green/20 text-green font-mono">{agent.framework}</span>
                <span className="text-xs px-2 py-1 rounded-md bg-blue-accent/10 border border-blue-accent/20 text-blue-accent">{agent.llmModel}</span>
                {agent.paused && <span className="text-xs px-2 py-1 rounded-md bg-destructive/10 border border-destructive/30 text-destructive">PAUSED</span>}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Owner</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs">{truncateWallet(agent.ownerWallet)}</span>
                    <button onClick={handleCopyWallet} className="p-1 rounded hover:bg-secondary transition-colors">
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Registered</span>
                  <span className="text-xs">{new Date(agent.registeredAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Active</span>
                  <span className="text-xs text-green">{formatRelativeTime(agent.lastActive)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Tx Value</span>
                  <span className="text-xs font-mono font-bold text-green">{agent.totalTxValue}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs hover:bg-secondary transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <a href={`https://explorer.solana.com/address/${agent.ownerWallet}?cluster=devnet`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs hover:bg-secondary transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Explorer
                </a>
              </div>
            </motion.div>

            {/* Reputation Gauge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="p-6 rounded-xl border border-border bg-card text-center">
              <h3 className="text-sm font-semibold mb-4 text-left">Reputation Score</h3>
              <ReputationGauge score={agent.reputationScore} />
              <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                {[
                  { label: "Transactions", val: agent.reputationBreakdown.transactions, color: "green" },
                  { label: "Uptime", val: agent.reputationBreakdown.uptime, color: "blue-accent" },
                  { label: "Ratings", val: agent.reputationBreakdown.ratings, color: "purple-accent" },
                ].map((b) => (
                  <div key={b.label} className="text-center">
                    <div className={`text-lg font-bold font-mono ${
                      b.color === "green" ? "text-green" : b.color === "blue-accent" ? "text-blue-accent" : "text-purple-accent"
                    }`}>{b.val}</div>
                    <div className="text-muted-foreground">{b.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Capabilities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-4">Authorised Capabilities</h3>
              <div className="space-y-2">
                {[
                  { key: "defiTrading", label: "DeFi Trading", icon: TrendingUp },
                  { key: "paymentSending", label: "Payment Sending", icon: Zap },
                  { key: "contentPublishing", label: "Content Publishing", icon: Activity },
                  { key: "dataAnalysis", label: "Data Analysis", icon: Shield },
                ].map(({ key, label, icon: Icon }) => {
                  const enabled = agent.capabilities[key as keyof typeof agent.capabilities];
                  return (
                    <div key={key} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                      enabled ? "bg-green/5 border border-green/20" : "bg-secondary/50 opacity-50"
                    }`}>
                      <Icon className={`w-3.5 h-3.5 ${enabled ? "text-green" : "text-muted-foreground"}`} />
                      <span className={enabled ? "" : "text-muted-foreground line-through"}>{label}</span>
                      {enabled && key === "paymentSending" && (
                        <span className="ml-auto text-xs font-mono text-muted-foreground">
                          Max ${agent.capabilities.maxUsdcTx.toLocaleString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {agent.indiaCompliance && (
                <div className="mt-4 px-3 py-2 rounded-lg bg-amber/5 border border-amber/20">
                  <p className="text-xs text-amber font-mono mb-1">India Compliance</p>
                  <p className="text-xs text-muted-foreground">GSTIN: <span className="font-mono text-foreground">{agent.indiaCompliance.gstin}</span></p>
                  <p className="text-xs text-muted-foreground">TDS: <span className="text-amber font-bold">{agent.indiaCompliance.tdsRate}%</span> · {agent.indiaCompliance.serviceCategory}</p>
                </div>
              )}
            </motion.div>

            {/* Rate this Agent */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-4">Rate This Agent</h3>
              {rated ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-8 h-8 text-green mx-auto mb-2" />
                  <p className="text-sm font-medium">Rating submitted!</p>
                  <p className="text-xs text-muted-foreground">Your {rating}★ rating is recorded on-chain.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(s)}
                        className={`text-2xl transition-all ${s <= (hovered || rating) ? "scale-110" : "opacity-40"}`}>
                        ⭐
                      </button>
                    ))}
                  </div>
                  {!connected && (
                    <div className="flex items-center gap-1.5 text-xs text-amber mb-3">
                      <Wallet className="w-3.5 h-3.5" /> Connect wallet to submit
                    </div>
                  )}
                  <button onClick={handleSubmitRating}
                    className="w-full py-2 rounded-lg bg-green/10 border border-green/30 text-green text-sm font-medium hover:bg-green/20 transition-colors">
                    Submit Rating
                  </button>
                </>
              )}
            </motion.div>
          </div>

          {/* Right: Activity Feed */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-green" />
                <h2 className="text-lg font-bold">Activity Feed</h2>
                <span className="ml-auto text-xs text-muted-foreground font-mono">{agent.activity.length} events</span>
              </div>

              <div className="space-y-4">
                {agent.activity.map((act, i) => {
                  const Icon = ACTIVITY_ICONS[act.type] || Activity;
                  return (
                    <motion.div key={act.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center ${
                        act.status === "success" ? "border-green/30 bg-green/10" :
                        act.status === "failed" ? "border-destructive/30 bg-destructive/10" :
                        "border-amber/30 bg-amber/10"
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          act.status === "success" ? "text-green" :
                          act.status === "failed" ? "text-destructive" : "text-amber"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-0.5">{act.description}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {act.amount && (
                            <span className="text-xs font-mono text-foreground font-semibold">{act.amount}</span>
                          )}
                          {act.txHash && (
                            <a href={`https://explorer.solana.com/tx/${act.txHash}?cluster=devnet`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-xs font-mono text-green hover:underline flex items-center gap-1">
                              {act.txHash.slice(0, 6)}...{act.txHash.slice(-6)}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            act.status === "success" ? "bg-green/10 text-green" :
                            act.status === "failed" ? "bg-destructive/10 text-destructive" :
                            "bg-amber/10 text-amber"
                          }`}>{act.status}</span>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-start gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mt-0.5" />
                        {formatRelativeTime(act.timestamp)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Other Agents */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-6 p-6 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-4">Other Registered Agents</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {MOCK_AGENTS.filter(a => a.id !== agent.id).slice(0, 3).map((a) => (
                  <Link key={a.id} to={`/agent/${a.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-green/30 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-mono font-bold text-green">
                      {a.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{a.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{a.reputationScore}/1000</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-green transition-colors ml-auto shrink-0" />
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

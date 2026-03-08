import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MOCK_AGENTS, formatRelativeTime, truncateWallet } from "@/data/mockAgents";
import { useTextScramble } from "@/hooks/useTextScramble";

function JournalRow({ agent, index }: { agent: typeof MOCK_AGENTS[0]; index: number }) {
  const previewRef = useRef<HTMLSpanElement>(null);
  const scramble = useTextScramble();
  const previewText = `${agent.framework} · ${agent.llmModel} · Rep ${agent.reputationScore}/1000 · ${agent.totalTxValue} attested`;

  const handleEnter = () => {
    if (previewRef.current) scramble(previewRef.current, previewText);
  };

  return (
    <Link
      to={`/agent/${agent.id}`}
      className="group block"
      onMouseEnter={handleEnter}
    >
      <div
        className="grid items-baseline py-5 border-b transition-colors duration-300"
        style={{
          gridTemplateColumns: "110px 1fr 260px",
          borderColor: "hsl(var(--border))",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "hsl(var(--foreground)/0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "hsl(var(--border))";
        }}
      >
        {/* Date col */}
        <span className="font-mono text-xs text-muted-foreground/60 select-none">
          {new Date(agent.registeredAt).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).replace(/\//g, ".")}
        </span>

        {/* Title col */}
        <span
          className="font-serif italic text-2xl sm:text-3xl tracking-tight text-foreground transition-transform duration-300 ease-out group-hover:translate-x-2.5 inline-block"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {agent.name}
          {agent.verifiedLevel !== "Unverified" && (
            <span className={`ml-3 text-sm not-italic font-sans font-medium ${
              agent.verifiedLevel === "Audited" ? "text-green/70" : "text-blue-accent/70"
            }`}>
              · {agent.verifiedLevel}
            </span>
          )}
        </span>

        {/* Preview col — fades in + scrambles */}
        <span
          ref={previewRef}
          className="font-mono text-[11px] text-muted-foreground/50 text-right leading-relaxed opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          {previewText}
        </span>
      </div>
    </Link>
  );
}

export default function Agents() {
  const [time, setTime] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }) + " UTC");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 sm:px-10 pb-16">
      <div className="max-w-5xl mx-auto">

        {/* ── Page header: label + clock ── */}
        <div className="flex justify-between items-baseline border-b border-border pb-3 mb-12 pt-10">
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-medium select-none">
            Index / Registered Agents
          </span>
          <span className="font-mono text-[11px] text-muted-foreground/50">{time}</span>
        </div>

        {/* ── Journal list ── */}
        <ul className="w-full">
          {MOCK_AGENTS.map((agent, i) => (
            <li key={agent.id}>
              <JournalRow agent={agent} index={i} />
            </li>
          ))}
        </ul>

        {/* ── Footer telemetry ── */}
        <div className="flex justify-between items-end pt-12 pb-4">
          <span className="text-xs text-muted-foreground/40">
            {MOCK_AGENTS.length} agents registered · Solana devnet
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/30 text-right">
            X: {mousePos.x} Y: {mousePos.y}
          </span>
        </div>

      </div>
    </div>
  );
}

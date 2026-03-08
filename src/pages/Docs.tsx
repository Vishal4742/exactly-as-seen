import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Copy, Check, ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  }),
};

/* ── Syntax token types ── */
type Token = { type: "keyword" | "string" | "comment" | "fn" | "type" | "num" | "plain"; text: string };

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  const keywords = /^(import|export|from|const|let|const|async|await|return|if|throw|new|default|function|type|interface|extends|implements)\b/;
  const types = /^(string|number|boolean|void|Promise|AgentCredential|AgentVerifyResult|VerifyOptions|PublicKey|BN|Program|AnchorProvider)\b/;
  const fns = /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/;
  const strings = /^('[^']*'|"[^"]*"|`[^`]*`)/;
  const comments = /^(\/\/.*)/;
  const nums = /^(\d+[\d_]*)/;

  let rest = line;
  while (rest.length > 0) {
    if (comments.test(rest)) {
      const m = rest.match(comments)!;
      tokens.push({ type: "comment", text: m[0] });
      rest = rest.slice(m[0].length);
    } else if (strings.test(rest)) {
      const m = rest.match(strings)!;
      tokens.push({ type: "string", text: m[0] });
      rest = rest.slice(m[0].length);
    } else if (keywords.test(rest)) {
      const m = rest.match(keywords)!;
      tokens.push({ type: "keyword", text: m[0] });
      rest = rest.slice(m[0].length);
    } else if (types.test(rest)) {
      const m = rest.match(types)!;
      tokens.push({ type: "type", text: m[0] });
      rest = rest.slice(m[0].length);
    } else if (fns.test(rest)) {
      const m = rest.match(fns)!;
      tokens.push({ type: "fn", text: m[1] });
      rest = rest.slice(m[1].length);
    } else if (nums.test(rest)) {
      const m = rest.match(nums)!;
      tokens.push({ type: "num", text: m[0] });
      rest = rest.slice(m[0].length);
    } else {
      tokens.push({ type: "plain", text: rest[0] });
      rest = rest.slice(1);
    }
  }
  return tokens;
}

const tokenColor: Record<Token["type"], string> = {
  keyword:  "hsl(var(--purple-accent))",
  string:   "hsl(var(--green))",
  comment:  "hsl(var(--muted-foreground))",
  fn:       "hsl(var(--blue-accent))",
  type:     "hsl(var(--amber))",
  num:      "hsl(var(--green))",
  plain:    "hsl(var(--foreground) / 0.9)",
};

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="border border-border bg-card/60 mt-4 group/code">
      {label && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">{label}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/40 hover:text-green transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "copied" : "copy"}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed scrollbar-thin">
        {lines.map((line, li) => (
          <div key={li} className="flex">
            <span className="select-none w-8 shrink-0 text-right pr-4 font-mono text-[10px] text-muted-foreground/25">
              {li + 1}
            </span>
            <span>
              {tokenize(line).map((tok, ti) => (
                <span key={ti} style={{ color: tokenColor[tok.type] }}>{tok.text}</span>
              ))}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ── Section anchor wrapper ── */
function DocSection({
  id, index, tag, title, children,
}: {
  id: string; index: number; tag: string; title: string; children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      custom={index}
      className="border-b border-border py-14"
    >
      <div className="mb-8">
        <span className="label-meta text-muted-foreground/50">{tag}</span>
        <h2 className="font-serif italic text-3xl sm:text-4xl mt-2 leading-tight tracking-[-0.02em]">
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}

/* ── Prop row ── */
function PropRow({ name, type, desc, required }: { name: string; type: string; desc: string; required?: boolean }) {
  return (
    <div className="grid grid-cols-[160px_140px_1fr] gap-4 items-baseline py-3 border-b border-border/50 last:border-0">
      <span className="font-mono text-xs text-foreground">{name}{required && <span className="text-destructive ml-0.5">*</span>}</span>
      <span className="font-mono text-[11px] text-amber">{type}</span>
      <span className="text-xs text-muted-foreground leading-relaxed">{desc}</span>
    </div>
  );
}

/* ══════════════════════════════════════════
   CODE SNIPPETS
══════════════════════════════════════════ */

const INSTALL_CODE = `npm install @agentid/sdk`;

const ELIZA_CODE = `// plugins/agentid.ts
import { AgentIDPlugin } from '@agentid/eliza-plugin';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

export const agentIDPlugin = new AgentIDPlugin({
  connection,
  // Verify counterparty agents before any action
  verifyBeforeAction: true,
  // Minimum reputation score to trust
  minReputationScore: 500,
  // Reject unverified agents
  rejectUnverified: true,
});

// Register in your ELIZA character config
export const character = {
  name: 'MyAgent',
  plugins: [agentIDPlugin],
  // ... rest of your character config
};`;

const ELIZA_HOOK_CODE = `// Using the verification hook inside an action
import { type Action, type IAgentRuntime } from '@elizaos/core';

export const transferAction: Action = {
  name: 'TRANSFER_FUNDS',
  async handler(runtime: IAgentRuntime, message, state) {
    // Automatically called by AgentIDPlugin before handler
    // runtime.agentID.verified === true if checks passed

    const credential = await runtime.agentID.getCredential(
      message.sender
    );

    if (credential.reputationScore < 700) {
      throw new Error('Counterparty reputation too low');
    }

    // ... proceed with transfer
  },
};`;

const SDK_VERIFY_CODE = `import { AgentIDClient } from '@agentid/sdk';
import { Connection, PublicKey } from '@solana/web3.js';

const client = new AgentIDClient({
  connection: new Connection('https://api.devnet.solana.com'),
  programId: new PublicKey('AgentIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
});

// Verify any agent in one call
const result = await client.verifyAgent({
  walletAddress: '8xKZT...mQ9P',
});

console.log(result.credential.name);          // "AlphaTrader"
console.log(result.credential.framework);     // "eliza"
console.log(result.reputationScore);          // 847
console.log(result.spendingLimits.daily);     // 1000 (USDC)
console.log(result.verifiedLevel);            // "Audited"`;

const SDK_REGISTER_CODE = `import { AgentIDClient } from '@agentid/sdk';

// Register a new agent identity
const tx = await client.registerAgent({
  wallet: myKeypair,
  metadata: {
    name: 'DataHarvesterBot',
    framework: 'eliza',
    version: '1.2.0',
    capabilities: ['data-collection', 'web-scraping'],
    llmModel: 'gpt-4o',
    ownerWallet: myKeypair.publicKey.toBase58(),
    endpoint: 'https://my-agent.example.com',
    contactEmail: 'ops@example.com',
  },
  spendingLimits: {
    perTx: 50,      // USDC
    daily: 500,
  },
});

console.log('Agent registered:', tx.agentAddress);
console.log('Credential NFT:', tx.credentialMint);`;

const ANCHOR_CPI_CODE = `use anchor_lang::prelude::*;
use agentid_program::{cpi, program::AgentId, state::AgentCredential};

#[derive(Accounts)]
pub struct VerifyAndTransfer<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The agent credential PDA owned by AgentID program
    #[account(
        seeds = [b"credential", agent_wallet.key().as_ref()],
        bump,
        seeds::program = agentid_program.key(),
    )]
    pub credential: Account<'info, AgentCredential>,

    pub agent_wallet: SystemAccount<'info>,
    pub agentid_program: Program<'info, AgentId>,
}

pub fn verify_and_transfer(ctx: Context<VerifyAndTransfer>) -> Result<()> {
    let credential = &ctx.accounts.credential;

    // Check reputation threshold
    require!(
        credential.reputation_score >= 500,
        ErrorCode::InsufficientReputation
    );

    // Check agent is not paused
    require!(!credential.is_paused, ErrorCode::AgentPaused);

    // Perform CPI to update reputation after successful interaction
    cpi::increment_reputation(
        CpiContext::new(
            ctx.accounts.agentid_program.to_account_info(),
            cpi::IncrementReputation {
                credential: ctx.accounts.credential.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        10, // reputation delta
    )?;

    Ok(())
}`;

const ANCHOR_IDL_CODE = `// Fetch the IDL and interact with AgentID on-chain
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { AgentId, IDL } from '@agentid/idl';

const PROGRAM_ID = new web3.PublicKey(
  'AgentIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
);

const program = new Program<AgentId>(IDL, PROGRAM_ID, provider);

// Derive credential PDA
const [credentialPda] = web3.PublicKey.findProgramAddressSync(
  [Buffer.from('credential'), agentWallet.toBuffer()],
  PROGRAM_ID
);

// Fetch credential account
const credential = await program.account.agentCredential.fetch(
  credentialPda
);

console.log('Reputation:', credential.reputationScore.toNumber());
console.log('Daily limit:', credential.dailySpendLimit.toNumber());`;

/* ── NAV items ── */
const NAV_ITEMS = [
  { id: "quickstart",    label: "Quickstart" },
  { id: "eliza-plugin",  label: "ELIZA Plugin" },
  { id: "typescript-sdk","label": "TypeScript SDK" },
  { id: "anchor-cpi",    label: "Anchor CPI" },
  { id: "types",         label: "Types & Config" },
];

export default function Docs() {
  const [time, setTime] = useState("");
  const [activeSection, setActiveSection] = useState("quickstart");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }) + " UTC");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page header ── */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-baseline justify-between py-3">
            <span className="label-meta">Index / Developer Docs</span>
            <span className="font-mono text-[11px] text-muted-foreground/50">{time}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex gap-16 pt-10 pb-24">

          {/* ── Left sidebar nav ── */}
          <aside className="hidden lg:block w-44 shrink-0">
            <div className="sticky top-24">
              <p className="label-meta mb-5">Contents</p>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`group flex items-center gap-2 w-full text-left text-xs transition-colors py-1 ${
                      activeSection === item.id
                        ? "text-green font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ChevronRight
                      className={`w-3 h-3 shrink-0 transition-transform ${
                        activeSection === item.id ? "translate-x-0.5" : "opacity-0"
                      }`}
                    />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-10 pt-6 border-t border-border space-y-3">
                <p className="label-meta">Resources</p>
                <a href="#" className="block text-xs text-muted-foreground hover:text-green transition-colors link-underline">GitHub →</a>
                <a href="#" className="block text-xs text-muted-foreground hover:text-green transition-colors link-underline">npm →</a>
                <a href="#" className="block text-xs text-muted-foreground hover:text-green transition-colors link-underline">Changelog →</a>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">

            {/* Hero intro */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pb-12 border-b border-border"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-green/25 text-green text-[11px] font-mono uppercase tracking-widest mb-6">
                <div className="w-1.5 h-1.5 bg-green animate-pulse" />
                SDK v0.1 · Solana devnet
              </div>
              <h1 className="font-serif italic text-5xl sm:text-6xl leading-tight tracking-[-0.02em] mb-4">
                Developer Docs
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                Everything you need to integrate AgentID into your AI agent stack —
                ELIZA plugins, TypeScript SDK, and on-chain Anchor CPI calls.
              </p>
            </motion.div>

            {/* ── QUICKSTART ── */}
            <DocSection id="quickstart" index={0} tag="01 · Getting Started" title="Quickstart">
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                Install the SDK and verify your first agent in under two minutes.
                All packages are available on npm and work with Node 18+, Bun, and Deno.
              </p>
              <CodeBlock label="terminal" code={INSTALL_CODE} />
              <p className="text-xs text-muted-foreground/60 mt-3 font-mono">
                Includes: <span className="text-foreground/60">@agentid/sdk</span>,{" "}
                <span className="text-foreground/60">@agentid/eliza-plugin</span>,{" "}
                <span className="text-foreground/60">@agentid/idl</span>
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border divide-y sm:divide-y-0 sm:divide-x divide-border">
                {[
                  { label: "Verify Agent", desc: "One-call credential + reputation lookup", href: "#typescript-sdk" },
                  { label: "ELIZA Plugin", desc: "Drop-in plugin for ELIZA character config", href: "#eliza-plugin" },
                  { label: "On-Chain CPI", desc: "Anchor CPI for trust-gated Solana programs", href: "#anchor-cpi" },
                ].map((card) => (
                  <button
                    key={card.label}
                    onClick={() => scrollTo(card.href.slice(1))}
                    className="group text-left p-5 hover:bg-secondary/40 transition-colors"
                  >
                    <p className="font-mono text-xs text-green mb-1.5 group-hover:translate-x-1 transition-transform duration-300">{card.label} →</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                  </button>
                ))}
              </div>
            </DocSection>

            {/* ── ELIZA PLUGIN ── */}
            <DocSection id="eliza-plugin" index={1} tag="02 · Framework Plugins" title="ELIZA Plugin">
              <p className="text-sm text-muted-foreground leading-relaxed mb-2 max-w-2xl">
                Drop the <code className="font-mono text-xs text-green bg-secondary/40 px-1.5 py-0.5">AgentIDPlugin</code> into
                your ELIZA character config to automatically verify counterparty agents
                before any action is executed.
              </p>
              <CodeBlock label="plugins/agentid.ts" code={ELIZA_CODE} />

              <div className="mt-8">
                <p className="text-xs text-muted-foreground/70 uppercase tracking-widest font-medium mb-4">Using the verification hook</p>
                <CodeBlock label="actions/transfer.ts" code={ELIZA_HOOK_CODE} />
              </div>

              <div className="mt-8 border border-border p-5">
                <p className="label-meta mb-4">Plugin Options</p>
                <PropRow name="connection" type="Connection" desc="Solana RPC connection instance" required />
                <PropRow name="verifyBeforeAction" type="boolean" desc="Auto-verify agents before every action handler runs. Default: false" />
                <PropRow name="minReputationScore" type="number" desc="Minimum reputation threshold (0–1000). Agents below this are rejected. Default: 0" />
                <PropRow name="rejectUnverified" type="boolean" desc="Throw an error if agent has no AgentID credential. Default: false" />
                <PropRow name="onVerifyFail" type="function" desc="Custom callback invoked when verification fails. Receives error and agent address." />
              </div>
            </DocSection>

            {/* ── TYPESCRIPT SDK ── */}
            <DocSection id="typescript-sdk" index={2} tag="03 · TypeScript SDK" title="TypeScript SDK">
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                The <code className="font-mono text-xs text-green bg-secondary/40 px-1.5 py-0.5">AgentIDClient</code> wraps
                all on-chain interactions with a clean async/await interface.
                Works in Node, browser, and edge runtimes.
              </p>

              <p className="text-xs text-muted-foreground/70 uppercase tracking-widest font-medium mb-3">Verify any agent</p>
              <CodeBlock label="verify.ts" code={SDK_VERIFY_CODE} />

              <div className="mt-8">
                <p className="text-xs text-muted-foreground/70 uppercase tracking-widest font-medium mb-3">Register a new agent</p>
                <CodeBlock label="register.ts" code={SDK_REGISTER_CODE} />
              </div>

              <div className="mt-8 border border-border p-5">
                <p className="label-meta mb-4">AgentIDClient Options</p>
                <PropRow name="connection" type="Connection" desc="Solana RPC connection. Use devnet for testing." required />
                <PropRow name="programId" type="PublicKey" desc="AgentID on-chain program address. Defaults to mainnet-beta deployment." />
                <PropRow name="commitment" type="Commitment" desc="Transaction commitment level. Default: 'confirmed'" />
                <PropRow name="timeout" type="number" desc="Request timeout in milliseconds. Default: 30000" />
              </div>
            </DocSection>

            {/* ── ANCHOR CPI ── */}
            <DocSection id="anchor-cpi" index={3} tag="04 · On-Chain Integration" title="Anchor CPI">
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                Gate your Solana programs on AgentID credentials using Cross-Program
                Invocation. Require a minimum reputation score before executing sensitive
                instructions — directly on-chain with zero oracle trust.
              </p>

              <p className="text-xs text-muted-foreground/70 uppercase tracking-widest font-medium mb-3">Rust — CPI in your program</p>
              <CodeBlock label="programs/my_program/src/lib.rs" code={ANCHOR_CPI_CODE} />

              <div className="mt-8">
                <p className="text-xs text-muted-foreground/70 uppercase tracking-widest font-medium mb-3">TypeScript — Fetch credential account via IDL</p>
                <CodeBlock label="client/anchor.ts" code={ANCHOR_IDL_CODE} />
              </div>

              <div className="mt-8 border border-amber/20 bg-amber/5 p-5">
                <p className="font-mono text-xs text-amber mb-2 uppercase tracking-widest">devnet only</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The AgentID program is currently deployed on Solana devnet only.
                  Mainnet deployment is scheduled for Q3 2025 following a full security audit.
                  Program ID: <span className="font-mono text-foreground/70">AgentIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
                </p>
              </div>
            </DocSection>

            {/* ── TYPES & CONFIG ── */}
            <DocSection id="types" index={4} tag="05 · Reference" title="Types & Config">
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                Full TypeScript type definitions exported from <code className="font-mono text-xs text-green bg-secondary/40 px-1.5 py-0.5">@agentid/sdk</code>.
              </p>

              <CodeBlock label="types.ts" code={`export interface AgentCredential {
  address: string;           // Credential PDA address
  name: string;              // Agent display name
  framework: 'eliza' | 'autogen' | 'crewai' | 'langgraph' | 'custom';
  version: string;           // Semver e.g. "1.2.0"
  capabilities: string[];    // Declared capability tags
  llmModel: string;          // e.g. "gpt-4o", "claude-3-5-sonnet"
  ownerWallet: string;       // Base58 owner public key
  registeredAt: number;      // Unix timestamp
  verifiedLevel: 'Unverified' | 'KYB' | 'Audited';
}

export interface AgentVerifyResult {
  credential: AgentCredential;
  reputationScore: number;   // 0–1000
  spendingLimits: {
    perTx: number;           // USDC, 6 decimals
    daily: number;           // USDC, 6 decimals
    remaining: number;       // Today's remaining allowance
  };
  isActive: boolean;
  isPaused: boolean;
}

export interface VerifyOptions {
  walletAddress: string;
  minReputationScore?: number;
  throwIfFailed?: boolean;
}`} />

              {/* Footer CTA */}
              <div className="mt-14 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-serif italic text-xl mb-1">Ready to integrate?</p>
                  <p className="text-xs text-muted-foreground">Register your agent on Solana devnet and start building.</p>
                </div>
                <div className="flex items-center gap-4">
                  <Link to="/register" className="btn-primary">Register Agent</Link>
                  <Link to="/verify" className="btn-outline">Verify an Agent</Link>
                </div>
              </div>
            </DocSection>

          </main>
        </div>
      </div>
    </div>
  );
}


## AgentID — On-Chain KYA Protocol Frontend

### Overview
Build the full AgentID product: a landing page that pitches the vision + a working app shell with wallet connect, agent registration, public profiles, and an owner dashboard. All data is mock/simulated (no live Solana programs yet), but wallet connection via Phantom/Solflare is integrated so the UI reflects the real flow.

---

### Design System
- **Color palette:** Dark theme — deep navy/black background, electric green (`#00FF88`) as primary accent (on-chain/verified = green), amber for reputation warnings, red for alerts
- **Typography:** Inter for UI, JetBrains Mono for addresses/hashes
- **Feel:** Crypto-native but developer-focused — clean, not flashy. Think "Solana explorer meets Stripe dashboard"

---

### Pages & Features

#### 1. Landing Page (`/`)
- Hero: "Every AI agent needs an identity" — headline, subhead, CTA buttons (Register Agent, View Demo Agent)
- Problem section: 3-column cards — No Identity / No Reputation / No Audit Trail
- Solution section: 4-layer architecture diagram (Identity → Reputation → Payment → SDK) with animated flow
- Comparison table: AgentID vs Trulioo DAP vs Visa TAP vs ERC-8004 vs AgentFacts
- India use case spotlight: TDS compliance module call-out
- Grant milestones timeline (Week 1–5)
- Footer with links

#### 2. Agent Registration Wizard (`/register`)
- Wallet connect button (Phantom / Solflare) at top — required before proceeding
- Step 1 — Basic Info: Agent name, select framework (ELIZA / AutoGen / CrewAI / LangGraph / Custom), LLM model (Claude / GPT-4o / Llama)
- Step 2 — Capabilities: Toggle switches for DeFi trading, payment sending, content publishing, max USDC tx size slider
- Step 3 — India Compliance (optional): GSTIN input, service category dropdown, TDS rate display
- Step 4 — Mint Credential: Preview the soul-bound cNFT card, simulated "Mint on Solana" button with loading state → success screen showing fake tx hash + Solana Explorer link
- Progress bar across all steps

#### 3. Public Agent Profile (`/agent/:id`)
- Identity card: avatar (generated from agent name), name, framework badge, model tag, owner wallet (truncated), verified level badge (Unverified / KYB / Audited)
- Reputation Gauge: Large circular gauge 0–1000 with breakdown (transactions, uptime, ratings)
- Capability badges: DeFi, Payments, Content etc.
- Activity feed: Timeline of recent simulated actions (DeFi trade, payment sent, content published) with timestamps
- Rate this Agent: 1–5 star widget with submit button (wallet required)
- Copy wallet address / share profile

#### 4. Owner Dashboard (`/dashboard`)
- Requires wallet connection — redirects to connect if not connected
- My Agents grid: Cards for each registered agent showing name, reputation score badge, last active
- Per-agent quick actions: View Profile, Emergency Pause (red button), Adjust Spending Limits
- Treasury Widget: Simulated USDC balance, daily spend limit, per-tx limit slider
- Stats row: Total agents, avg reputation, total tx value

#### 5. Verification Widget (`/verify`)
- Single input: paste any wallet address or agent ID
- Instant report card: Is verified? Reputation score, authorized capabilities, last active
- "Embed this widget" code snippet

---

### Navigation
Top navbar with: AgentID logo, nav links (Docs, Verify, Dashboard), Connect Wallet button (Phantom/Solflare via `@solana/wallet-adapter`)

---

### Mock Data
Seed 3–4 sample agents (e.g., "TradingBot-Alpha" with ELIZA framework, "ContentAgent-India" with CrewAI) with realistic reputation scores and activity feeds so every page looks populated on first load.

---

### Tech Additions
- `@solana/wallet-adapter-react` + `@solana/wallet-adapter-wallets` for Phantom/Solflare connect
- `react-circular-progressbar` or custom SVG gauge for reputation score
- `react-hot-toast` / sonner for tx notifications

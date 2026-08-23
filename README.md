# Lublue — Your Story, Matched to Opportunity

<div align="center">

[![Live Production](https://img.shields.io/badge/Live%20Production-lublue.onrender.com-0052FF?style=for-the-badge&logo=render&logoColor=white)](https://lublue.onrender.com/)
[![Bright Data](https://img.shields.io/badge/Bright%20Data-8%20Products%20Integrated-FF7A45?style=for-the-badge&logo=databricks&logoColor=white)](https://brightdata.com/)
[![Hackathon](https://img.shields.io/badge/Hackathon-Into%20the%20Scrape--Verse-7928CA?style=for-the-badge&logo=hackathebox&logoColor=white)](https://wemakedevs.org/hackathons/scrape-verse)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%20Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>An AI-powered academic funding & grant discovery platform driven by an 8-product Bright Data web scraping ecosystem, self-healing DOM selectors, and explainable semantic matching.</strong>
</p>

### 🔗 Live Production URL: [Lublue — Your Story, Matched to Opportunity](https://lublue.onrender.com/)

[🚀 Explore Live Demo](https://lublue.onrender.com/) &bull; [🏗️ Architecture](#-system-architecture) &bull; [🔥 Bright Data Suite](#-bright-data-8-product-ecosystem) &bull; [🛡️ Self-Healing Engine](#-self-healing-engine-bdata-scraper-heal) &bull; [📑 API Specs](#-api-specification)

</div>

---

## 🌟 Executive Summary

Early-career researchers, PhD candidates, and independent scientists spend **hundreds of hours searching across fragmented foundation portals** instead of advancing scientific discoveries. Grants and fellowships are dispersed across hundreds of philanthropic institutes, corporate research divisions, and academic societies—each protected by anti-bot walls, dynamic single-page applications, and constantly changing HTML layouts.

**Lublue solves this through a single natural language interaction:**
1. **The Researcher** provides a concise biographical summary and research interests.
2. **Bright Data's 8-Product Suite** autonomously discovers, unblocks, renders, and extracts live grant opportunities from the web.
3. **The Relevance Matching Engine** scores, ranks, and provides explainable match rationale for every opportunity in milliseconds.

```mermaid
graph LR
    A["👤 Researcher Bio & Interests"] --> B["🧠 Relevance Scoring Engine"]
    C["🌐 Bright Data 8-Product Hub<br/>(SERP, Unlocker, Browser, Collector)"] --> B
    B --> D["✨ Scored, Ranked & Verified Grants"]
    D --> E["📑 Detail Modals & Saved Drawer"]
```

---

## 💡 Engineering Journey: How We Used Bright Data & Resolved Key Challenges

During the development of Lublue, we encountered several real-world web scraping hurdles. Here is how we tackled each challenge using Bright Data's platform:

```mermaid
flowchart TB
    subgraph Challenges ["🚨 Real-World Web Scraping Challenges"]
        C1["1. React SPAs & Dynamic Hydration<br/>(Empty &lt;div id='root'&gt; shells)"]
        C2["2. Anti-Bot Blocks & CAPTCHAs<br/>(403 Forbidden on Foundation Portals)"]
        C3["3. Discovering Unindexed Grants<br/>(Hardcoded URLs miss new calls)"]
        C4["4. Upstream DOM Layout Redesigns<br/>(Broken CSS selectors & silent failures)"]
        C5["5. Coding Agent Scraper Control<br/>(Need seamless AI tool orchestration)"]
    end

    subgraph Solutions ["✅ Bright Data Solutions in Lublue"]
        S1["Scraping Browser & Browser Worker<br/>Full JS execution & wait_for hydration"]
        S2["Web Unlocker (cli_unlocker)<br/>Automated TLS fingerprinting & CAPTCHA solving"]
        S3["SERP API (POST /serp/req)<br/>Real-time Google/Bing grant discovery + NLP parser"]
        S4["Scraper Studio (bdata scraper heal)<br/>Autonomous AI selector repair with same Collector ID"]
        S5["Model Context Protocol (MCP SSE)<br/>Native coding agent integration in .agents/mcp_config.json"]
    end

    C1 ==> S1
    C2 ==> S2
    C3 ==> S3
    C4 ==> S4
    C5 ==> S5
```

### 1. Challenge: Dynamic JavaScript Hydration (React / Single-Page Apps)
* **The Problem:** Modern philanthropic portals (e.g. *Schmidt Futures & Sciences*, *Rockefeller Foundation*) render grant tables via client-side React. Traditional HTTP scrapers only receive blank HTML shells like `<div id="root"></div>`.
* **How We Resolved It with Bright Data:** We selected **Browser Worker** inside **Bright Data Scraper Studio** and utilized the **Scraping Browser**. The scraper opens a headless Chromium instance, waits for network idle and DOM hydration, and extracts fully rendered content. We captured and verified the complete rendered DOM in `server/data/scraped_live_rendered_dom.html`.

### 2. Challenge: Bot Detection & CAPTCHA Walls on Philanthropic Sites
* **The Problem:** Many large funding organizations protect their directories with Cloudflare or Akamai, returning `403 Forbidden` or CAPTCHA challenges to automated requests.
* **How We Resolved It with Bright Data:** We routed extraction requests through **Bright Data Web Unlocker** (`POST /request` with zone `web_unlocker1`). Web Unlocker automatically rotates residential IP pools, manages TLS fingerprints, mimics human browser headers, and solves CAPTCHAs in the background.

### 3. Challenge: Discovering Newly Announced Grants Across the Open Web
* **The Problem:** A fixed list of URLs cannot catch new fellowships announced across academic blogs and university portals.
* **How We Resolved It with Bright Data:** We implemented the **Bright Data SERP API** (`client.serpSearch()`) in `server/src/lib/brightdata-client.ts`. When triggered, Lublue queries Google/Bing for queries like `"STEM research grants 2027 open application"` and uses NLP heuristics to extract award ceilings, deadlines, and eligibility criteria directly into structured `Opportunity` objects.

### 4. Challenge: Silent Scraper Breakage from Upstream DOM Redesigns
* **The Problem:** When grant portals redesign their CSS classes (e.g. `div.program-card` $\rightarrow$ `div.Card_wrapper__x7kQ2`), standard scrapers break silently and return empty datasets.
* **How We Resolved It with Bright Data:** We leveraged **AI Self-Healing (`bdata scraper heal`)**. Instead of rewriting extraction code, the AI coding agent runs:
  ```bash
  npx -p @brightdata/cli bdata scraper heal c_mt5ob6r4mm7ggia0h \
    "Fellowship title moved inside Card_header, deadline is now in Card_meta"
  ```
  Bright Data analyzes the new DOM tree and updates the extraction selectors in place, while keeping our production Collector ID (`c_mt5ob6r4mm7ggia0h`) and downstream API contracts completely intact.

### 5. Challenge: Driving Scrapers Directly from AI Coding Agents
* **The Problem:** We wanted our AI pair programmer (Antigravity) to discover, inspect, trigger, and debug scrapers directly without switching between browser tabs.
* **How We Resolved It with Bright Data:** We integrated the **Bright Data Model Context Protocol (MCP)** server via Server-Sent Events (SSE) in `.agents/mcp_config.json`, enabling native agent-driven scraper orchestration.

---

## 🏗️ System Architecture

Lublue is engineered as a decoupled, type-safe full-stack system connecting a reactive client to an Express API orchestration layer and Bright Data's cloud infrastructure.

```mermaid
flowchart TB
    subgraph Client ["🖥️ Frontend Client (React 18 + Vite + TypeScript)"]
        UI["Editorial UI (Fraunces & Inter)"]
        BioForm["Bio & Keyword Form"]
        SyncBtn["⚡ On-Demand Scraper Trigger"]
        Cards["Opportunity Cards & Modals"]
        Drawer["Saved Grants Drawer (LocalStorage)"]
        Badge["Live Telemetry Badge"]
    end

    subgraph Server ["⚙️ Express Backend Orchestration Layer"]
        Router["Express API Router (/api)"]
        Matcher["Semantic Relevance Engine"]
        BDService["Bright Data Multi-Product Service"]
        BDClient["BrightDataClient HTTP Wrapper"]
    end

    subgraph BrightData ["☁️ Bright Data Cloud Infrastructure"]
        SERP["1. SERP API (Google/Bing Discovery)"]
        Unlocker["2. Web Unlocker (Anti-Bot Bypass)"]
        Browser["3. Scraping Browser (JS Hydration)"]
        Collector["4. Data Collector (c_mt5ob6r4mm7ggia0h)"]
        WebScraper["5. Web Scraper API (1000+ Templates)"]
        BrowserAPI["6. Browser API (Cloud CDP Sessions)"]
        Marketplace["7. Dataset Marketplace (Pre-indexed)"]
        MCP["8. Model Context Protocol (SSE AI Agent)"]
    end

    BioForm -->|POST /api/match| Router
    SyncBtn -->|POST /api/scrape/sync| Router
    Router --> Matcher
    Router --> BDService
    BDService --> BDClient
    BDClient --> SERP & Unlocker & Browser & Collector & WebScraper & BrowserAPI & Marketplace & MCP
    Matcher --> Cards
    BDService --> Badge
```

---

## 🔥 Bright Data 8-Product Ecosystem

Lublue integrates **eight distinct Bright Data products and APIs**, forming an end-to-end web intelligence pipeline:

```mermaid
flowchart LR
    subgraph Discovery ["1. Discovery Phase"]
        P1["① SERP API<br/>Live Search Discovery"]
        P7["⑦ Dataset Marketplace<br/>Pre-indexed Funding Catalogs"]
    end

    subgraph Extraction ["2. Extraction & Bypass Phase"]
        P2["② Web Unlocker<br/>Anti-Bot / CAPTCHA Bypass"]
        P3["③ Scraping Browser<br/>Headless Dynamic JS Execution"]
        P5["⑤ Web Scraper API<br/>Domain-Specific Extractors"]
        P6["⑥ Browser API (CDP)<br/>Deep DOM Traversal Scripts"]
    end

    subgraph Orchestration ["3. Orchestration & AI Phase"]
        P4["④ Data Collector API<br/>Collector: c_mt5ob6r4mm7ggia0h"]
        P8["⑧ Model Context Protocol<br/>Coding Agent SSE Bridge"]
    end

    Discovery --> Extraction --> Orchestration
```

### Product Breakdown & Code Implementation

| # | Bright Data Product | Purpose in Lublue | Endpoint / Implementation |
|---|---|---|---|
| **1** | **SERP API** | Real-time discovery of newly published grant listings on Google/Bing | `POST /serp/req` &bull; [`client.serpSearch()`](server/src/lib/brightdata-client.ts) |
| **2** | **Web Unlocker** | Automated bypass of Cloudflare, Akamai, and CAPTCHA systems on grant portals | `POST /request` &bull; [`client.webUnlockerFetch()`](server/src/lib/brightdata-client.ts) |
| **3** | **Scraping Browser** | Cloud Puppeteer rendering for single-page React/Next.js grant directories | `cli_browser` Zone &bull; Full DOM Hydration |
| **4** | **Data Collector API** | Production collector triggering and snapshot ingestion | `POST /dca/trigger?collector=c_mt5ob6r4mm7ggia0h` |
| **5** | **Web Scraper API** | Extraction using pre-built domain templates (1,000+ supported sites) | `POST /datasets/v3/scrape` &bull; [`client.webScraperFetch()`](server/src/lib/brightdata-client.ts) |
| **6** | **Browser API (CDP)** | Direct Chrome DevTools Protocol evaluation for deep tree extraction | `POST /browser` &bull; [`client.browserApiScrape()`](server/src/lib/brightdata-client.ts) |
| **7** | **Dataset Marketplace** | Instant query of pre-indexed educational and research grant catalogs | `GET /datasets/v3/marketplace` &bull; [`client.datasetMarketplaceSearch()`](server/src/lib/brightdata-client.ts) |
| **8** | **Model Context Protocol (MCP)** | SSE bridge allowing AI coding agents to control scrapers autonomously | `.agents/mcp_config.json` &bull; `https://mcp.brightdata.com/mcp` |

---

## 🛡️ Self-Healing Engine (`bdata scraper heal`)

Grant foundation portals frequently redesign their layouts, change CSS classes, or switch frontend frameworks. Traditional scrapers break silently when upstream markup changes.

**With Bright Data Scraper Studio, Lublue heals automatically with zero downtime and zero code changes:**

```mermaid
sequenceDiagram
    autonumber
    participant Portal as Grant Foundation Portal
    participant Studio as Bright Data Scraper Studio
    participant Agent as AI Coding Agent / CLI
    participant Lublue as Lublue Production API

    Note over Portal,Lublue: 1. Normal Production Flow
    Lublue->>Studio: POST /dca/trigger (Collector c_mt5ob6r4mm7ggia0h)
    Studio->>Portal: Scrapes DOM using active selectors
    Studio-->>Lublue: Returns structured JSON

    Note over Portal,Lublue: 2. Upstream Layout Redesign Occurs
    Portal->>Portal: Migrates from Static HTML to React CSS Modules
    Lublue->>Studio: Trigger Scraper
    Studio-->>Lublue: Detects missing fields in payload

    Note over Portal,Lublue: 3. Instant AI Self-Healing
    Agent->>Studio: npx -p @brightdata/cli bdata scraper heal c_mt5ob6r4mm7ggia0h "Title moved inside Card_header"
    Studio->>Portal: Inspects new DOM tree & synthesizes robust selectors
    Studio-->>Agent: Collector updated successfully (Same ID: c_mt5ob6r4mm7ggia0h)

    Note over Portal,Lublue: 4. Seamless Resumption
    Lublue->>Studio: POST /dca/trigger (c_mt5ob6r4mm7ggia0h)
    Studio-->>Lublue: Returns 100% complete structured records
```

### Concrete Before & After Diff

```diff
- <!-- OLD STATIC DOM (Target Portal) -->
- <div class="program-card">
-   <h3 class="title">Climate Solutions Accelerator</h3>
-   <span class="deadline">June 30, 2027</span>
-   <span class="amount">$250,000 - $1,000,000</span>
- </div>

+ <!-- NEW REACT COMPONENT (Target Portal Redesign) -->
+ <div class="Card_wrapper__x7kQ2">
+   <div class="Card_header__aB3nP">
+     <h3 class="Card_title__mR9vK">Climate Solutions Accelerator</h3>
+   </div>
+   <div class="Card_meta__pL2wJ">
+     <span class="Card_badge__9qZ">Deadline: June 30, 2027</span>
+     <span class="Card_award__k1P">Award: $250,000 - $1,000,000</span>
+   </div>
+ </div>
```

**One-Command Repair:**
```bash
npx -p @brightdata/cli bdata scraper heal c_mt5ob6r4mm7ggia0h \
  "Title is now in h3.Card_title, deadline and award are in Card_meta"
```

---

## ⚡ Live Scraping & Matching Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Researcher
    participant Web as Lublue Web Client
    participant Server as Lublue Express Server
    participant BD as Bright Data Multi-Product API

    User->>Web: Submits Bio & Research Interests
    Web->>Server: POST /api/match { bio, interests, category }
    Server->>Server: Computes Keyword Overlap & Domain Alignment
    Server-->>Web: Returns Top Ranked Opportunities (0-100 Score)

    opt On-Demand Live Sync
        User->>Web: Clicks "⚡ Sync Scraper"
        Web->>Server: POST /api/scrape/sync
        Server->>BD: SERP Search + DCA Trigger + URL Verification
        BD-->>Server: Ingests new listings & snapshot ID
        Server-->>Web: Toast notification with Snapshot & New Counts
        Web->>Web: Re-ranks matches with fresh live data
    end
```

---

## 📑 API Specification

Lublue provides a RESTful API with comprehensive Bright Data scraping and matching capabilities.

### Endpoint Overview

| Method | Endpoint | Description | Sample Request |
|---|---|---|---|
| `POST` | `/api/match` | Score opportunities against researcher profile | `{ "bio": "...", "interests": "..." }` |
| `POST` | `/api/scrape/sync` | Trigger full 8-product discovery and sync pipeline | `{}` |
| `GET` | `/api/scrape/status` | Real-time telemetry of collectors, zones & MCP | N/A |
| `POST` | `/api/scrape/search` | Execute live keyword query via SERP API | `{ "query": "stem fellowships 2027" }` |
| `GET` | `/api/scrape/marketplace` | Query pre-indexed Dataset Marketplace | `?category=education&keyword=grants` |
| `POST` | `/api/scrape/unlock` | Test Web Unlocker accessibility on target URL | `{ "url": "https://..." }` |

### Sample Response: `POST /api/match`

```json
{
  "matches": [
    {
      "id": "opp-003",
      "title": "Climate Solutions Accelerator Grant",
      "organization": "Schmidt Futures & Sciences",
      "deadline": "2027-06-30",
      "category": "climate",
      "awardAmount": "$250,000 - $1,000,000",
      "eligibility": "Open globally to university labs and non-profit scientific institutes.",
      "description": "Funds early-stage research projects with potential to reduce greenhouse emissions.",
      "url": "https://www.schmidtsciences.org/fellowships/",
      "tags": ["climate change", "sustainability", "renewable energy", "carbon capture"],
      "score": 94,
      "matchReason": "Matches your interest in sustainability, renewable energy and carbon capture."
    }
  ],
  "meta": {
    "totalOpportunities": 22,
    "lastScraped": "2026-08-23T18:14:00.000Z",
    "source": "Bright Data 8-Product Pipeline (SERP + Unlocker + Scraping Browser + Collector + Web Scraper + Browser API + Marketplace + MCP)"
  }
}
```

---

## 🎨 User Interface & Editorial Design

Lublue features a bespoke editorial design system built for maximum legibility, focus, and visual delight:

- **Typography**: Custom pairing of **Fraunces** (optical-size variable serif for warm, human headlines) and **Inter** (precision sans-serif for metadata and body copy).
- **Interactive Modals**: Detailed opportunity breakdown showing award amounts, eligibility criteria, and application links.
- **Saved Grants Drawer**: Bookmarking mechanism with instant `localStorage` persistence and slide-out drawer management.
- **Responsive Architecture**: Fluid layout tested across mobile viewports (375px), tablets (768px), and ultra-wide displays (1536px+).

---

## 📂 Codebase Structure

```
OpenCall/
├── client/                         # React 18 + TypeScript SPA
│   ├── src/
│   │   ├── components/             # Reusable UI Components
│   │   │   ├── BioInput.tsx        # Bio submission form with char limits
│   │   │   ├── EmptyState.tsx      # Fallback empty state
│   │   │   ├── ErrorState.tsx      # Graceful network error handling
│   │   │   ├── FilterBar.tsx       # Domain category selector
│   │   │   ├── Footer.tsx          # Clean editorial footer & socials
│   │   │   ├── Header.tsx          # Editorial navigation & saved counter
│   │   │   ├── Layout.tsx          # Responsive container & footer wrapper
│   │   │   ├── LoadingSkeleton.tsx # Shimmer loading animation
│   │   │   ├── OpportunityCard.tsx # Scored grant card with badges
│   │   │   ├── OpportunityModal.tsx# Deep-dive grant detail modal
│   │   │   └── SavedDrawer.tsx     # Bookmarked grants slide-out panel
│   │   ├── constants/              # Frontend API endpoints & limits
│   │   ├── types/                  # Synchronized TypeScript interfaces
│   │   ├── App.tsx                 # Root state machine & view router
│   │   ├── index.css               # Design system tokens & utility classes
│   │   └── main.tsx                # React DOM root entry
│   └── index.html                  # HTML5 template with Google Fonts
├── server/                         # Express Backend & Bright Data Hub
│   ├── src/
│   │   ├── api/
│   │   │   └── match.ts            # API routes (/match, /scrape/*)
│   │   ├── constants/              # Server configuration & stopword dict
│   │   ├── lib/
│   │   │   └── brightdata-client.ts# 8-product Bright Data HTTP client
│   │   ├── services/
│   │   │   ├── brightdata.ts       # Pipeline orchestration & cache
│   │   │   └── matcher.ts          # Keyword extraction & relevance scoring
│   │   ├── types/                  # Backend data contracts & DTOs
│   │   └── index.ts                # Server bootstrap & static SPA handler
│   └── data/
│       └── sample-opportunities.json# Seed opportunities database
├── .agents/                        # Bright Data Model Context Protocol
│   └── mcp_config.json             # MCP server SSE configuration
├── Dockerfile                      # Production container recipe
├── render.yaml                     # Infrastructure-as-Code deploy config
└── README.md                       # Comprehensive documentation
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Anurag-tech22/lublue.git
cd lublue
npm run install:all
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and add your Bright Data credentials:
```ini
BRIGHTDATA_API_KEY=your_api_key_here
BRIGHTDATA_COLLECTOR_ID=c_mt5ob6r4mm7ggia0h
```

### 3. Launch Development Environment
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details. Built for the WeMakeDevs &times; Bright Data **Into the Scrape-Verse** Hackathon (August 2026).

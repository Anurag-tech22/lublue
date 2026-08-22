# OpenCall

**Your story, matched to opportunity.**

OpenCall is a warm, focused web app that connects students and researchers to grant and funding opportunities. You share your story — your research, your passions, your career stage — and OpenCall answers with matched opportunities ranked by relevance.

No accounts. No complex filters. Just call and response.

---

## The Problem

Finding research funding is broken. Opportunities are scattered across dozens of agency portals, foundation websites, and institutional databases. Each has its own interface, its own search logic, its own deadline calendar. Early-career researchers — the ones who need funding most — spend countless hours searching instead of researching.

OpenCall consolidates this fragmented landscape into a single, human interaction: tell us who you are, and we'll show you what's out there.

---

## What It Does

OpenCall has three screens and one clear flow:

1. **Input** — Write about yourself: your field, research interests, career stage, and what you're looking for. Add specific areas of interest to sharpen results.
2. **Loading** — Skeleton cards appear while the matcher scores your profile against available opportunities.
3. **Results** — Matched grants appear as cards showing the title, organization, deadline, a relevance score (0–100), and a one-line explanation of *why* this opportunity fits you. Each card links directly to the application page.

If nothing matches, you see a friendly empty state suggesting how to refine your bio. If something breaks, you see an error state with a retry button — never a blank page.

---

## How Bright Data Scraper Studio Is Used

OpenCall's core value depends on having up-to-date, comprehensive grant data from sources that don't offer clean APIs. This is where **Bright Data's Web Scraper API** (formerly Scraper Studio / Data Collector API) becomes essential.

### Target Sites

OpenCall scrapes structured data from major funding portals:

| Source | URL | Data Extracted |
|--------|-----|----------------|
| Grants.gov | grants.gov | Federal grants: title, agency, deadline, eligibility, CFDA number |
| NIH Reporter | reporter.nih.gov | NIH-funded projects: FOA, institute, budget, investigator info |
| NSF Awards | nsf.gov/awardsearch | NSF opportunities: program, directorate, award amount, abstracts |
| Foundation Directory | foundationcenter.org | Private foundation grants: focus areas, geographic scope, amounts |
| Research Professional | researchprofessional.com | International opportunities: funder, discipline, career stage |

### Creating a Collector

Using the Bright Data dashboard or API, you create a Data Collector for each target site:

1. Navigate to **Web Scraper API** in the Bright Data dashboard
2. Select **Start from scratch** or use a template for grant sites
3. Define the interaction flow (navigate, paginate, extract fields)
4. Configure the output schema to match OpenCall's `Opportunity` interface:
   ```json
   {
     "title": "string",
     "organization": "string",
     "deadline": "string (ISO 8601)",
     "description": "string",
     "url": "string",
     "tags": ["string"]
   }
   ```
5. Save and note the **Collector ID** (e.g., `c_abc123def456`)

### Self-Healing Scraping

One of Bright Data's most powerful features is **self-healing selectors**. Grant portals frequently redesign their pages — a new CSS framework, restructured DOM, or moved elements would break traditional scrapers. Bright Data handles this automatically:

**Example — Grants.gov Redesign:**
```
Before redesign:
  Selector: div.grant-result h3.title → "Graduate Research Fellowship"

After redesign (site switches from custom CSS to React components):
  Old selector fails → Bright Data detects structure change
  → AI analyzes new DOM, finds equivalent element
  → Auto-updates selector: div[data-testid="grant-card"] h2 → same data
  → No code changes needed in OpenCall
```

This means OpenCall's data pipeline doesn't break when upstream sites change their markup — Bright Data adapts automatically, ensuring continuity.

### Production Wiring via POST /dca/trigger

In production, OpenCall calls Bright Data's API server-side to trigger fresh scraping runs:

```
POST https://api.brightdata.com/dca/trigger?collector=COLLECTOR_ID
Authorization: Bearer BRIGHTDATA_API_KEY
Content-Type: application/json

{
  "query": "research grants 2027"
}
```

**Response:**
```json
{
  "snapshot_id": "snap_xyz789",
  "status": "running"
}
```

The snapshot ID is then used to poll for results or configure a webhook callback.

**Architecture of the data flow:**

```
┌──────────────┐    POST /dca/trigger     ┌──────────────────┐
│  OpenCall    │ ────────────────────────► │  Bright Data     │
│  Server      │                          │  Web Scraper API │
│              │ ◄──────────────────────── │                  │
│              │    { snapshot_id }        │  ┌────────────┐  │
│              │                          │  │ grants.gov │  │
│              │    GET /dca/dataset       │  │ nih.gov    │  │
│              │ ────────────────────────► │  │ nsf.gov    │  │
│              │                          │  │ ...        │  │
│              │ ◄──────────────────────── │  └────────────┘  │
│              │    [Opportunity[]]        │                  │
└──────────────┘                          └──────────────────┘
```

**Implementation in OpenCall:**

The file `server/src/services/brightdata.ts` is structured so switching from sample data to live Bright Data scraping is a **one-file change** — uncomment the live mode block, comment out the sample mode block, and set your environment variables. The HTTP client in `server/src/lib/brightdata-client.ts` handles authentication, request formatting, and error handling in isolation.

```typescript
// server/src/services/brightdata.ts
// Toggle between these two modes:

// SAMPLE MODE (active during development)
export async function fetchOpportunities() {
  return readSampleData();
}

// LIVE MODE (uncomment for production)
// export async function fetchOpportunities() {
//   const response = await client.trigger({ query: 'research grants' });
//   // Poll or webhook for results...
// }
```

---

## Architecture

```
OpenCall/
├── client/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # One component per file
│   │   │   ├── Layout.tsx     # Single-column container
│   │   │   ├── Header.tsx     # App name and tagline
│   │   │   ├── BioInput.tsx   # Textarea + submit form
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── OpportunityCard.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorState.tsx
│   │   ├── constants/         # Design tokens, copy, API config
│   │   ├── types/             # Shared TypeScript interfaces
│   │   ├── App.tsx            # State machine (idle/loading/results/error)
│   │   ├── main.tsx           # React entry point
│   │   └── index.css          # Full design system
│   └── index.html
├── server/                    # Node + Express backend
│   ├── src/
│   │   ├── api/               # Route handlers only
│   │   │   └── match.ts       # POST /api/match
│   │   ├── services/          # Business logic
│   │   │   ├── matcher.ts     # Keyword scoring engine
│   │   │   └── brightdata.ts  # Data source (sample ↔ live)
│   │   ├── lib/               # External clients
│   │   │   └── brightdata-client.ts
│   │   ├── constants/
│   │   ├── types/
│   │   └── index.ts           # Express server entry
│   └── data/
│       └── sample-opportunities.json
├── .env.example
├── package.json               # Workspace scripts
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript (strict), Vite |
| Backend | Node.js, Express, TypeScript (strict) |
| Data Source | Bright Data Web Scraper API (sample JSON for dev) |
| Fonts | Fraunces (serif headings), Inter (sans body) |
| Styling | Vanilla CSS with custom properties |
| Dev Tools | tsx (server hot-reload), Vite (client HMR), concurrently |

---

## Setup & Run

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone and enter the project
cd OpenCall

# Install all dependencies (root, server, client)
npm run install:all

# Copy environment template
cp .env.example .env
# Edit .env with your Bright Data credentials (optional for dev)
```

### Development

```bash
# Start both server (port 3001) and client (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

---

## Sample JSON Output

**POST /api/match**

Request:
```json
{
  "bio": "I'm a second-year PhD student in computational biology studying protein folding and genomic data analysis. I'm looking for funding to support my dissertation research on machine learning applications in structural biology.",
  "interests": "machine learning, computational biology, bioinformatics, genomics"
}
```

Response:
```json
{
  "matches": [
    {
      "id": "opp-006",
      "title": "Biomedical Data Science Training Grant",
      "organization": "National Institutes of Health",
      "deadline": "2027-05-25",
      "description": "Supports predoctoral and postdoctoral trainees developing expertise at the intersection of biomedical research and data science...",
      "url": "https://datascience.nih.gov/training",
      "tags": ["biomedical", "data science", "bioinformatics", "genomics", "computational biology", "predoctoral", "postdoctoral", "statistics", "machine learning"],
      "score": 82,
      "matchReason": "Matches your interest in bioinformatics, genomics and computational biology."
    },
    {
      "id": "opp-004",
      "title": "AI for Social Good Research Awards",
      "organization": "Google Research",
      "deadline": "2027-04-01",
      "description": "Supports academic research applying artificial intelligence and machine learning to pressing social challenges...",
      "url": "https://research.google/outreach/ai-for-social-good",
      "tags": ["artificial intelligence", "machine learning", "deep learning", "social impact", "healthcare", "education", "accessibility", "natural language processing", "computer vision"],
      "score": 45,
      "matchReason": "Matches your interest in machine learning."
    }
  ]
}
```

---

## Demo Video

📹 [Watch the demo](https://your-demo-link-here.com) *(placeholder — replace with actual recording)*

---

## AI Tools Disclosure

Built with **Antigravity** as the coding agent. Antigravity is an AI-powered development environment by Google DeepMind that assisted in architecture design, code generation, and iterative refinement throughout the development of OpenCall.

---

## What's Next

- **Live Bright Data integration** — Switch from sample data to real-time scraping of grants.gov, NIH Reporter, and NSF
- **Semantic matching** — Replace keyword overlap with embedding-based similarity for deeper understanding of research profiles
- **Saved searches** — Let users bookmark opportunities and get notified of new matches
- **Deadline alerts** — Email or push notifications as application deadlines approach
- **Institutional feeds** — Allow universities to add their internal funding opportunities
- **Multi-language support** — Expand to non-English grant databases (EU Horizon, JSPS, DFG)

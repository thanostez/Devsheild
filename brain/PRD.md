# 🛡️ DevShield — Product Requirements Document (PRD)

**Version:** 1.1.0  
**Last Updated:** April 2026  
**Status:** Ready for Development  
**Author:** DevShield Team  
**Changelog:** v1.1.0 — Replaced paid HIBP breach API with free LeakCheck Public API. App is now $0/month to run.

---

## 📋 Table of Contents

1. [Product Overview](#1-product-overview)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [Core Features](#4-core-features)
5. [UI/UX Design System](#5-uiux-design-system)
6. [Architecture & Tech Stack](#6-architecture--tech-stack)
7. [API Reference](#7-api-reference)
8. [Step-by-Step Build Plan](#8-step-by-step-build-plan)
9. [File & Folder Structure](#9-file--folder-structure)
10. [Environment Variables](#10-environment-variables)
11. [Risk Score Logic](#11-risk-score-logic)
12. [Privacy & Security Rules](#12-privacy--security-rules)
13. [Rate Limits & Caching Strategy](#13-rate-limits--caching-strategy)
14. [Completion Tracking](#14-completion-tracking)

---

## 1. Product Overview

**DevShield** is a unified developer security toolkit that combines two powerful features:

| Tool | What It Does |
|---|---|
| 📦 **npm Package Risk Analyzer** | Audits any npm package for CVEs, maintainer health, download trends, license risk — before you install |
| 🔐 **Credential Leak Monitor** | Checks emails and passwords against known data breaches, paste dumps, and generates secure replacements |

**Tagline:** *"Audit before you install. Check before you trust."*

**URL Structure:**
- `/` — Landing page
- `/npm-audit` — npm Package Risk Analyzer
- `/credential-check` — Credential Leak Monitor
- `/breach-timeline` — Visual breach history explorer

---

## 2. Problem Statement

### Problem A — npm Security
- Developers blindly `npm install` packages every day with zero visibility into CVEs, abandoned maintainers, or malicious takeovers.
- Existing tools (npm audit, Snyk) require project setup or paid plans for full value.
- There is no fast, zero-install, browser-based risk checker for individual packages.

### Problem B — Credential Leaks
- Most people don't know their email appeared in 10+ breaches.
- Checking via haveibeenpwned.com manually is tedious; it shows no actionable steps.
- No tool combines breach detection + password checking + password generation in one place.

---

## 3. Target Users

| User | Use Case |
|---|---|
| **Frontend/Backend Devs** | Check packages before installing; audit dependencies |
| **DevSecOps Engineers** | Bulk audit package.json files; check team credentials |
| **Security Researchers** | Explore breach timeline; investigate leaks |
| **CTOs / Tech Leads** | Check company domain exposure across known breaches |
| **Individual Developers** | Personal email/password breach check |

---

## 4. Core Features

### Feature 1 — npm Package Risk Analyzer

#### 1A. Single Package Audit
- Search by package name (e.g., `lodash`, `axios`, `express`)
- Fetch data from npm Registry, npm Downloads API, GitHub API, NVD (CVE Database)
- Display Overall Risk Score (0–100) with color coding
- Show 4 sub-scores: Security, Maintenance, Popularity, Quality
- List all CVEs in a table with severity, CVSS score, affected versions
- Show maintainer list, last publish date, license type
- Show monthly download trend chart (last 12 months)

#### 1B. package.json Bulk Upload
- Drag & drop or click to upload `package.json`
- Parse all `dependencies` and `devDependencies`
- Scan each package and return a risk table
- Sort by highest risk first
- Export full report as PDF

#### 1C. Package Comparison
- Compare two packages side by side
- Show all metrics in a split-panel layout
- Highlight winner in each category

---

### Feature 2 — Credential Leak Monitor

#### 2A. Email Breach Scanner
- Enter any email address
- Returns all breaches the email appeared in via **LeakCheck Public API** (7B+ records, free)
- Each breach card shows: name, date, data types leaked
- Color severity: 🔴 Critical (passwords/financials) / 🟡 Moderate (emails/phones) / 🟢 Low (usernames)
- Footer attribution: "Powered by LeakCheck" (required by LeakCheck terms)

#### 2B. Password Breach Checker
- User types password in a masked input
- Password is hashed client-side via SHA-1 (k-Anonymity — never leaves browser)
- Only first 5 chars of hash sent to **HIBP Pwned Passwords API** (always free, no key needed)
- Shows: "This password appeared in X,XXX breaches"
- Displays risk level and generates 5 secure alternatives via Passwordinator API

#### 2C. Breach Timeline Explorer
- Visual D3.js timeline of all 700+ known public breaches (2007–present)
- Filter by year, data type exposed (passwords, emails, credit cards, etc.)
- Click any breach to see full details, affected count, description

---

## 5. UI/UX Design System

### 5.1 Theme — Dark Cyberpunk Security

The visual language should feel like a **professional security tool** — dark, precise, and trustworthy. Not playful. Not corporate. Think: VSCode meets a security dashboard.

```
Primary Background:   #0A0E1A  (near-black navy)
Secondary Background: #0F1629  (dark blue-grey, cards)
Surface:              #1A2035  (elevated surfaces)
Border:               #1E2D4A  (subtle card borders)

Accent Blue:          #3B82F6  (primary actions, links)
Accent Cyan:          #06B6D4  (highlights, scores)
Accent Purple:        #8B5CF6  (secondary actions)

Success Green:        #10B981  (low risk, safe)
Warning Yellow:       #F59E0B  (moderate risk)
Danger Red:           #EF4444  (high risk, critical)
Critical Red:         #DC2626  (critical CVEs)

Text Primary:         #F1F5F9  (main text)
Text Secondary:       #94A3B8  (muted text, labels)
Text Dim:             #475569  (disabled, placeholders)

Code/Mono Font:       'JetBrains Mono', 'Fira Code', monospace
Body Font:            'Inter', sans-serif
```

### 5.2 Icon Library

Use **Lucide React** icons exclusively. Key icons used:

| Usage | Icon |
|---|---|
| npm audit section | `Package` |
| Credential check | `ShieldCheck` |
| Risk score | `AlertTriangle` |
| CVE/Vulnerability | `Bug` |
| Breach | `ShieldOff` |
| Password | `Lock` / `LockOpen` |
| Download trend | `TrendingDown` / `TrendingUp` |
| Maintainer | `Users` |
| Last updated | `Clock` |
| License | `FileText` |
| Search | `Search` |
| Upload | `Upload` |
| Export | `Download` |
| Safe/Green | `CheckCircle` |
| Danger/Red | `XCircle` |
| Warning/Yellow | `AlertCircle` |
| Timeline | `Calendar` |
| GitHub | `Github` |
| Copy | `Copy` |
| External link | `ExternalLink` |

### 5.3 Component Patterns

#### Risk Score Badge
```
Score 0–30   → bg: #10B981/20  text: #10B981  label: "LOW RISK"
Score 31–60  → bg: #F59E0B/20  text: #F59E0B  label: "MODERATE"
Score 61–80  → bg: #EF4444/20  text: #EF4444  label: "HIGH RISK"
Score 81–100 → bg: #DC2626/20  text: #DC2626  label: "CRITICAL"
```

#### Card Style
```css
background: #0F1629
border: 1px solid #1E2D4A
border-radius: 12px
padding: 24px
box-shadow: 0 4px 24px rgba(0,0,0,0.4)
```

#### Input Style
```css
background: #0A0E1A
border: 1px solid #1E2D4A
border-radius: 8px
padding: 12px 16px
color: #F1F5F9
focus: border-color: #3B82F6, box-shadow: 0 0 0 3px rgba(59,130,246,0.2)
```

#### Primary Button
```css
background: linear-gradient(135deg, #3B82F6, #8B5CF6)
border-radius: 8px
padding: 12px 24px
font-weight: 600
hover: opacity 0.9, transform: translateY(-1px)
```

### 5.4 Navigation

Top navbar with:
- Left: `🛡️ DevShield` logo (text, monospace font)
- Center: `npm Audit` | `Credential Check` | `Breach Timeline`
- Right: GitHub star button + theme toggle (dark only for now)

### 5.5 Page Layouts

#### npm Audit Page
```
┌─────────────────────────────────────────┐
│  🔍 Search Bar (full width, hero-style) │
│     "Search any npm package..."         │
└─────────────────────────────────────────┘
┌────────────────┐ ┌──────────────────────┐
│ Overall Score  │ │ 4 Sub-Score Cards    │
│   Big Circle   │ │ Security / Maint /   │
│    e.g. 73     │ │ Popularity / Quality │
└────────────────┘ └──────────────────────┘
┌─────────────────────────────────────────┐
│ CVE Table (sortable)                    │
└─────────────────────────────────────────┘
┌─────────────────┐ ┌───────────────────┐
│ Download Chart  │ │ Package Metadata  │
│ (Recharts line) │ │ (maintainers,     │
│                 │ │  license, links)  │
└─────────────────┘ └───────────────────┘
```

#### Credential Check Page
```
┌─────────────────────────────────────────┐
│  Tabs: [ Email Check ] [ Password Check ]│
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Email input + "Check Breaches" button  │
└─────────────────────────────────────────┘
┌──────────────────────────────────────── ┐
│  Results: Breach cards (grid)           │
│  Each card: Logo | Name | Date | Data   │
│  Types | Severity badge                 │
└─────────────────────────────────────────┘
```

---

## 6. Architecture & Tech Stack

```
Frontend:         Next.js 14 (App Router) + TypeScript
Styling:          Tailwind CSS + custom CSS variables
Charts:           Recharts (npm downloads trend)
Visualization:    D3.js (breach timeline)
Icons:            Lucide React
State/Fetching:   TanStack React Query v5
Hashing:          Web Crypto API (client-side SHA-1 for passwords)
Backend Routes:   Next.js API Routes (/app/api/*)
Caching:          Upstash Redis (free tier)
Hosting:          Vercel (free tier)
HTTP Client:      Native fetch (no axios dependency)
PDF Export:       jsPDF + html2canvas
```

---

## 7. API Reference

### 7.1 npm APIs (No key required)

```
Package metadata:
GET https://registry.npmjs.org/{package}

Download stats (monthly):
GET https://api.npmjs.org/downloads/point/last-month/{package}

Download range (12 months):
GET https://api.npmjs.org/downloads/range/last-year/{package}

npm search scores:
GET https://registry.npmjs.org/-/v1/search?text={package}&size=1
→ Returns: quality, popularity, maintenance (0-1 floats)
```

### 7.2 GitHub API (Token recommended)

```
Repo details:
GET https://api.github.com/repos/{owner}/{repo}
Header: Authorization: Bearer {GITHUB_TOKEN}
→ Returns: stars, open_issues, pushed_at, subscribers_count
```

### 7.3 NVD CVE API (Free key recommended)

```
CVE search:
GET https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch={package}&resultsPerPage=10
Header: apiKey: {NVD_API_KEY}
→ Returns: CVE ID, severity, CVSS score, description, published date
```

### 7.4 LeakCheck Public API (No key required — Free)

> ⚠️ **Attribution required:** Add a visible "Powered by LeakCheck" link in the footer when using this API on a website. This is the only condition for free commercial use.

```
Email / username breach lookup (NO KEY — completely free):
GET https://leakcheck.io/api/public?check={email}
→ Returns: { success: true, found: N, sources: [{ name, date }] }

Example response:
{
  "success": true,
  "found": 3,
  "sources": [
    { "name": "Adobe",    "date": "2013-10" },
    { "name": "LinkedIn", "date": "2016-05" },
    { "name": "Canva",    "date": "2019-05" }
  ]
}

Also supports username lookup (unique vs HIBP):
GET https://leakcheck.io/api/public?check={username}
→ Auto-detects email vs username
```

**Why LeakCheck over HIBP for email checks:**

| Feature | HIBP (old) | LeakCheck Public (new) |
|---|---|---|
| Cost | ~$3.50/mo | ✅ Free |
| API Key | Required | ❌ Not needed |
| Database | 700+ breaches | 7 billion+ records |
| Username lookup | ❌ | ✅ |
| Commercial use | Paid only | ✅ Free with attribution |

### 7.5 HIBP Pwned Passwords (No key required — Free, kept as-is)

> This endpoint has always been free and requires no key. It is kept for password checking only.

```
Pwned passwords k-Anonymity (NO KEY NEEDED — free, unlimited):
GET https://api.pwnedpasswords.com/range/{first5charsOfSHA1}
→ Returns: plain text list of hash suffixes + breach counts

Example:
Request:  GET https://api.pwnedpasswords.com/range/5BAA6
Response: 1E4C9B93F3F0682250B6CF8331B7EE68FD8:3303003
          003D68EB55068C33ACE09247EE4C639306B:3
          ...
Note: SHA-1 hash computed CLIENT-SIDE — only 5 chars ever leave the browser
```

### 7.6 Passwordinator API (No key required)

```
Generate password:
GET https://passwordinator.onrender.com?num=1&caps=true&sym=true&len=16
→ Returns: { data: "GeneratedP@ssword1" }
```

---

## 8. Step-by-Step Build Plan

> ⚠️ **RULE:** Each step must be **fully working and tested** before proceeding to the next.
> After completing each step, create a `STEP-{N}-COMPLETED.md` file with a checklist of what was done and verified.

---

### ✅ STEP 1 — Project Setup & Foundation
**Goal:** Working Next.js app with correct config, theme, fonts, and navbar. Nothing more.

**Tasks:**
1. Init project: `npx create-next-app@latest devshield --typescript --tailwind --app --src-dir`
2. Install dependencies:
   ```bash
   npm install lucide-react @tanstack/react-query recharts d3 @types/d3
   npm install jspdf html2canvas
   npm install @upstash/redis
   ```
3. Configure `tailwind.config.ts` with custom color palette (all colors from Design System section 5.1)
4. Set up global CSS variables in `app/globals.css`
5. Create `app/layout.tsx` with Inter + JetBrains Mono fonts (Google Fonts)
6. Build the Navbar component (`components/Navbar.tsx`) with logo + 3 nav links
7. Create placeholder pages: `/`, `/npm-audit`, `/credential-check`, `/breach-timeline`
8. Create landing page (`app/page.tsx`) with hero section explaining both tools
9. Create `.env.local` with all env variable placeholders

**Verification Checklist:**
- [ ] `npm run dev` starts without errors
- [ ] All 4 routes load without 404
- [ ] Navbar renders correctly on all pages
- [ ] Colors match design system exactly
- [ ] Fonts load correctly (Inter for body, JetBrains Mono for code)
- [ ] Mobile responsive layout works
- [ ] No TypeScript errors (`npm run build` passes)

**Output file:** `STEP-1-COMPLETED.md`

---

### ✅ STEP 2 — API Proxy Routes (Backend)
**Goal:** All API proxy routes working and tested with real data before any UI is built.

**Tasks:**
1. Create `app/api/npm/package/route.ts`
   - Accept `?name={packageName}` query param
   - Fetch from `registry.npmjs.org/{name}`
   - Return: name, version, description, license, maintainers, repository, dependencies count, last publish date
   - Handle 404 (package not found)

2. Create `app/api/npm/downloads/route.ts`
   - Accept `?name={packageName}`
   - Fetch 12-month range from `api.npmjs.org/downloads/range/last-year/{name}`
   - Return: array of `{ week: string, downloads: number }`

3. Create `app/api/npm/scores/route.ts`
   - Accept `?name={packageName}`
   - Fetch from npm search API
   - Return: `{ quality: number, popularity: number, maintenance: number }` (all 0–100)

4. Create `app/api/github/repo/route.ts`
   - Accept `?owner={owner}&repo={repo}`
   - Add `Authorization: Bearer ${GITHUB_TOKEN}` header
   - Return: stars, open_issues, last_push, contributors_url

5. Create `app/api/cve/route.ts`
   - Accept `?package={packageName}`
   - Fetch from NVD API with `apiKey` header
   - Return: array of `{ id, severity, cvss, description, published, affectedVersions }`
   - Handle rate limiting with 500ms delay between calls

6. Create `app/api/leakcheck/breaches/route.ts`
   - Accept `?email={email}` query param
   - Forward to `https://leakcheck.io/api/public?check={email}`
   - No API key needed — public endpoint
   - Validate email format before forwarding
   - Return: `{ found: number, sources: Array<{ name: string, date: string }> }`
   - Add IP-based rate limiting (max 10 req/min per IP) to prevent abuse

7. Create `app/api/hibp/password/route.ts`
   - Accept `?prefix={5charHash}`
   - Forward to `api.pwnedpasswords.com/range/{prefix}`
   - Return raw text response (list of hash suffixes + counts)
   - No API key needed — always free

8. Create `app/api/password/generate/route.ts`
   - Calls Passwordinator API 5 times
   - Returns: array of 5 passwords with varying complexity

**Verification Checklist:**
- [ ] Test each route in browser/Postman with real data
- [ ] `/api/npm/package?name=react` returns valid data
- [ ] `/api/npm/downloads?name=react` returns 52 weekly data points
- [ ] `/api/cve?package=lodash` returns CVE list (lodash has known CVEs)
- [ ] `/api/leakcheck/breaches?email=example@example.com` returns breach sources from LeakCheck
- [ ] `/api/hibp/password?prefix=5BAA6` returns list of hash suffixes (test with SHA-1 prefix of "password")
- [ ] `/api/password/generate` returns 5 passwords
- [ ] No API keys are visible in browser network tab for any route
- [ ] Error states return proper HTTP status codes (400 for bad email, 500 for upstream failure)
- [ ] No TypeScript errors

**Output file:** `STEP-2-COMPLETED.md`

---

### ✅ STEP 3 — Risk Score Engine
**Goal:** A pure TypeScript module that takes raw API data and produces all scores. Fully unit-testable.

**Tasks:**
1. Create `lib/riskScore.ts` with the following exported functions:

```typescript
// Input types
interface NpmPackageData { lastPublished: Date; maintainersCount: number; ... }
interface CVEData { severity: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'; cvss: number; ... }
interface DownloadData { monthly: number; trend: 'up'|'down'|'stable' }
interface NpmScores { quality: number; popularity: number; maintenance: number }

// Score functions (each returns 0-100)
export function calculateSecurityScore(cves: CVEData[]): number
export function calculateMaintenanceScore(pkg: NpmPackageData): number
export function calculatePopularityScore(downloads: DownloadData): number
export function calculateQualityScore(scores: NpmScores): number
export function calculateOverallRiskScore(all: AllScores): number
export function getRiskLabel(score: number): 'LOW'|'MODERATE'|'HIGH'|'CRITICAL'
export function getRiskColor(score: number): string
```

2. **Security Score Logic:**
   ```
   Start at 100
   For each CVE:
     CRITICAL severity → -25 points
     HIGH severity     → -15 points
     MEDIUM severity   → -8 points
     LOW severity      → -3 points
   Minimum score: 0
   ```

3. **Maintenance Score Logic:**
   ```
   Days since last publish:
     0–30 days   → 100
     31–90 days  → 90
     91–180 days → 75
     181–365 days → 50
     1–2 years   → 25
     2+ years    → 10
   
   Single maintainer penalty: -10
   Abandoned (no commits in 2 years): -20
   ```

4. **Popularity Score Logic:**
   ```
   Monthly downloads:
     > 10,000,000  → 100
     > 1,000,000   → 85
     > 100,000     → 70
     > 10,000      → 50
     > 1,000       → 30
     > 100         → 15
     < 100         → 5
   ```

5. **Quality Score Logic:**
   ```
   npm quality score × 100 (already 0-1 float)
   ```

6. **Overall Risk Score:**
   ```
   Security    × 0.40
   Maintenance × 0.30
   Popularity  × 0.20
   Quality     × 0.10
   
   Note: Higher score = SAFER (inverted for display — show as "Risk" not "Safety")
   Risk = 100 - overallSafetyScore
   ```

7. Write unit tests in `lib/__tests__/riskScore.test.ts`

**Verification Checklist:**
- [ ] `calculateSecurityScore([])` returns 100
- [ ] `calculateSecurityScore([{severity:'CRITICAL'}])` returns 75
- [ ] `calculateMaintenanceScore` returns correct value for package published yesterday
- [ ] `calculateMaintenanceScore` returns low score for 3-year-old package
- [ ] `calculateOverallRiskScore` weighted sum is correct
- [ ] All edge cases (0 downloads, no maintainers) handled without NaN/crash
- [ ] Unit tests pass: `npm test`

**Output file:** `STEP-3-COMPLETED.md`

---

### ✅ STEP 4 — npm Package Audit UI
**Goal:** Complete, polished npm Package Risk Analyzer page — fully functional.

**Tasks:**
1. Create `components/npm/SearchBar.tsx`
   - Large hero-style search input
   - Loading spinner while fetching
   - Keyboard shortcut: Enter to search
   - Show recent searches (localStorage)

2. Create `components/npm/OverallScoreRing.tsx`
   - SVG circular progress ring
   - Shows score number in center (large, bold)
   - Color of ring matches risk level
   - Animated fill on load

3. Create `components/npm/SubScoreCard.tsx`
   - 4 cards: Security / Maintenance / Popularity / Quality
   - Each with icon, score bar, label
   - Color coded by score

4. Create `components/npm/CVETable.tsx`
   - Sortable columns: CVE ID, Severity, CVSS Score, Published Date
   - Severity badges: CRITICAL/HIGH/MEDIUM/LOW
   - Expandable rows showing full description
   - "No CVEs found" empty state with green checkmark

5. Create `components/npm/DownloadChart.tsx`
   - Recharts AreaChart
   - 12-month weekly download data
   - Custom tooltip showing exact count
   - Gradient fill matching accent color

6. Create `components/npm/PackageMetaCard.tsx`
   - Package name, version, description
   - License badge (green for MIT/Apache, yellow for others, red for unknown)
   - Maintainers list with avatars (from npm)
   - Last published date (relative: "3 days ago")
   - GitHub stats (stars, open issues, last commit)
   - Links to npm page, GitHub repo

7. Create `components/npm/BulkUpload.tsx`
   - Drag & drop zone for package.json
   - Parse and validate JSON client-side
   - Show package count before scanning
   - Progress bar while scanning (N/total)
   - Results table: name | version | risk score | CVE count

8. Assemble `app/npm-audit/page.tsx`
   - Wire all components together
   - Use React Query for data fetching
   - Loading skeletons for all cards
   - Error states (package not found, API down)
   - Tab switcher: Single Package / Bulk Upload / Compare

**Verification Checklist:**
- [ ] Search for `lodash` returns results with CVEs showing
- [ ] Search for `react` returns low-risk result
- [ ] Search for a non-existent package shows error state gracefully
- [ ] Bulk upload with a real package.json scans all packages
- [ ] Download chart renders correctly with 52 data points
- [ ] CVE table sorts by severity and CVSS correctly
- [ ] All loading skeletons appear while data is fetching
- [ ] Mobile layout is responsive
- [ ] No console errors

**Output file:** `STEP-4-COMPLETED.md`

---

### ✅ STEP 5 — Credential Leak Monitor UI
**Goal:** Complete, polished Credential Leak Monitor — fully functional.

**Tasks:**
1. Create `components/credential/EmailInput.tsx`
   - Email input with validation
   - Submit button with loading state
   - Privacy notice: "We proxy all requests. Your email is never stored."

2. Create `components/credential/BreachCard.tsx`
   - Breach name + date (from LeakCheck `source.name` and `source.date`)
   - Auto-generated favicon/logo attempt using `https://www.google.com/s2/favicons?domain={breach_domain}` (best-effort)
   - Data fields exposed as color-coded tags (from LeakCheck `fields` array):
     - 🔴 Passwords, Credit Cards, SSNs → Critical
     - 🟡 Phone Numbers, Addresses → Moderate
     - 🟢 Email Addresses, Usernames → Low
   - "Unverified breach" warning badge when `source.unverified === 1`
   - Expandable row showing full breach context

3. Create `components/credential/SeverityStats.tsx`
   - Summary bar: "Found in X breaches — Y critical, Z moderate"
   - Donut chart showing severity breakdown (Recharts)

4. Create `components/credential/PasswordChecker.tsx`
   - Password input (masked, toggle to show)
   - **SHA-1 hashing happens here in browser using Web Crypto API — password never leaves browser**
   - Only 5-char prefix sent to server → HIBP Pwned Passwords k-Anonymity endpoint (free, no key)
   - Display: breach count, risk level
   - Live strength meter as user types (separate from breach check)

5. Create `components/credential/PasswordStrengthMeter.tsx`
   - Real-time as user types
   - Checks: length, uppercase, numbers, symbols, common words
   - Score: Weak / Fair / Good / Strong / Very Strong

6. Create `components/credential/PasswordGenerator.tsx`
   - "Generate Secure Alternatives" button
   - Shows 5 generated passwords
   - Each with: copy button, strength badge
   - Options: length (12/16/20/24), include symbols toggle

7. Create `lib/sha1.ts`
   - Client-side SHA-1 using `window.crypto.subtle`
   - Returns uppercase hex string
   ```typescript
   export async function sha1(text: string): Promise<string>
   export function getKAnonPrefix(hash: string): string  // first 5 chars
   export function checkHashInList(fullHash: string, responseText: string): number // returns count
   ```

8. Create `app/api/hibp/password/route.ts` (already built in Step 2 — reuse)
   - Accept `?prefix={5charHash}`
   - Forward to `api.pwnedpasswords.com/range/{prefix}`
   - Return raw text response (list of hash suffixes)
   - This endpoint needs NO API key

9. Assemble `app/credential-check/page.tsx`
   - Tab layout: Email Check | Password Check
   - "Powered by LeakCheck" attribution link in footer (required)
   - Empty state with shield icon when nothing searched yet

**Verification Checklist:**
- [ ] Email `example@example.com` returns breach results from LeakCheck (it appears in multiple breaches)
- [ ] A fresh, randomly generated email returns no results (clean result)
- [ ] Password "password" shows very high breach count (600M+) via HIBP Pwned Passwords
- [ ] Password hashing happens client-side (verify in Network tab — only 5-char hash prefix sent)
- [ ] No API keys of any kind are visible in the Network tab
- [ ] "Powered by LeakCheck" attribution link is visible and links to leakcheck.io
- [ ] Password generator produces 5 valid passwords
- [ ] Copy button copies password to clipboard
- [ ] Strength meter updates in real-time as password is typed
- [ ] Mobile layout works correctly
- [ ] No console errors

**Output file:** `STEP-5-COMPLETED.md`

---

### ✅ STEP 6 — Breach Timeline Explorer
**Goal:** Visual D3.js timeline of all known breaches — filterable and interactive.

> **Note:** The breach timeline now uses a **static curated dataset** of major public breaches (sourced from public records and LeakCheck's published breach index), rather than the HIBP `/breaches` endpoint which previously required no key but was HIBP-specific. This keeps the feature completely free and independent.

**Tasks:**
1. Create `lib/breachData.ts`
   - Static JSON dataset of 200+ major public breaches (name, date, pwn count, data types, description)
   - Sourced from publicly documented breaches (Wikipedia, news reports, LeakCheck index)
   - Commit this file to the repo — no API call needed at runtime

2. Create `lib/breachUtils.ts`
   - Group breaches by year
   - Filter by data class (password, email, etc.)
   - Sort by severity (highest pwn count)
   - Extract all unique data classes for filter UI

3. Create `components/timeline/BreachTimeline.tsx`
   - D3.js horizontal timeline
   - Each year on x-axis
   - Each breach as a circle (radius = pwn count)
   - Color = most severe data class exposed
   - Hover tooltip: name, date, count, data types
   - Zoom & pan enabled

4. Create `components/timeline/BreachFilters.tsx`
   - Year range slider
   - Data class checkboxes (Passwords, Emails, Credit Cards, etc.)
   - Sort by: Date / Size / Severity
   - Search breaches by name

5. Create `components/timeline/BreachDetailPanel.tsx`
   - Slide-in panel on click
   - Full breach details: logo (favicon), description, data classes, count
   - "Check if you were affected" button → goes to email check

6. Assemble `app/breach-timeline/page.tsx`

**Verification Checklist:**
- [ ] Timeline renders all breaches from static dataset (200+)
- [ ] Filtering by data class works correctly
- [ ] Year range filter narrows visible breaches
- [ ] Hovering shows tooltip with correct data
- [ ] Clicking opens detail panel
- [ ] "Check if affected" button navigates to credential check with breach name pre-filled
- [ ] Performance: renders smoothly without lag (static data = no loading state needed)
- [ ] Mobile: timeline is scrollable horizontally

**Output file:** `STEP-6-COMPLETED.md`

---

### ✅ STEP 7 — Caching, Performance & Polish
**Goal:** Production-ready performance with Redis caching and polished UX details.

**Tasks:**
1. Set up Upstash Redis client in `lib/redis.ts`
2. Add Redis caching to API routes:
   - npm package data → cache 1 hour
   - CVE results → cache 6 hours
   - LeakCheck breach results → cache 30 minutes (key: `lc:breaches:{email}`)
   - Password hash range results → cache 10 minutes (key: `hibp:pw:{prefix}`)
3. Add loading skeleton components for every card
4. Add error boundary components
5. Add `<head>` metadata (title, description, OG tags)
6. Add keyboard shortcuts (press `/` to focus search)
7. Polish animations (framer-motion or CSS transitions)
8. Add "Share result" URL feature for npm audit results
9. Final mobile responsiveness pass
10. Run Lighthouse audit, fix any score below 90

**Verification Checklist:**
- [ ] Repeated searches load from cache (check Redis dashboard)
- [ ] All loading states show skeletons, not blank screens
- [ ] Lighthouse scores: Performance >90, Accessibility >90
- [ ] No TypeScript errors: `npm run build` clean
- [ ] Works on Chrome, Firefox, Safari

**Output file:** `STEP-7-COMPLETED.md`

---

### ✅ STEP 8 — Deployment
**Goal:** Live production URL on Vercel.

**Tasks:**
1. Create GitHub repo and push code
2. Connect to Vercel
3. Add all environment variables in Vercel dashboard
4. Add Upstash Redis connection string
5. Test all features on production URL
6. Set up custom domain (optional)

**Verification Checklist:**
- [ ] Production URL loads
- [ ] All API routes work on production (not just localhost)
- [ ] Environment variables are set correctly in Vercel
- [ ] HTTPS working
- [ ] No CORS errors

**Output file:** `STEP-8-COMPLETED.md`

---

## 9. File & Folder Structure

```
devshield/
├── app/
│   ├── layout.tsx                    # Root layout, fonts, QueryClient
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # CSS variables, base styles
│   ├── npm-audit/
│   │   └── page.tsx                  # npm Package Risk Analyzer
│   ├── credential-check/
│   │   └── page.tsx                  # Credential Leak Monitor
│   ├── breach-timeline/
│   │   └── page.tsx                  # Breach Timeline Explorer
│   └── api/
│       ├── npm/
│       │   ├── package/route.ts      # Package metadata proxy
│       │   ├── downloads/route.ts    # Download stats proxy
│       │   └── scores/route.ts       # npm quality scores proxy
│       ├── github/
│       │   └── repo/route.ts         # GitHub repo health proxy
│       ├── cve/
│       │   └── route.ts              # NVD CVE lookup proxy
│       ├── leakcheck/
│       │   └── breaches/route.ts     # Email breach check (LeakCheck Public API — free)
│       ├── hibp/
│       │   └── password/route.ts     # k-Anon password prefix (HIBP Pwned Passwords — free)
│       └── password/
│           └── generate/route.ts     # Password generator proxy
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── npm/
│   │   ├── SearchBar.tsx
│   │   ├── OverallScoreRing.tsx
│   │   ├── SubScoreCard.tsx
│   │   ├── CVETable.tsx
│   │   ├── DownloadChart.tsx
│   │   ├── PackageMetaCard.tsx
│   │   └── BulkUpload.tsx
│   ├── credential/
│   │   ├── EmailInput.tsx
│   │   ├── BreachCard.tsx
│   │   ├── SeverityStats.tsx
│   │   ├── PasswordChecker.tsx
│   │   ├── PasswordStrengthMeter.tsx
│   │   └── PasswordGenerator.tsx
│   ├── timeline/
│   │   ├── BreachTimeline.tsx
│   │   ├── BreachFilters.tsx
│   │   └── BreachDetailPanel.tsx
│   └── ui/
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Skeleton.tsx
│       ├── Tabs.tsx
│       └── Tooltip.tsx
│
├── lib/
│   ├── riskScore.ts                  # Risk scoring algorithm
│   ├── sha1.ts                       # Client-side SHA-1 hashing
│   ├── breachData.ts                 # Static dataset of 200+ major public breaches
│   ├── breachUtils.ts                # Breach data helpers (filter, sort, group)
│   ├── redis.ts                      # Upstash Redis client
│   ├── apiHelpers.ts                 # Shared fetch utilities
│   └── __tests__/
│       ├── riskScore.test.ts
│       └── sha1.test.ts
│
├── types/
│   ├── npm.ts                        # npm API types
│   ├── cve.ts                        # CVE/NVD types
│   ├── breach.ts                     # LeakCheck breach types + HIBP password types
│   └── index.ts                      # Re-exports
│
├── .env.local                        # Local env vars (gitignored)
├── .env.example                      # Template (committed)
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── PRD.md                            # This file
├── STEP-1-COMPLETED.md               # Created after Step 1
├── STEP-2-COMPLETED.md               # Created after Step 2
│   ... and so on
└── README.md
```

---

## 10. Environment Variables

> ✅ **Total monthly cost: $0.00** — All APIs used are completely free.

```bash
# .env.local (NEVER commit this file)

# GitHub Personal Access Token
# Get from: https://github.com/settings/tokens
# Scopes needed: public_repo (read only)
# Without this: GitHub API limited to 60 req/hr (fine for dev, not prod)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# NVD API Key (free, instant approval)
# Get from: https://nvd.nist.gov/developers/request-an-api-key
# Without this: limited to 5 req/30s (still works, just slower)
NVD_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Upstash Redis (free tier — 10,000 req/day)
# Get from: https://console.upstash.com
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxx

# Next.js public URL (needed for OG tags)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NOTE: No HIBP API key needed anymore.
# LeakCheck Public API — completely free, no key required.
# HIBP Pwned Passwords — always free, no key required.
```

```bash
# .env.example (commit this file — no real values)
GITHUB_TOKEN=
NVD_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 11. Risk Score Logic

### Full Algorithm (TypeScript)

```typescript
// Security Score: CVE penalty
function calculateSecurityScore(cves: CVEData[]): number {
  const penalties = { CRITICAL: 25, HIGH: 15, MEDIUM: 8, LOW: 3 }
  const total = cves.reduce((acc, cve) => acc + (penalties[cve.severity] || 0), 0)
  return Math.max(0, 100 - total)
}

// Maintenance Score: recency + maintainer count
function calculateMaintenanceScore(pkg: NpmPackageData): number {
  const daysSince = differenceInDays(new Date(), new Date(pkg.lastPublished))
  let score = 100
  if (daysSince > 730) score = 10
  else if (daysSince > 365) score = 25
  else if (daysSince > 180) score = 50
  else if (daysSince > 90) score = 75
  else if (daysSince > 30) score = 90
  if (pkg.maintainersCount === 1) score -= 10
  return Math.max(0, score)
}

// Popularity Score: log-scaled downloads
function calculatePopularityScore(monthly: number): number {
  if (monthly > 10_000_000) return 100
  if (monthly > 1_000_000) return 85
  if (monthly > 100_000) return 70
  if (monthly > 10_000) return 50
  if (monthly > 1_000) return 30
  if (monthly > 100) return 15
  return 5
}

// Quality Score: direct from npm
function calculateQualityScore(npmQuality: number): number {
  return Math.round(npmQuality * 100)
}

// Overall: weighted average → converted to Risk (inverted)
function calculateOverallRiskScore(scores: AllScores): number {
  const safety =
    scores.security * 0.40 +
    scores.maintenance * 0.30 +
    scores.popularity * 0.20 +
    scores.quality * 0.10
  return Math.round(100 - safety) // Higher = more risky
}
```

---

## 12. Privacy & Security Rules

1. **No paid API keys exist anymore** — LeakCheck Public API and HIBP Pwned Passwords are both keyless. There are no secrets to leak for breach checking.
2. **Passwords** must NEVER be sent to any server. SHA-1 hash and k-Anonymity prefix computed client-side only. Only the first 5 characters of the hash are ever sent to `/api/hibp/password`.
3. **Emails** are not stored or logged anywhere in the application. The LeakCheck proxy route must not log request parameters.
4. All API routes must validate and sanitize inputs before forwarding to external APIs (email format check, length limits, character whitelist).
5. Rate limiting: Add IP-based rate limiting to the LeakCheck proxy route (max 10 req/min per IP) to prevent the free API from being abused through DevShield.
6. All external API calls must have a timeout of 10 seconds max — return a 504 error if upstream times out.
7. **LeakCheck attribution:** The "Powered by LeakCheck" link must be present and visible on the Credential Check page. This is a legal requirement of the free API terms.

---

## 13. Rate Limits & Caching Strategy

| API | Limit | Cache TTL | Cache Key |
|---|---|---|---|
| npm Registry | ~unlimited | 60 min | `npm:pkg:{name}` |
| npm Downloads | ~unlimited | 60 min | `npm:dl:{name}` |
| GitHub API | 5,000/hr (with token) | 60 min | `gh:repo:{owner}/{repo}` |
| NVD CVE | 50 req/30s (with key) | 6 hours | `cve:{package}` |
| LeakCheck Public | ~reasonable use | 30 min | `lc:breaches:{email}` |
| HIBP Pwned Passwords | Unlimited | 10 min | `hibp:pw:{prefix}` |
| Passwordinator | Unlimited | none | — |

> **LeakCheck rate limit:** No official published limit for the public API. Cache aggressively (30 min) and enforce your own IP rate limit (10 req/min) on the proxy route to be a good citizen and avoid getting blocked.

---

## 14. Completion Tracking

| Step | Description | Status | File |
|---|---|---|---|
| Step 1 | Project Setup & Foundation | Completed - Apr 19 2026 | `STEP-1-COMPLETED.md` |
| Step 2 | API Proxy Routes | Completed - Apr 19 2026 | `STEP-2-COMPLETED.md` |
| Step 3 | Risk Score Engine | Completed - Apr 19 2026 | `STEP-3-COMPLETED.md` |
| Step 4 | npm Package Audit UI | Completed - Apr 19 2026 | `STEP-4-COMPLETED.md` |
| Step 5 | Credential Leak Monitor UI | Completed - Apr 19 2026 | `STEP-5-COMPLETED.md` |
| Step 6 | Breach Timeline Explorer | Completed - Apr 19 2026 | `STEP-6-COMPLETED.md` |
| Step 7 | Caching, Performance & Polish | Completed - Apr 19 2026 | `STEP-7-COMPLETED.md` |
| Step 8 | Deployment | ⬜ Not Started | `STEP-8-COMPLETED.md` |

### How to Update This Table

After completing each step, update the status to `✅ Completed` and add the completion date:
```
| Step 1 | Project Setup & Foundation | ✅ Completed — Apr 20 2026 | STEP-1-COMPLETED.md |
```

---

## 📝 Notes for Developers

- Always run `npm run build` before marking a step complete — TypeScript errors count as incomplete.
- Test on real data, not mocked data, before marking complete.
- Each `STEP-N-COMPLETED.md` file must include: what was built, what was tested, and any known issues.
- If an API is down during testing, document it in the completion file and retest when available.
- **Testing LeakCheck:** Use `example@example.com` — it appears in multiple known breaches and returns real data from the public API.
- **Testing HIBP Passwords:** The SHA-1 of "password" starts with `5BAA6` — use `GET /api/hibp/password?prefix=5BAA6` to verify the route works. Expect 600M+ breach count in response.
- **Attribution:** The "Powered by LeakCheck" link is a legal requirement. Do NOT remove it. It should be visible on the `/credential-check` page footer.
- **This app costs $0/month to run** — no paid API keys of any kind are required.

---

*End of PRD — DevShield v1.1.0*






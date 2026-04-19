<div align="center">
  <img src="public/favicon.ico" alt="DevShield Logo" width="100"/>
  <h1>DevShield</h1>
  <p><strong>Zero-Trust Web & CI/CD Security Toolkit for Modern Developers</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#devshield-cli">DevShield CLI</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

**DevShield** is an advanced, client-side security intelligence application built using Next.js 14 and React. It brings powerful CI/CD-level package auditing and zero-knowledge credential breach scanning directly into a beautifully unified, cyberpunk-themed web dashboard and terminal CLI.

If you care about securing your dependencies before downloading them, or guaranteeing that your production pipelines remain clean of high-severity CVEs, DevShield provides the tooling you need.

## 🔥 Key Features

### 📦 Holistic NPM Risk Auditing
Search any node package and DevShield dynamically fetches its CVE records from the National Vulnerability Database (NVD), evaluates its popularity/maintenance history, and generates a zero-trust **Risk Score (0-100)** to determine whether it is safe to install.

### 🔌 Interactive D3.js Dependency Visualization
Vulnerabilities often hide deep within secondary dependencies. DevShield maps out package dependencies recursively, rendering a draggable, physics-driven force-directed graph to visually highlight structural risks instantly.

### 🔗 Public GitHub Pipeline Scanner
Paste any public GitHub repository URL into the auditor. DevShield will hit the GitHub API, remotely extract its `package.json`, parse the dependencies, and bulk-audit the entire project's security profile.

### 🛡 Zero-Knowledge Credential Monitoring
Check personal or enterprise emails for exposure across 7+ billion known breached records. For elite security, we utilize a **k-Anonymity SHA-1 Hashing** method natively inside your browser. **Your passwords remain strictly client-side and never touch our servers.**

## 💻 DevShield CLI (CI/CD Integration)

We natively ship a DevShield terminal CLI that hooks seamlessly into your CI/CD pipelines (GitHub Actions, GitLab CI, etc.). It analyzes your local dependencies and blocks pipeline builds by returning a massive visual failure if **HIGH** or **CRITICAL** vulnerabilities are detected.

**To run inside any node repository:**
```bash
npx devshield
# or locally if cloned
node bin/devshield.mjs
```

## 🛠️ Getting Started (Local Development)

### 1. Requirements & Dependencies
Ensure you have Node.js version 20+ installed.

```bash
git clone https://github.com/thanostez/DevShield.git
cd DevShield
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and configure your credentials.

- `GITHUB_TOKEN`: Improves rate limits for the Repository Scanner feature.
- `NVD_API_KEY`: Required for fetching CVE records accurately.
- `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: Required for caching search queries and speeding up NVD proxy fetching.
- `NEXT_PUBLIC_APP_URL`: Specifies your production URL natively for Social Sharing features.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application locally.

## 🚀 Deployment (Vercel)

DevShield is heavily optimized for zero-config Vercel deployment. 

1. Push your repository to GitHub.
2. Import the project within Vercel.
3. Supply all environment variables exactly as configured in your `.env.local` to the Vercel branch deployment settings.
4. Deploy!

Ensure you update `NEXT_PUBLIC_APP_URL` on Vercel after production URL generation so generated metadata correctly references your web address.

---

<div align="center">
  <i>Powered purely by <b>DevShield</b></i>
</div>

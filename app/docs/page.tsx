"use client";

import { BookOpen, Shield, Terminal, Zap, Code, Scan, ChevronRight } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 animate-fade-up">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="flex items-center gap-3 text-4xl font-extrabold text-white">
          <BookOpen className="h-10 w-10 text-accentBlue" />
          DevShield Documentation
        </h1>
        <p className="mt-4 text-lg text-textSecondary leading-relaxed">
          The complete guide to utilizing the Zero-Trust Security Toolkit for your CI/CD pipelines, package analysis, and credential monitoring.
        </p>
      </div>

      <div className="space-y-16">
        {/* Web App Section */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold border-b border-border/50 pb-2">
            <Shield className="h-6 w-6 text-accentPurple" />
            <span className="text-white">Platform Capabilities</span>
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                <Code className="h-5 w-5 text-accentCyan" />
                NPM Package Auditor
              </h3>
              <p className="text-sm text-textSecondary leading-relaxed mb-4">
                Fetch real-time comprehensive risk metrics for any npm package. Evaluates the National Vulnerability Database (NVD) for active Zero-Day exploits, assesses maintenance timelines, popularity metrics, and assigns a master Risk Score (0-100).
              </p>
            </div>

            <div className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                <Scan className="h-5 w-5 text-accentCyan" />
                Remote GitHub Scanner
              </h3>
              <p className="text-sm text-textSecondary leading-relaxed mb-4">
                Copy and paste any public GitHub repository URL into the auditor. We utilize the GitHub REST API to securely extract the `package.json` file remotely and bulk analyze every single nested dependency for security risks natively in the browser.
              </p>
            </div>
            
            <div className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                <Zap className="h-5 w-5 text-accentCyan" />
                Visual Dependency Tree
              </h3>
              <p className="text-sm text-textSecondary leading-relaxed mb-4">
                Vulnerabilities hide in transitive dependencies (dependencies of dependencies). The interactive D3.js force-directed graph automatically maps deep dependency chains up to 2-layers deep so you can visually untangle supply chain risks.
              </p>
            </div>
          </div>
        </section>

        {/* CLI Section */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold border-b border-border/50 pb-2">
            <Terminal className="h-6 w-6 text-accentBlue" />
            <span className="text-white">The DevShield CLI</span>
          </h2>
          <p className="mb-6 text-textSecondary leading-relaxed">
            The DevShield CLI is designed to wrap natively into your continuous integration (CI/CD) pipelines (such as GitHub Actions or GitLab CI) to strictly block vulnerable code from reaching production.
          </p>

          <div className="rounded-xl border border-border bg-primaryBg overflow-hidden mb-6 shadow-card">
            <div className="bg-surface px-4 py-2 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#E11D48]" />
                <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                <div className="h-3 w-3 rounded-full bg-[#10B981]" />
              </div>
              <span className="text-xs font-mono text-textSecondary ml-2 tracking-wider">Terminal</span>
            </div>
            <div className="p-5 font-mono text-sm overflow-x-auto">
              <div className="flex items-center text-textSecondary mb-2">
                <ChevronRight className="h-4 w-4 text-accentBlue" /> 
                <span>Run via npx:</span>
              </div>
              <p className="text-white ml-5 mb-6">$ npx devshield</p>
              
              <div className="flex items-center text-textSecondary mb-2">
                <ChevronRight className="h-4 w-4 text-accentBlue" /> 
                <span>Or install globally for permanent access:</span>
              </div>
              <p className="text-white ml-5 mb-2">$ npm install -g devshield</p>
              <p className="text-white ml-5">$ devshield</p>
            </div>
          </div>

          <div className="rounded-xl bg-accentBlue/10 border border-accentBlue/20 p-5 mt-6">
            <h4 className="text-accentBlue font-bold mb-2">Pipeline Execution</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              When executed, the CLI will iterate through your local `package-lock.json` and communicate with vulnerability databases. If any dependency contains a <strong>HIGH</strong> or <strong>CRITICAL</strong> severity CVE, the CLI will forcefully exit with `Exit Code 1`, preventing your pull request from being merged.
            </p>
          </div>
        </section>

        {/* Credential Check */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold border-b border-border/50 pb-2">
            <Shield className="h-6 w-6 text-success" />
            <span className="text-white">Zero-Knowledge Architecture</span>
          </h2>
          <p className="text-textSecondary leading-relaxed mb-4">
            Our credential leak monitoring utilizes strict <strong>k-Anonymity privacy architectures</strong>. When you query an email for historical breaches across our 7B+ record database, the query is cryptographically hashed via `SHA-1` directly inside your web browser. 
          </p>
          <p className="text-textSecondary leading-relaxed">
            Only the first 5 characters of the hash are transmitted to our Edge APIs to find bucketed prefix-matches, ensuring your plaintext passwords and identifiers are completely obfuscated from our network layer. We see nothing, and we log nothing.
          </p>
        </section>
      </div>
      
      <div className="mt-16 border-t border-border pt-8 text-center text-textSecondary text-sm">
        Generated & Secured by DevShield API
      </div>
    </div>
  );
}

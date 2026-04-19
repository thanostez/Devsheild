"use client";

import Link from "next/link";
import { Package, ShieldCheck, ChevronRight, Lock, Activity, Eye, Zap, Terminal, Copy, Check } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx devshield");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-accentBlue/20 blur-[120px]" />
      <div className="absolute -right-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-accentPurple/20 blur-[120px]" />
      <div className="absolute left-[30%] top-[60%] h-[600px] w-[600px] rounded-full bg-accentCyan/10 blur-[150px]" />

      {/* 1. HERO SECTION */}
      <motion.section
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center pt-20 text-center sm:pt-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Hero"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2 rounded-full border border-accentBlue/30 bg-accentBlue/10 px-4 py-1.5 text-sm font-medium text-accentBlue backdrop-blur-md transition-colors hover:bg-accentBlue/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accentCyan opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accentCyan"></span>
            </span>
            Security made seamless
          </span>
        </motion.div>

        <motion.h1
          className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
          variants={itemVariants}
        >
          Audit before you install. <br />
          <span className="bg-gradient-to-r from-accentBlue via-accentCyan to-accentPurple bg-clip-text text-transparent pb-2 block">
            Check before you trust.
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-textSecondary sm:text-xl leading-relaxed"
          variants={itemVariants}
        >
          DevShield unifies npm package risk analysis and credential breach
          monitoring into one modern, security-focused toolkit for elite developers.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6"
          variants={itemVariants}
        >
          <Link
            href="/npm-audit"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-textPrimary px-8 py-4 text-sm font-bold text-primaryBg transition-all hover:bg-white hover:scale-105 active:scale-95"
          >
            Start npm Audit
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/credential-check"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/50 px-8 py-4 text-sm font-bold text-textPrimary backdrop-blur-md transition-all hover:bg-surface hover:text-white hover:scale-105 active:scale-95 shadow-card"
          >
            Check Credentials
            <ShieldCheck className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* CLI Integration Terminal */}
        <motion.div
          className="mt-16 flex w-full max-w-md flex-col items-center"
          variants={itemVariants}
        >
          <div className="flex w-full items-center justify-between rounded-t-xl bg-surface px-4 py-2 border border-b-0 border-border/80">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-danger"></div>
              <div className="h-3 w-3 rounded-full bg-warning"></div>
              <div className="h-3 w-3 rounded-full bg-success"></div>
            </div>
            <span className="font-mono text-xs font-semibold text-textSecondary uppercase tracking-widest">CI/CD Terminal</span>
            <div className="w-10"></div> {/* Spacer for symmetry */}
          </div>
          <div className="group relative flex w-full flex-col rounded-b-xl border border-border/80 bg-[#030610] px-5 py-4 shadow-2xl overflow-hidden">
            {/* Subtle glow inside terminal */}
            <div className="absolute top-0 left-1/4 h-full w-1/2 bg-accentCyan/5 blur-3xl pointer-events-none"></div>

            <div className="flex w-full items-center justify-between z-10 mb-2">
              <div className="flex items-center gap-3 font-mono text-sm sm:text-base">
                <Terminal className="h-5 w-5 text-accentCyan" />
                <span className="text-textDim select-none">$</span>
                <span className="text-white font-medium">npx devshield</span>
              </div>
              <button
                onClick={handleCopy}
                className="rounded-lg p-2 text-textSecondary transition-all hover:bg-surface hover:text-white active:scale-95 border border-transparent hover:border-border/50"
                title="Copy command"
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* Fake terminal output */}
            <div className="z-10 flex flex-col font-mono text-[10px] sm:text-xs text-textSecondary border-t border-border/40 pt-4 pb-2 text-left">
              <span className="text-textPrimary font-bold leading-relaxed break-words">🛡️ DevShield CLI <span className="font-normal text-textSecondary sm:inline block mt-1 sm:mt-0">- Zero-Trust CI/CD Pipeline Auditor</span></span>
              <span className="mt-3 text-textDim break-words">INFO Shielding dependencies in local lockfile...</span>

              <div className="mt-4 flex flex-col">
                <span className="text-white"><span className="text-danger font-bold mr-2">[HIGH]</span>glob</span>
                <span className="pl-4 sm:pl-6 text-textDim break-words leading-relaxed">↳ Path: glob CLI: Command injection</span>
                <span className="pl-4 sm:pl-6 text-danger break-words leading-relaxed mt-1">⚠️ Action Required: Update to v16.2.4</span>
              </div>

              <div className="mt-4 flex flex-col">
                <span className="text-white flex items-center flex-wrap gap-1">
                  <span className="bg-danger text-white rounded-[2px] px-1 font-bold">[CRITICAL]</span>
                  next
                </span>
                <span className="pl-4 sm:pl-6 text-textDim break-words leading-relaxed mt-1">↳ Path: Vulnerable to DoS in Server Components</span>
                <span className="pl-4 sm:pl-6 text-danger break-words leading-relaxed mt-1">⚠️ Action Required: Update to v14.2.35</span>
              </div>

              <span className="mt-6 py-2 px-3 border border-danger/30 rounded-md bg-danger/10 text-danger font-bold w-full break-words whitespace-normal leading-relaxed text-center sm:text-left sm:w-fit">
                FAIL: Pipeline Blocked. 2 HIGH/CRITICAL risk(s) detected.
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-textSecondary">
            Run this directly in your repository to audit your local <span className="font-mono bg-surface/50 px-1.5 py-0.5 rounded text-accentCyan">package.json</span>
          </p>
        </motion.div>

      </motion.section>

      {/* Feature Grids */}
      <motion.section
        className="relative z-10 mx-auto mt-24 grid max-w-7xl gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        aria-label="Features"
      >
        {[
          {
            icon: Package,
            title: "npm Risk Analyzer",
            desc: "Instantly inspect metadata, CVEs, and maintenance signals.",
            color: "text-accentBlue",
            bg: "bg-accentBlue/10 border-accentBlue/20"
          },
          {
            icon: Lock,
            title: "Credential Health",
            desc: "Check exposure across 7B+ records with k-Anonymity.",
            color: "text-accentPurple",
            bg: "bg-accentPurple/10 border-accentPurple/20"
          },
          {
            icon: Activity,
            title: "Breach Timeline",
            desc: "Visualize major public breaches organically via D3.",
            color: "text-accentCyan",
            bg: "bg-accentCyan/10 border-accentCyan/20"
          },
          {
            icon: Eye,
            title: "Zero-Knowledge",
            desc: "Client-side hashing means your passwords never leave the browser.",
            color: "text-success",
            bg: "bg-success/10 border-success/20"
          },
          {
            icon: ShieldCheck,
            title: "Real-time Metrics",
            desc: "Get instantaneous download stats directly from npm.",
            color: "text-warning",
            bg: "bg-warning/10 border-warning/20"
          },
          {
            icon: Zap,
            title: "Blazing Fast",
            desc: "Powered by Next.js, Redis, and Edge APIs.",
            color: "text-danger",
            bg: "bg-danger/10 border-danger/20"
          }
        ].map((feat, idx) => (
          <motion.div
            key={idx}
            className="group relative overflow-hidden rounded-2xl border border-border bg-secondaryBg/40 p-8 shadow-card backdrop-blur-md transition-all hover:-translate-y-1 hover:border-textSecondary/30 hover:bg-surface/60 hover:shadow-2xl hover:shadow-accentBlue/10"
            variants={itemVariants}
          >
            <div className={`mb-6 inline-flex rounded-xl border p-3 ${feat.bg} transition-colors group-hover:bg-opacity-20`}>
              <feat.icon className={`h-6 w-6 ${feat.color}`} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">{feat.title}</h3>
            <p className="text-textSecondary">{feat.desc}</p>

            {/* Glow effect on hover */}
            <div className="absolute -inset-px -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 rounded-2xl" />
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}

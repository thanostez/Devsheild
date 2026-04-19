"use client";

import Link from "next/link";
import { Package, ShieldCheck, ChevronRight, Lock, Activity, Eye, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";

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
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-accentBlue/20 blur-[120px]" />
      <div className="absolute -right-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-accentPurple/20 blur-[120px]" />
      <div className="absolute left-[30%] top-[60%] h-[600px] w-[600px] rounded-full bg-accentCyan/10 blur-[150px]" />

      <motion.div
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center pt-20 text-center sm:pt-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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
      </motion.div>

      {/* Feature Grids */}
      <motion.div 
        className="relative z-10 mx-auto mt-24 grid max-w-7xl gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
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
      </motion.div>
    </div>
  );
}

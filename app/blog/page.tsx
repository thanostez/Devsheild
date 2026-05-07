"use client";

import Link from "next/link";
import { BookOpen, Calendar, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const articles = [
  {
    title: "The Rising Threat of Software Supply Chain Attacks",
    slug: "software-supply-chain-attacks",
    excerpt: "Learn why hackers are targeting npm packages and how you can protect your development pipeline from malicious dependencies.",
    date: "May 5, 2024",
    readTime: "8 min read",
    category: "Security",
  },
  {
    title: "Mastering NPM Audit: Beyond the Basics",
    slug: "mastering-npm-audit",
    excerpt: "A deep dive into identifying, evaluating, and fixing vulnerabilities in your Node.js projects using DevShield and native tools.",
    date: "May 2, 2024",
    readTime: "6 min read",
    category: "Tutorial",
  },
  {
    title: "Credential Hygiene in 2024: Best Practices for Developers",
    slug: "credential-hygiene-2024",
    excerpt: "How to use k-Anonymity and zero-knowledge tools to monitor your digital footprint without compromising your privacy.",
    date: "April 28, 2024",
    readTime: "10 min read",
    category: "Privacy",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl py-12 px-4 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
          Security <span className="text-accentBlue">Insights</span>
        </h1>
        <p className="mt-4 text-lg text-textSecondary">
          Expert analysis, tutorials, and the latest news in DevSecOps and cybersecurity.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <motion.article
            key={article.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-secondaryBg shadow-card transition-all hover:-translate-y-1 hover:border-accentBlue/30 hover:shadow-2xl"
          >
            <div className="p-6">
              <div className="mb-4 flex items-center gap-4 text-xs font-medium text-textSecondary">
                <span className="rounded-full bg-accentBlue/10 px-2.5 py-0.5 text-accentBlue">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {article.date}
                </span>
              </div>
              <h2 className="mb-3 text-xl font-bold text-white leading-tight">
                <Link href={`/blog/${article.slug}`} className="hover:text-accentBlue transition-colors">
                  {article.title}
                </Link>
              </h2>
              <p className="mb-6 text-sm text-textSecondary leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <span className="flex items-center gap-1 text-xs text-textDim">
                  <Clock className="h-3 w-3" />
                  {article.readTime}
                </span>
                <Link
                  href={`/blog/${article.slug}`}
                  className="flex items-center gap-1 text-sm font-bold text-accentBlue hover:text-accentCyan transition-colors"
                >
                  Read More
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

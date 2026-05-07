"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const blogContent = {
  "software-supply-chain-attacks": {
    title: "The Rising Threat of Software Supply Chain Attacks",
    date: "May 5, 2024",
    readTime: "8 min read",
    author: "DevShield Security Team",
    category: "Security",
    content: `
      <p>In recent years, the landscape of cybersecurity has shifted dramatically. While traditional attacks often targeted corporate networks or user endpoints, a more insidious threat has emerged: the software supply chain attack. This strategy involves compromising the tools, libraries, or processes that developers use to build software, effectively turning the software itself into a delivery vehicle for malware.</p>
      
      <h2>What is a Supply Chain Attack?</h2>
      <p>A software supply chain attack occurs when an attacker injects malicious code into a legitimate software component. Because modern applications are built on top of thousands of open-source libraries, most developers aren't aware of every line of code running in their production environments. By compromising a single popular npm package, an attacker can potentially gain access to thousands of downstream applications.</p>
      
      <blockquote>
        "Supply chain attacks increased by over 600% in 2023, as attackers realized it's much easier to compromise a developer's library than a hardened enterprise firewall."
      </blockquote>

      <h2>The NPM Ecosystem Risk</h2>
      <p>The npm ecosystem is particularly vulnerable due to its sheer scale and the culture of rapid development. Many packages have dozens or even hundreds of dependencies, creating a "dependency hell" where a vulnerability can be buried deep within a nested tree. Attackers use several techniques to exploit this:</p>
      <ul>
        <li><strong>Typosquatting:</strong> Registering packages with names very similar to popular ones (e.g., "lodash" vs "lodas").</li>
        <li><strong>Account Takeover:</strong> Gaining access to a maintainer's account to push a malicious update.</li>
        <li><strong>Dependency Confusion:</strong> Tricking a build system into pulling a malicious public package instead of a private internal one.</li>
      </ul>

      <h2>How DevShield Helps</h2>
      <p>At DevShield, we built our NPM Audit tool specifically to address these risks. By analyzing not just known CVEs, but also maintenance signals, package age, and maintainer reputation, we provide a holistic view of the risk profile of any package before you run <code>npm install</code>.</p>
    `,
  },
  "mastering-npm-audit": {
    title: "Mastering NPM Audit: Beyond the Basics",
    date: "May 2, 2024",
    readTime: "6 min read",
    author: "Alex Rivera",
    category: "Tutorial",
    content: `
      <p>Most developers are familiar with the <code>npm audit</code> command. However, simply running the command is only the first step. To truly secure your projects, you need to understand how to interpret the results and when to take action.</p>
      
      <h2>Understanding Severity Levels</h2>
      <p>Vulnerabilities are typically categorized as Low, Moderate, High, or Critical. But what do these actually mean? A 'Critical' vulnerability usually implies that an attacker can execute code remotely (RCE) or gain unauthorized access with very little effort. A 'Low' vulnerability might only be exploitable under very specific, unlikely conditions.</p>
      
      <h2>The Problem with Automated Fixes</h2>
      <p>While <code>npm audit fix</code> is convenient, it can sometimes introduce breaking changes or fail to resolve nested vulnerabilities. A professional DevSecOps workflow involves:</p>
      <ol>
        <li>Identifying the vulnerable path using a tool like DevShield.</li>
        <li>Determining if the vulnerable function is actually used in your application.</li>
        <li>Testing the upgrade in a staged environment before deploying to production.</li>
      </ol>

      <h2>Integrating Security into CI/CD</h2>
      <p>The best time to catch a vulnerability is before it's even merged. By using the DevShield CLI in your GitHub Actions, you can automatically block PRs that introduce high-risk dependencies, ensuring your production branch remains clean.</p>
    `,
  },
  "credential-hygiene-2024": {
    title: "Credential Hygiene in 2024: Best Practices",
    date: "April 28, 2024",
    readTime: "10 min read",
    author: "Sarah Chen",
    category: "Privacy",
    content: `
      <p>In an era where data breaches are a weekly occurrence, managing your digital credentials has never been more critical. Your email address and password are often the keys to your entire digital life, and once they're leaked, the clock starts ticking.</p>
      
      <h2>The Danger of Password Reuse</h2>
      <p>The primary reason breaches are so effective is password reuse. If you use the same password for your personal email and a random forum that gets hacked, attackers will immediately try that combination on banking sites, Amazon, and social media. This is known as credential stuffing.</p>
      
      <h2>Privacy-First Monitoring</h2>
      <p>Many "Have I Been Pwned" style tools require you to trust them with your email address. At DevShield, we believe in a different approach. Using <strong>k-Anonymity</strong>, we allow you to check for breaches without ever sending your full identifier to our servers.</p>
      
      <h2>What to do after a breach?</h2>
      <p>If DevShield alerts you to a breach, follow these steps immediately:</p>
      <ul>
        <li>Change the password for the affected service.</li>
        <li>Change the password for any other service where you used a similar password.</li>
        <li>Enable Two-Factor Authentication (2FA) wherever possible.</li>
        <li>Consider using a password manager like Bitwarden or 1Password.</li>
      </ul>
    `,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogContent[slug as keyof typeof blogContent];

  if (!post) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Post not found</h1>
        <Link href="/blog" className="mt-4 text-accentBlue hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl py-12 px-4 sm:px-6"
    >
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-textSecondary hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to articles
      </Link>

      <article>
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-4 text-sm font-medium text-textSecondary">
            <span className="rounded-full bg-accentBlue/10 px-3 py-1 text-accentBlue">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-between border-y border-border py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accentPurple/20 text-accentPurple">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{post.author}</p>
                <p className="text-xs text-textSecondary">Security Researcher</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-sm text-textSecondary">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
              <button className="rounded-full p-2 text-textSecondary hover:bg-surface hover:text-white transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div 
          className="prose prose-invert max-w-none prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4 prose-p:text-textSecondary prose-p:leading-relaxed prose-li:text-textSecondary prose-blockquote:border-accentBlue prose-blockquote:bg-accentBlue/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <div className="mt-16 rounded-2xl bg-surface/50 border border-border p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Want to secure your apps?</h3>
        <p className="text-textSecondary mb-6">Use our NPM Audit tool to check your dependencies for vulnerabilities today.</p>
        <Link
          href="/npm-audit"
          className="inline-flex items-center justify-center rounded-xl bg-accentBlue px-6 py-3 text-sm font-bold text-white hover:bg-accentCyan transition-all hover:scale-105"
        >
          Try NPM Auditor
        </Link>
      </div>
    </motion.div>
  );
}

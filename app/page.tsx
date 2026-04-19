import Link from "next/link";
import { Package, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border bg-secondaryBg px-6 py-12 shadow-card sm:px-10">
        <p className="font-mono text-sm text-accentCyan">DevShield</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-textPrimary sm:text-5xl">
          Audit before you install. Check before you trust.
        </h1>
        <p className="mt-4 max-w-3xl text-base text-textSecondary sm:text-lg">
          DevShield unifies npm package risk analysis and credential breach
          monitoring into one security-focused toolkit for developers and teams.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/npm-audit"
            className="rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple px-5 py-3 text-sm font-semibold text-textPrimary transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Start npm Audit
          </Link>
          <Link
            href="/credential-check"
            className="rounded-lg border border-border bg-primaryBg px-5 py-3 text-sm font-semibold text-textSecondary transition hover:text-textPrimary"
          >
            Check Credentials
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
          <div className="inline-flex rounded-md bg-accentBlue/20 p-2 text-accentBlue">
            <Package className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-textPrimary">
            npm Package Risk Analyzer
          </h2>
          <p className="mt-2 text-sm text-textSecondary">
            Inspect package metadata, CVE exposure, maintenance signals, and
            risk scoring before adding dependencies.
          </p>
        </article>
        <article className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
          <div className="inline-flex rounded-md bg-danger/20 p-2 text-danger">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-textPrimary">
            Credential Leak Monitor
          </h2>
          <p className="mt-2 text-sm text-textSecondary">
            Check leaked credentials, evaluate breach exposure, and generate
            safer replacements with privacy-first workflows.
          </p>
        </article>
      </section>
    </div>
  );
}

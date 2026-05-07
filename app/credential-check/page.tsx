"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import BreachCard, { type BreachSource } from "@/components/credential/BreachCard";
import EmailInput from "@/components/credential/EmailInput";
import PasswordChecker from "@/components/credential/PasswordChecker";
import PasswordGenerator from "@/components/credential/PasswordGenerator";
import SeverityStats from "@/components/credential/SeverityStats";
import Skeleton from "@/components/ui/Skeleton";

type Tab = "email" | "password";

interface LeakcheckPayload {
  found: number;
  sources: BreachSource[];
}

export default function CredentialCheckPage() {
  const [breachHint, setBreachHint] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LeakcheckPayload | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setBreachHint(params.get("breach"));
  }, []);

  const runEmailCheck = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/leakcheck/breaches?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Failed to run breach check." }));
        throw new Error(body.error || "Failed to run breach check.");
      }

      const data = (await response.json()) as LeakcheckPayload;
      setResult({
        found: data.found || 0,
        sources: Array.isArray(data.sources) ? data.sources : [],
      });
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Failed to run breach check.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <section className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card sm:p-8">
        <div className="inline-flex rounded-md bg-danger/20 p-2 text-danger">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-textPrimary">Credential Leak Monitor</h1>
        <p className="mt-2 text-sm text-textSecondary">
          Check leaked email exposure and validate password breach risk before reuse.
        </p>
        {breachHint ? (
          <p className="mt-3 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
            Timeline context: {breachHint}
          </p>
        ) : null}
      </section>

      <div className="inline-flex rounded-lg border border-border bg-secondaryBg p-1">
        <button
          type="button"
          onClick={() => setTab("email")}
          className={`rounded-md px-4 py-2 text-sm transition ${
            tab === "email" ? "bg-primaryBg text-textPrimary" : "text-textSecondary hover:text-textPrimary"
          }`}
        >
          Email Check
        </button>
        <button
          type="button"
          onClick={() => setTab("password")}
          className={`rounded-md px-4 py-2 text-sm transition ${
            tab === "password" ? "bg-primaryBg text-textPrimary" : "text-textSecondary hover:text-textPrimary"
          }`}
        >
          Password Check
        </button>
      </div>

      {tab === "email" ? (
        <div className="space-y-4">
          <EmailInput isLoading={isLoading} onSubmit={runEmailCheck} />

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-28" />
              <div className="grid gap-4 xl:grid-cols-2">
                <Skeleton className="h-44" />
                <Skeleton className="h-44" />
              </div>
            </div>
          ) : null}

          {error ? (
            <section className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
              {error}
            </section>
          ) : null}

          {!isLoading && hasSearched && result && result.found === 0 ? (
            <section className="rounded-xl border border-success/30 bg-success/10 p-6">
              <h2 className="text-lg font-semibold text-success">No breaches found</h2>
              <p className="mt-2 text-sm text-textSecondary">
                This email was not found in the scanned public breach sources.
              </p>
            </section>
          ) : null}

          {!isLoading && result && result.found > 0 ? (
            <div className="space-y-4">
              <SeverityStats sources={result.sources} />
              <div className="grid gap-4 xl:grid-cols-2">
                {result.sources.map((source, index) => (
                  <BreachCard
                    key={`${source.name}-${source.date}-${index}`}
                    source={source}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {!hasSearched ? (
            <section className="rounded-xl border border-border bg-secondaryBg p-8 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-accentBlue" />
              <p className="mt-3 text-sm text-textSecondary">
                Run an email check to view breach sources and severity breakdown.
              </p>
            </section>
          ) : null}
        </div>
      ) : null}

      {tab === "password" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <PasswordChecker />
          <PasswordGenerator />
        </div>
      ) : null}

      <section className="mt-12 rounded-2xl border border-border bg-surface/30 p-8 shadow-card">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-accentBlue" />
          Credential Security Guide
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-accentCyan uppercase tracking-wider">The Risk</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Credential stuffing is responsible for over 60% of unauthorized login attempts. When one site is breached, attackers use automated tools to try those same credentials on every other major platform.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-accentCyan uppercase tracking-wider">The Solution</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Use unique, complex passwords for every service. A password manager is the only effective way to manage the 100+ unique credentials the average user now possesses.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-accentCyan uppercase tracking-wider">Our Privacy</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              We never see your password. Our &quot;Zero-Knowledge&quot; check uses mathematical hashes to verify breach status without ever transmitting your actual password or email to our database.
            </p>
          </div>
        </div>
      </section>

      <footer className="rounded-lg border border-border bg-secondaryBg p-4 text-center text-xs text-textSecondary">
        Powered by{" "}
        <span className="font-semibold text-accentBlue">
          DevShield
        </span>
      </footer>
    </div>
  );
}

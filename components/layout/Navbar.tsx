import Link from "next/link";
import { Moon, Shield, Star } from "lucide-react";

const navItems = [
  { href: "/npm-audit", label: "npm Audit" },
  { href: "/credential-check", label: "Credential Check" },
  { href: "/breach-timeline", label: "Breach Timeline" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-secondaryBg/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-lg font-semibold text-textPrimary"
        >
          <Shield className="h-5 w-5 text-accentCyan" />
          DevShield
        </Link>

        <div className="order-3 flex w-full items-center justify-center gap-2 text-sm sm:order-2 sm:w-auto sm:gap-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-textSecondary transition hover:bg-surface hover:text-textPrimary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="order-2 flex items-center gap-2 sm:order-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-primaryBg px-3 py-2 text-sm text-textSecondary transition hover:text-textPrimary"
          >
            <Star className="h-4 w-4" />
            Star
          </a>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-primaryBg px-3 py-2 text-sm text-textSecondary"
            aria-label="Theme toggle (dark only)"
            title="Dark mode only in this version"
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
        </div>
      </nav>
    </header>
  );
}

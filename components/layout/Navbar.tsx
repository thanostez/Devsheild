"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Star, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: "/npm-audit", label: "npm Audit" },
  { href: "/credential-check", label: "Credential Check" },
  { href: "/breach-timeline", label: "Breach Timeline" },
  { href: "/docs", label: "Documentation" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-border bg-secondaryBg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-secondaryBg/60 py-3 shadow-lg"
          : "bg-transparent py-4 border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-xl font-bold text-textPrimary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accentBlue to-accentPurple shadow-lg shadow-accentBlue/20 transition-transform group-hover:scale-110">
            <Shield className="h-5 w-5 text-white" />
          </div>
          DevShield
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center p-1 rounded-xl bg-surface/30 border border-border/50 backdrop-blur-md md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-textSecondary hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-lg bg-surface border border-border shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://github.com/thanostez/"
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-4 py-2 text-sm font-medium text-textSecondary backdrop-blur-md transition-all hover:bg-textPrimary hover:text-primaryBg hover:border-textPrimary hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <Star className="h-4 w-4 transition-transform group-hover:scale-110" />
            Star
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex p-2 text-textSecondary md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
            className="absolute inset-x-0 top-full z-40 border-b border-border bg-secondaryBg/95 pb-4 pt-2 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                      isActive
                        ? "bg-accentBlue/10 text-accentBlue"
                        : "text-textSecondary hover:bg-surface/60 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-4 flex flex-col gap-3 border-t border-border/50 pt-4">
                <a
                  href="https://github.com/thanostez/Devsheild"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-surface to-surface/50 border border-border px-4 py-3 text-sm font-bold text-white transition-all hover:border-textSecondary/50 hover:shadow-lg"
                >
                  <Star className="h-4 w-4" />
                  Give us a Star on GitHub
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

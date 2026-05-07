import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto bg-secondaryBg/50 backdrop-blur-md pb-6 pt-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 sm:flex-row">
        <div className="flex items-center gap-2 font-mono text-lg font-semibold text-textPrimary">
          <Shield className="h-5 w-5 text-accentCyan" />
          DevShield
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-textSecondary">
          <Link href="/blog" className="transition-colors hover:text-white">
            Blog
          </Link>
          <Link href="/docs" className="transition-colors hover:text-white">
            Documentation
          </Link>
          <Link href="/terms-and-conditions" className="transition-colors hover:text-white">
            Terms & Conditions
          </Link>
          <Link href="/privacy-policy" className="transition-colors hover:text-white">
            Privacy Policy
          </Link>
        </div>

        <div className="text-xs text-textDim flex flex-col items-center sm:items-end">
          <span>&copy; {new Date().getFullYear()} DevShield.</span>
          <span>All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

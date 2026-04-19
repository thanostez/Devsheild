"use client";

export interface PasswordStrengthResult {
  score: number;
  label: "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";
  checks: {
    length: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
    commonWord: boolean;
  };
}

const COMMON_WORDS = ["password", "qwerty", "admin", "welcome", "letmein", "123456"];

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
    commonWord: !COMMON_WORDS.some((word) => password.toLowerCase().includes(word)),
  };

  const score = Object.values(checks).reduce((sum, pass) => sum + (pass ? 1 : 0), 0);

  if (score <= 1) return { score, label: "Weak", checks };
  if (score === 2) return { score, label: "Fair", checks };
  if (score === 3) return { score, label: "Good", checks };
  if (score === 4) return { score, label: "Strong", checks };
  return { score, label: "Very Strong", checks };
}

function getColor(label: PasswordStrengthResult["label"]): string {
  if (label === "Weak") return "#DC2626";
  if (label === "Fair") return "#EF4444";
  if (label === "Good") return "#F59E0B";
  if (label === "Strong") return "#06B6D4";
  return "#10B981";
}

export default function PasswordStrengthMeter({ password }: { password: string }) {
  const result = evaluatePasswordStrength(password);
  const width = Math.max(6, Math.round((result.score / 5) * 100));
  const color = getColor(result.label);

  return (
    <div className="rounded-lg border border-border bg-primaryBg p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-textSecondary">Strength</span>
        <span className="font-semibold" style={{ color }}>
          {result.label}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded bg-secondaryBg">
        <div className="h-full rounded transition-all" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <p className="mt-2 text-xs text-textSecondary">
        Use 12+ chars with uppercase, numbers, symbols, and avoid common words.
      </p>
    </div>
  );
}


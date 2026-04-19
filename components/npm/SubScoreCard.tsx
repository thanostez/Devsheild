import { LucideIcon } from "lucide-react";

interface SubScoreCardProps {
  label: string;
  score: number;
  icon: LucideIcon;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#06B6D4";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

export default function SubScoreCard({ label, score, icon: Icon }: SubScoreCardProps) {
  const color = getScoreColor(score);

  return (
    <article className="rounded-xl border border-border bg-secondaryBg p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-md p-2" style={{ backgroundColor: `${color}33`, color }}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold" style={{ color }}>
          {score}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-medium text-textSecondary">{label}</h3>
      <div className="mt-3 h-2 w-full overflow-hidden rounded bg-primaryBg">
        <div
          className="h-full rounded transition-all duration-700"
          style={{ width: `${Math.max(0, Math.min(100, score))}%`, backgroundColor: color }}
        />
      </div>
    </article>
  );
}

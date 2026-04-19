"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getRiskColor, getRiskLabel } from "@/lib/riskScore";

interface OverallScoreRingProps {
  score: number;
}

export default function OverallScoreRing({ score }: OverallScoreRingProps) {
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const riskPercent = Math.max(0, Math.min(100, score));
  const color = getRiskColor(score);
  const label = getRiskLabel(score);

  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(riskPercent), 80);
    return () => clearTimeout(timer);
  }, [riskPercent]);

  const strokeDashoffset = useMemo(
    () => circumference - (animatedScore / 100) * circumference,
    [animatedScore, circumference],
  );

  return (
    <section className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
      <p className="text-sm text-textSecondary">Overall Risk Score</p>
      <div className="relative mt-4 flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(30,45,74,0.8)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 900ms ease" }}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <AlertTriangle className="mb-2 h-5 w-5" style={{ color }} />
          <span className="text-4xl font-bold" style={{ color }}>
            {riskPercent}
          </span>
          <span className="text-xs font-semibold text-textSecondary">{label}</span>
        </div>
      </div>
    </section>
  );
}

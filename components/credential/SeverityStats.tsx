"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BreachSource } from "@/components/credential/BreachCard";

function classifySource(source: BreachSource): "critical" | "moderate" | "low" {
  const fields = source.fields || [];
  if (fields.length === 0) return "low";

  let level: "critical" | "moderate" | "low" = "low";

  for (const field of fields) {
    const value = field.toLowerCase();
    if (
      value.includes("password") ||
      value.includes("credit") ||
      value.includes("card") ||
      value.includes("ssn") ||
      value.includes("social security") ||
      value.includes("financial") ||
      value.includes("bank")
    ) {
      return "critical";
    }

    if (value.includes("phone") || value.includes("address") || value.includes("location")) {
      level = "moderate";
    }
  }

  return level;
}

export default function SeverityStats({ sources }: { sources: BreachSource[] }) {
  const summary = sources.reduce(
    (acc, source) => {
      const severity = classifySource(source);
      if (severity === "critical") acc.critical += 1;
      else if (severity === "moderate") acc.moderate += 1;
      else acc.low += 1;
      return acc;
    },
    { critical: 0, moderate: 0, low: 0 },
  );

  const data = [
    { name: "Critical", value: summary.critical, color: "#DC2626" },
    { name: "Moderate", value: summary.moderate, color: "#F59E0B" },
    { name: "Low", value: summary.low, color: "#10B981" },
  ].filter((item) => item.value > 0);

  return (
    <section className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
      <h2 className="text-lg font-semibold text-textPrimary">Severity Summary</h2>
      <p className="mt-2 text-sm text-textSecondary">
        Found in {sources.length} breaches - {summary.critical} critical, {summary.moderate} moderate, {summary.low} low
      </p>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#0F1629", border: "1px solid #1E2D4A" }}
              labelStyle={{ color: "#F1F5F9" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}


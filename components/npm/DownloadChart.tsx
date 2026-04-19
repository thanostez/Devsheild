"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DownloadPoint } from "@/lib/npmAuditClient";

interface DownloadChartProps {
  data: DownloadPoint[];
}

export default function DownloadChart({ data }: DownloadChartProps) {
  return (
    <section className="rounded-xl border border-border bg-secondaryBg p-6 shadow-card">
      <h2 className="text-lg font-semibold text-textPrimary">Download Trend (52 weeks)</h2>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1E2D4A" strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tick={{ fill: "#94A3B8", fontSize: 10 }}
              tickFormatter={(value: string) => value?.slice(5) || ""}
            />
            <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0F1629", border: "1px solid #1E2D4A" }}
              labelStyle={{ color: "#F1F5F9" }}
              formatter={(value) => {
                const num = typeof value === "number" ? value : Number(value || 0);
                return [num.toLocaleString(), "Downloads"];
              }}
            />
            <Area
              type="monotone"
              dataKey="downloads"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#downloadGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { BreachRecord } from "@/lib/breachData";

interface BreachTimelineProps {
  breaches: BreachRecord[];
  onSelect: (breach: BreachRecord) => void;
}

function classColor(dataClasses: string[]): string {
  const classes = dataClasses.map((item) => item.toLowerCase());
  if (classes.some((item) => item.includes("password") || item.includes("credit") || item.includes("ssn"))) {
    return "#DC2626";
  }
  if (classes.some((item) => item.includes("phone") || item.includes("address") || item.includes("location"))) {
    return "#F59E0B";
  }
  return "#10B981";
}

function yPosition(seed: string, height: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash % 1000) / 1000;
  return 18 + normalized * (height - 36);
}

export default function BreachTimeline({ breaches, onSelect }: BreachTimelineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || breaches.length === 0) return;

    const svgEl = svgRef.current;
    const container = containerRef.current;
    const tooltip = tooltipRef.current;

    const width = Math.max(1100, container.clientWidth);
    const height = 420;
    const margin = { top: 24, right: 24, bottom: 50, left: 24 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const years = breaches.map((item) => new Date(item.date).getFullYear());
    const minYear = d3.min(years) ?? 2007;
    const maxYear = d3.max(years) ?? minYear + 1;
    const maxPwn = d3.max(breaches, (item) => item.pwnCount) ?? 1;

    const x = d3.scaleLinear().domain([minYear - 0.25, maxYear + 0.25]).range([0, plotWidth]);
    const r = d3.scaleSqrt().domain([1, maxPwn]).range([3, 20]);

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const root = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const axis = root
      .append("g")
      .attr("transform", `translate(0,${plotHeight + 8})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(Math.min(24, maxYear - minYear + 1))
          .tickFormat((value) => `${value}`),
      );

    axis.selectAll("text").attr("fill", "#94A3B8").style("font-size", "10px");
    axis.selectAll("line,path").attr("stroke", "#1E2D4A");

    root
      .append("line")
      .attr("x1", 0)
      .attr("x2", plotWidth)
      .attr("y1", plotHeight / 2)
      .attr("y2", plotHeight / 2)
      .attr("stroke", "#1E2D4A")
      .attr("stroke-width", 1);

    const pointsGroup = root.append("g");

    const points = pointsGroup
      .selectAll("circle")
      .data(breaches)
      .enter()
      .append("circle")
      .attr("cx", (item) => x(new Date(item.date).getFullYear()))
      .attr("cy", (item) => yPosition(item.id, plotHeight))
      .attr("r", (item) => r(item.pwnCount))
      .attr("fill", (item) => classColor(item.dataClasses))
      .attr("fill-opacity", 0.7)
      .attr("stroke", "#0A0E1A")
      .attr("stroke-width", 1.2)
      .style("cursor", "pointer");

    points
      .on("mousemove", (event, item) => {
        if (!tooltip) return;
        tooltip.style.display = "block";
        tooltip.style.left = `${event.pageX + 14}px`;
        tooltip.style.top = `${event.pageY - 18}px`;
        tooltip.innerHTML = `
          <div style="font-weight:600;color:#F1F5F9">${item.name}</div>
          <div style="color:#94A3B8">${item.date}</div>
          <div style="color:#94A3B8">${item.pwnCount.toLocaleString()} records</div>
        `;
      })
      .on("mouseleave", () => {
        if (!tooltip) return;
        tooltip.style.display = "none";
      })
      .on("click", (_, item) => {
        onSelect(item);
      });

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        const zx = event.transform.rescaleX(x);
        points.attr("cx", (item) => zx(new Date(item.date).getFullYear()));
        axis.call(
          d3
            .axisBottom(zx)
            .ticks(Math.min(24, maxYear - minYear + 1))
            .tickFormat((value) => `${value}`),
        );
        axis.selectAll("text").attr("fill", "#94A3B8").style("font-size", "10px");
        axis.selectAll("line,path").attr("stroke", "#1E2D4A");
      });

    svg.call(zoom);
  }, [breaches, onSelect]);

  return (
    <section className="rounded-xl border border-border bg-secondaryBg p-5 shadow-card">
      <h2 className="text-lg font-semibold text-textPrimary">Breach Timeline Explorer</h2>
      <p className="mt-2 text-sm text-textSecondary">
        Zoom and pan horizontally. Circle size reflects exposed record count.
      </p>
      <div ref={containerRef} className="mt-4 overflow-x-auto">
        <svg ref={svgRef} className="h-[420px] min-w-[1100px] w-full" />
      </div>
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-50 hidden rounded border border-border bg-secondaryBg px-3 py-2 text-xs shadow-card"
      />
    </section>
  );
}


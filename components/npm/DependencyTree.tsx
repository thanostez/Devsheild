/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Loader2, Network } from "lucide-react";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  radius: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

export default function DependencyTree({ packageName }: { packageName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchTree = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const getDeps = async (pkg: string): Promise<string[]> => {
          try {
            // Npm registry fetch limit workaround using jsdelivr or direct registry
            const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
            if (!res.ok) return [];
            const data = await res.json();
            return Object.keys(data.dependencies || {});
          } catch {
            return [];
          }
        };

        const nodesMap: Map<string, Node> = new Map();
        const links: Link[] = [];

        // Root node
        nodesMap.set(packageName, { id: packageName, group: 0, radius: 25 });

        // Depth 1
        const lvl1 = await getDeps(packageName);
        for (const dep of lvl1) {
          if (!nodesMap.has(dep)) {
            nodesMap.set(dep, { id: dep, group: 1, radius: 16 });
          }
          links.push({ source: packageName, target: dep });
        }

        // Depth 2 (limit to 12 level-1 packages, and 8 level-2 per package to prevent browser crash)
        const limitedLvl1 = lvl1.slice(0, 12);
        await Promise.all(
          limitedLvl1.map(async (dep) => {
            const lvl2 = await getDeps(dep);
            const limitedLvl2 = lvl2.slice(0, 8);
            for (const sub of limitedLvl2) {
              if (!nodesMap.has(sub)) {
                nodesMap.set(sub, { id: sub, group: 2, radius: 10 });
              }
              // Prevent duplicate links
              if (!links.some((l) => l.source === dep && l.target === sub)) {
                links.push({ source: dep, target: sub });
              }
            }
          })
        );

        if (!active) return;

        const finalNodes = Array.from(nodesMap.values());
        renderGraph(finalNodes, links);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to generate visual tree");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchTree();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageName]);

  const renderGraph = (nodes: Node[], links: Link[]) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Clear previous graph
    d3.select(container).selectAll("*").remove();

    if (nodes.length <= 1 && links.length === 0) {
       const p = document.createElement("p");
       p.className = "text-textSecondary text-center mt-10 text-sm";
       p.textContent = "No dependencies found for this package. It is completely standalone.";
       container.appendChild(p);
       return;
    }

    const { width, height } = container.getBoundingClientRect();
    const finalWidth = width || 800;
    const finalHeight = height || 500;

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", finalWidth)
      .attr("height", finalHeight)
      .attr("viewBox", [0, 0, finalWidth, finalHeight])
      .attr("style", "max-width: 100%; height: auto; display: block;")
      // Adding zoom behavior
      .call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.5, 4]).on("zoom", (e) => {
         g.attr("transform", e.transform);
      }))
      .on("dblclick.zoom", null); // disable double click zoom if annoying

    const g = svg.append("g");

    // Cyberpunk color palette for node levels
    const colorScale = d3.scaleOrdinal<number, string>()
      .domain([0, 1, 2])
      .range(["#E11D48", "#38BDF8", "#A78BFA"]); // Red root, cyan level 1, purple level 2

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(60))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(finalWidth / 2, finalHeight / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.radius + 10).iterations(2));

    // Links (glowy lines)
    const link = g
      .append("g")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#334155")
      .attr("stroke-width", Math.sqrt(2));

    // Nodes (glowing orbs)
    const node = g
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => colorScale(d.group))
      .attr("stroke", "#0F172A")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      // @ts-expect-error D3 typings are complex
      .call(drag(simulation));

    // Add glowing filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "2").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    
    node.attr("filter", "url(#glow)");

    // Tooltips natively via Title
    node.append("title").text((d) => d.id);

    // Labels for the most important nodes (depth 0 and 1)
    const label = g
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => (d.group < 2 ? d.id : "")) // only label depth 0 and 1
      .attr("font-size", (d) => (d.group === 0 ? "14px" : "10px"))
      .attr("font-weight", (d) => (d.group === 0 ? "bold" : "normal"))
      .attr("fill", "#F8FAFC")
      .attr("dx", 15)
      .attr("dy", 4);

    // Simulation tick logic
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x!).attr("cy", (d: any) => d.y!);
      label.attr("x", (d: any) => d.x!).attr("y", (d: any) => d.y!);
    });

    return () => {
      simulation.stop();
    };
  };

  const drag = (simulation: d3.Simulation<Node, undefined>) => {
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
  };

  return (
    <section className="space-y-4 rounded-xl border border-border bg-secondaryBg p-6 shadow-card overflow-hidden relative">
      <div className="flex items-center gap-2">
        <Network className="h-5 w-5 text-accentPurple" />
        <h2 className="text-lg font-semibold text-textPrimary">Dependency Tree Explorer</h2>
      </div>
      <p className="text-sm text-textSecondary">
        Interactive map of transitive dependencies up to 2 levels deep. Scroll to zoom, click and drag nodes to explore relationships.
      </p>

      <div className="relative mt-4 h-[500px] w-full rounded-xl border border-border bg-[#030610] overflow-hidden shadow-inner flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#030610]/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-accentPurple" />
            <p className="mt-4 animate-pulse text-sm font-medium text-textSecondary">
              Mapping transitive dependencies...
            </p>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* The D3 Canvas */}
        <div ref={containerRef} className="h-full w-full" />

        {/* Legend Overlay */}
        {!isLoading && !error && (
          <div className="absolute bottom-4 left-4 rounded-lg border border-border/50 bg-secondaryBg/80 p-3 backdrop-blur-md">
            <div className="flex flex-col gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#E11D48] shadow-[0_0_8px_#E11D48]" />
                <span className="text-textSecondary">Root Package</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                <span className="text-textSecondary">Direct Dependency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#A78BFA] shadow-[0_0_8px_#A78BFA]" />
                <span className="text-textSecondary">Transitive (Nested)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

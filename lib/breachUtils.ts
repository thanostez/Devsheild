import type { BreachRecord } from "@/lib/breachData";

export type BreachSort = "date" | "size" | "severity";

function getSeverityWeight(breach: BreachRecord): number {
  const classes = breach.dataClasses.map((item) => item.toLowerCase());
  if (classes.some((item) => item.includes("password") || item.includes("credit") || item.includes("ssn"))) {
    return 3;
  }
  if (classes.some((item) => item.includes("phone") || item.includes("address") || item.includes("location"))) {
    return 2;
  }
  return 1;
}

export function groupBreachesByYear(records: BreachRecord[]): Record<number, BreachRecord[]> {
  return records.reduce<Record<number, BreachRecord[]>>((acc, breach) => {
    const year = new Date(breach.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(breach);
    return acc;
  }, {});
}

export function extractDataClasses(records: BreachRecord[]): string[] {
  const unique = new Set<string>();
  for (const breach of records) {
    for (const item of breach.dataClasses) {
      unique.add(item);
    }
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}

export function filterBreaches(
  records: BreachRecord[],
  yearRange: [number, number],
  selectedClasses: string[],
  searchTerm: string,
): BreachRecord[] {
  const [minYear, maxYear] = yearRange;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const classes = new Set(selectedClasses);

  return records.filter((breach) => {
    const year = new Date(breach.date).getFullYear();
    if (year < minYear || year > maxYear) return false;

    if (classes.size > 0 && !breach.dataClasses.some((item) => classes.has(item))) {
      return false;
    }

    if (!normalizedSearch) return true;

    return (
      breach.name.toLowerCase().includes(normalizedSearch) ||
      breach.description.toLowerCase().includes(normalizedSearch)
    );
  });
}

export function sortBreaches(records: BreachRecord[], sort: BreachSort): BreachRecord[] {
  const clone = [...records];
  clone.sort((a, b) => {
    if (sort === "size") return b.pwnCount - a.pwnCount;
    if (sort === "severity") {
      const severityDiff = getSeverityWeight(b) - getSeverityWeight(a);
      if (severityDiff !== 0) return severityDiff;
      return b.pwnCount - a.pwnCount;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  return clone;
}


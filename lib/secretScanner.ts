export type SecretSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface SecretFinding {
  type: string;
  severity: SecretSeverity;
  filePath: string;
  line: number;
  snippet: string;
  confidence: number;
}

interface SecretRule {
  type: string;
  severity: SecretSeverity;
  regex: RegExp;
  confidence: number;
}

const SECRET_RULES: SecretRule[] = [
  {
    type: "GitHub Token",
    severity: "CRITICAL",
    regex: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/,
    confidence: 0.98,
  },
  {
    type: "NPM Token",
    severity: "CRITICAL",
    regex: /\bnpm_[A-Za-z0-9]{20,}\b/,
    confidence: 0.97,
  },
  {
    type: "AWS Access Key",
    severity: "HIGH",
    regex: /\bAKIA[0-9A-Z]{16}\b/,
    confidence: 0.94,
  },
  {
    type: "Private Key Block",
    severity: "CRITICAL",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    confidence: 0.99,
  },
  {
    type: "Slack Token",
    severity: "HIGH",
    regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
    confidence: 0.92,
  },
];

const ENTROPY_TOKEN_REGEX = /[A-Za-z0-9_+=\/-]{20,}/g;

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}

function shannonEntropy(value: string): number {
  if (!value) return 0;
  const map = new Map<string, number>();
  for (const char of value) {
    map.set(char, (map.get(char) || 0) + 1);
  }

  let entropy = 0;
  map.forEach((count) => {
    const p = count / value.length;
    entropy -= p * Math.log2(p);
  });
  return entropy;
}

function looksLikeCredentialToken(token: string): boolean {
  const hasLetters = /[A-Za-z]/.test(token);
  const hasDigits = /\d/.test(token);
  const hasEntropyAlphabet = /[\/_+=-]/.test(token);
  return hasLetters && hasDigits && (hasEntropyAlphabet || token.length >= 28);
}

function scanLine(rawLine: string, filePath: string, line: number): SecretFinding[] {
  const findings: SecretFinding[] = [];
  const lineText = rawLine.trim();
  if (!lineText) return findings;

  for (const rule of SECRET_RULES) {
    const match = lineText.match(rule.regex);
    if (!match) continue;

    findings.push({
      type: rule.type,
      severity: rule.severity,
      filePath,
      line,
      snippet: match[0].slice(0, 160),
      confidence: clampConfidence(rule.confidence),
    });
  }

  const candidateTokens = lineText.match(ENTROPY_TOKEN_REGEX) || [];
  for (const token of candidateTokens) {
    if (!looksLikeCredentialToken(token)) continue;
    const entropy = shannonEntropy(token);
    if (entropy < 3.75) continue;

    findings.push({
      type: "High Entropy Secret",
      severity: entropy >= 4.2 ? "HIGH" : "MEDIUM",
      filePath,
      line,
      snippet: token.slice(0, 160),
      confidence: clampConfidence(Math.min(0.95, 0.65 + (entropy - 3.75) * 0.2)),
    });
  }

  return findings;
}

function dedupeFindings(findings: SecretFinding[]): SecretFinding[] {
  const seen = new Set<string>();
  const deduped: SecretFinding[] = [];
  for (const finding of findings) {
    const key = [
      finding.type,
      finding.filePath,
      finding.line,
      finding.snippet.toLowerCase(),
      finding.severity,
    ].join("|");

    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(finding);
  }

  const severityRank: Record<SecretSeverity, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  return deduped.sort((a, b) => {
    const bySeverity = severityRank[b.severity] - severityRank[a.severity];
    if (bySeverity !== 0) return bySeverity;
    if (a.filePath !== b.filePath) return a.filePath.localeCompare(b.filePath);
    return a.line - b.line;
  });
}

export function scanTextForSecrets(content: string, filePath: string): SecretFinding[] {
  const lines = content.split(/\r?\n/);
  const findings: SecretFinding[] = [];

  lines.forEach((lineText, index) => {
    findings.push(...scanLine(lineText, filePath, index + 1));
  });

  return dedupeFindings(findings);
}

export function scanPatchForSecrets(patch: string, filePath: string): SecretFinding[] {
  const findings: SecretFinding[] = [];
  const lines = patch.split("\n");
  let newLine = 1;

  for (const line of lines) {
    const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      newLine = Number(hunkMatch[1]);
      continue;
    }

    if (line.startsWith("+++")) {
      continue;
    }

    if (line.startsWith("+")) {
      const content = line.slice(1);
      findings.push(...scanLine(content, filePath, newLine));
      newLine += 1;
      continue;
    }

    if (line.startsWith(" ")) {
      newLine += 1;
      continue;
    }

    if (line.startsWith("-")) {
      continue;
    }
  }

  return dedupeFindings(findings);
}

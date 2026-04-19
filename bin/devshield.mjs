#!/usr/bin/env node

import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";

const execPromise = util.promisify(exec);

const Colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  FgCyan: "\x1b[36m",
  FgBlue: "\x1b[34m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgRed: "\x1b[31m",
  BgRed: "\x1b[41m",
};

console.log(`${Colors.Bright}${Colors.FgCyan}`);
console.log(`
   ___             _____ __    _     __    __
  / _ \\___ _  __  / __/ / /   (_)___/ /___/ /
 / // / -_) |/ / _\\ \\/ _ \\   / / -_) / _  / 
/____/\\__/|___/ /___/_//_/  /_/\\__/_/\\_,_/  
`);
console.log(`${Colors.Reset}`);
console.log(
  `${Colors.Bright}🛡️  DevShield CLI - Zero-Trust CI/CD Pipeline Auditor${Colors.Reset}\n`
);

const cwd = process.cwd();
const pkgPath = path.join(cwd, "package.json");

if (!fs.existsSync(pkgPath)) {
  console.error(
    `${Colors.BgRed} ERROR ${Colors.Reset} No package.json found in current directory.`
  );
  process.exit(1);
}

async function runDevShieldAudit() {
  console.log(
    `${Colors.FgBlue}INFO${Colors.Reset} Shielding dependencies found in local lockfile... Analyzing risk thresholds.\n`
  );

  let auditOutput = "";
  try {
    const { stdout } = await execPromise("npm audit --json", { maxBuffer: 1024 * 1024 * 10 });
    auditOutput = stdout;
  } catch (error) {
    // npm audit returns a non-zero exit code if vulnerabilities are found
    auditOutput = error.stdout;
  }

  if (!auditOutput) {
    console.error(`${Colors.BgRed} ERROR ${Colors.Reset} Could not run npm audit.`);
    process.exit(1);
  }

  const auditData = JSON.parse(auditOutput);
  const vulns = auditData.vulnerabilities || {};
  let blocked = false;
  let criticalCount = 0;

  for (const [pkgName, metadata] of Object.entries(vulns)) {
    const severity = metadata.severity.toUpperCase();
    
    let color = Colors.FgGreen;
    if (severity === "MODERATE") color = Colors.FgYellow;
    if (severity === "HIGH") {
      color = Colors.FgRed;
      criticalCount++;
      blocked = true;
    }
    if (severity === "CRITICAL") {
      color = Colors.BgRed;
      criticalCount++;
      blocked = true;
    }

    console.log(
      `[${color}${severity.padEnd(8).trim()}${Colors.Reset}] ${Colors.Bright}${pkgName}${Colors.Reset}`
    );
    console.log(`    ↳ Path: ${metadata.via.map((v) => (typeof v === "object" ? v.title : v)).join(", ")}`);
    
    if (severity === "CRITICAL" || severity === "HIGH") {
      console.log(
        `    ${Colors.FgRed}⚠️  Action Required: Update to v${metadata.fixAvailable?.version || "manual patching required"}${Colors.Reset}`
      );
    }
    console.log("");
  }

  if (Object.keys(vulns).length === 0) {
    console.log(`  ${Colors.FgGreen}✔️ PASSED: Zero vulnerabilities detected.${Colors.Reset}`);
  }

  console.log("---------------------------------------------------------");
  console.log(`Audit Summary: ${auditData.metadata.vulnerabilities.total} issues across ${auditData.metadata.dependencies.total} packages.`);
  
  if (blocked) {
    console.error(
      `\n${Colors.BgRed}${Colors.Bright} FAIL ${Colors.Reset} DevShield blocked this pipeline. ${criticalCount} HIGH/CRITICAL risk(s) detected.`
    );
    process.exit(1);
  } else {
    console.log(
      `\n${Colors.FgGreen}✔️ SUCCESS${Colors.Reset} All dependencies passed DevShield CI/CD checks.`
    );
    process.exit(0);
  }
}

runDevShieldAudit();

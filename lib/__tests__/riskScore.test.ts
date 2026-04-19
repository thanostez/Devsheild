import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateMaintenanceScore,
  calculateOverallRiskScore,
  calculatePopularityScore,
  calculateQualityScore,
  calculateSecurityScore,
  getRiskColor,
  getRiskLabel,
} from "@/lib/riskScore";

test("calculateSecurityScore([]) returns 100", () => {
  assert.equal(calculateSecurityScore([]), 100);
});

test("calculateSecurityScore([{severity:'CRITICAL'}]) returns 75", () => {
  assert.equal(calculateSecurityScore([{ severity: "CRITICAL" }]), 75);
});

test("calculateMaintenanceScore returns high value for package published yesterday", () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const score = calculateMaintenanceScore({
    lastPublished: yesterday,
    maintainersCount: 3,
    lastCommitDate: yesterday,
  });

  assert.equal(score, 100);
});

test("calculateMaintenanceScore returns low value for 3-year-old package", () => {
  const threeYearsAgo = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000);
  const score = calculateMaintenanceScore({
    lastPublished: threeYearsAgo,
    maintainersCount: 1,
    lastCommitDate: threeYearsAgo,
  });

  assert.equal(score, 0);
});

test("calculateOverallRiskScore weighted sum is correct", () => {
  const risk = calculateOverallRiskScore({
    security: 80,
    maintenance: 70,
    popularity: 60,
    quality: 50,
  });

  // safety = 80*0.4 + 70*0.3 + 60*0.2 + 50*0.1 = 70
  // risk = 100 - 70 = 30
  assert.equal(risk, 30);
});

test("edge cases (0 downloads, no maintainers) do not produce NaN", () => {
  const maintenance = calculateMaintenanceScore({
    lastPublished: new Date(),
    maintainersCount: 0,
    lastCommitDate: new Date(),
  });
  const popularity = calculatePopularityScore({ monthly: 0, trend: "down" });
  const quality = calculateQualityScore({ quality: 0, popularity: 0, maintenance: 0 });

  assert.equal(Number.isNaN(maintenance), false);
  assert.equal(Number.isNaN(popularity), false);
  assert.equal(Number.isNaN(quality), false);
  assert.equal(popularity, 5);
});

test("risk label and color mapping", () => {
  assert.equal(getRiskLabel(20), "LOW");
  assert.equal(getRiskLabel(45), "MODERATE");
  assert.equal(getRiskLabel(70), "HIGH");
  assert.equal(getRiskLabel(90), "CRITICAL");

  assert.equal(getRiskColor(20), "#10B981");
  assert.equal(getRiskColor(45), "#F59E0B");
  assert.equal(getRiskColor(70), "#EF4444");
  assert.equal(getRiskColor(90), "#DC2626");
});

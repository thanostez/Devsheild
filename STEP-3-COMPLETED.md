# STEP 3 COMPLETED - Risk Score Engine

Date: April 19, 2026

## What Was Built

1. Implemented `lib/riskScore.ts` as a pure TypeScript scoring module.
2. Added required exported functions:
   - `calculateSecurityScore(cves)`
   - `calculateMaintenanceScore(pkg)`
   - `calculatePopularityScore(downloads)`
   - `calculateQualityScore(scores)`
   - `calculateOverallRiskScore(all)`
   - `getRiskLabel(score)`
   - `getRiskColor(score)`
3. Implemented Security scoring exactly:
   - Start at 100
   - Penalties: `CRITICAL -25`, `HIGH -15`, `MEDIUM -8`, `LOW -3`
   - Minimum score 0
4. Implemented Maintenance scoring exactly:
   - Date buckets: `0-30 => 100`, `31-90 => 90`, `91-180 => 75`, `181-365 => 50`, `1-2 years => 25`, `2+ years => 10`
   - Single/no maintainer penalty: `-10`
   - Abandoned penalty (`2+ years no commits`): `-20`
5. Implemented Popularity scoring exactly from monthly thresholds.
6. Implemented Quality scoring from npm quality to 0-100.
7. Implemented overall risk calculation with exact weights:
   - `Security x 0.40`
   - `Maintenance x 0.30`
   - `Popularity x 0.20`
   - `Quality x 0.10`
   - `Risk = 100 - safety`
8. Added unit tests at `lib/__tests__/riskScore.test.ts`.
9. Added `npm test` script in `package.json` and wired TS test execution via `tsx`.

## Verification Checklist

- [x] `calculateSecurityScore([])` returns 100
  - Covered by unit test.
- [x] `calculateSecurityScore([{severity:'CRITICAL'}])` returns 75
  - Covered by unit test.
- [x] `calculateMaintenanceScore` returns correct value for package published yesterday
  - Covered by unit test; result `100`.
- [x] `calculateMaintenanceScore` returns low score for 3-year-old package
  - Covered by unit test; result `0`.
- [x] `calculateOverallRiskScore` weighted sum is correct
  - Covered by unit test; expected risk `30` for known inputs.
- [x] All edge cases (0 downloads, no maintainers) handled without NaN/crash
  - Covered by unit test.
- [x] Unit tests pass: `npm test`
  - Verified: `7/7` tests passed.

## Issues Encountered and Resolutions

1. `npm test` failed inside sandbox with `spawn EPERM`.
   - Resolution: reran `npm test` with escalated execution; all tests passed.
2. Needed TS-native test execution for `.ts` tests.
   - Resolution: added `tsx` and configured `"test": "tsx --test lib/__tests__/riskScore.test.ts"`.

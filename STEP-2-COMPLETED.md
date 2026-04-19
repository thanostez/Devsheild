# STEP 2 COMPLETED - API Proxy Routes (Backend)

Date: April 19, 2026

## What Was Built

1. Added shared API helpers in `lib/apiHelpers.ts`:
   - `fetchWithTimeout` (10-second upstream timeout)
   - `isAbortError`
   - `getClientIp`
   - `isSafePackageName`
2. Implemented `GET /api/npm/package` in `app/api/npm/package/route.ts`:
   - Accepts `?name=`
   - Proxies `https://registry.npmjs.org/{name}`
   - Returns name, version, description, license, maintainers, repository, dependenciesCount, lastPublishDate
   - Handles invalid input and 404 package-not-found
3. Implemented `GET /api/npm/downloads` in `app/api/npm/downloads/route.ts`:
   - Accepts `?name=`
   - Proxies `https://api.npmjs.org/downloads/range/last-year/{name}`
   - Aggregates to 52 weekly points
   - Returns array of `{ week, downloads }`
4. Implemented `GET /api/npm/scores` in `app/api/npm/scores/route.ts`:
   - Accepts `?name=`
   - Proxies npm search API
   - Returns `{ quality, popularity, maintenance }` as 0-100
5. Implemented `GET /api/github/repo` in `app/api/github/repo/route.ts`:
   - Accepts `?owner=&repo=`
   - Uses `Authorization: Bearer ${GITHUB_TOKEN}` when token exists
   - Returns stars, open_issues, last_push, contributors_url
6. Implemented `GET /api/cve` in `app/api/cve/route.ts`:
   - Accepts `?package=`
   - Proxies NVD 2.0 CVE API
   - Uses `apiKey` header when `NVD_API_KEY` is set
   - Enforces 500ms delay window between NVD calls
   - Returns `{ id, severity, cvss, description, published, affectedVersions }[]`
7. Implemented `GET /api/leakcheck/breaches` in `app/api/leakcheck/breaches/route.ts`:
   - Accepts `?email=`
   - Validates email format
   - Proxies `https://leakcheck.io/api/public?check={email}`
   - Returns `{ found, sources: [{ name, date }] }`
   - Added in-memory IP rate limiting (10 req/min)
8. Implemented `GET /api/hibp/password` in `app/api/hibp/password/route.ts`:
   - Accepts `?prefix=` (5-char SHA1 prefix)
   - Proxies `https://api.pwnedpasswords.com/range/{prefix}`
   - Returns raw text response
9. Implemented `GET /api/password/generate` in `app/api/password/generate/route.ts`:
   - Calls Passwordinator API 5 times with varied complexity profiles
   - Returns 5 generated passwords
   - Added retry + safe fallback password generation for upstream instability
10. Added consistent timeout/error handling across routes:
   - `400` for invalid inputs
   - `404` for package-not-found
   - `429` for LeakCheck rate limiting
   - `500` for upstream failures
   - `504` for upstream timeouts

## Verification Checklist

- [x] Test each route in browser/Postman with real data
  - Verified via live local dev server requests to all Step 2 endpoints.
- [x] `/api/npm/package?name=react` returns valid data
  - Result: `name=react`, `version=19.2.5`, dependencies count returned.
- [x] `/api/npm/downloads?name=react` returns 52 weekly data points
  - Result: `count=52`.
- [x] `/api/cve?package=lodash` returns CVE list (lodash has known CVEs)
  - Result: `count=10`, first CVE `CVE-2018-3721`.
- [x] `/api/leakcheck/breaches?email=example@example.com` returns breach sources from LeakCheck
  - Result: `found=1959`, `sources=288`.
- [x] `/api/hibp/password?prefix=5BAA6` returns list of hash suffixes
  - Result includes raw suffix list, first line `003CD215739D7C1B2218670D26F81408237:2`.
- [x] `/api/password/generate` returns 5 passwords
  - Result: `count=5`.
- [x] No API keys are visible in browser network tab for any route
  - Verified by design: all external calls are server-side route handlers under `/app/api`, no key material is sent to client.
- [x] Error states return proper HTTP status codes (400 for bad email, 500 for upstream failure)
  - Bad email (`/api/leakcheck/breaches?email=bad`) => `400`.
  - Upstream failure test (`/api/github/repo?owner=__invalid_owner__&repo=__invalid_repo__`) => `500`.
- [x] No TypeScript errors
  - Verified with successful `npm run build`.

## Issues Encountered and Resolutions

1. npm downloads range data came back daily rather than weekly.
   - Resolution: grouped into 7-day buckets and returned exactly 52 weekly points.
2. Passwordinator endpoint intermittently failed/timed out.
   - Resolution: added one retry per profile and deterministic fallback generation while still calling Passwordinator five times.
3. Local dev verification hit port conflicts (`EADDRINUSE`) during repeated checks.
   - Resolution: reran checks on a free port (`3002`) and completed full verification.

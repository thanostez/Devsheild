## DevShield

DevShield is a Next.js security toolkit with:

- npm package risk auditing
- credential leak monitoring
- breach timeline exploration

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and set:

- `GITHUB_TOKEN`
- `NVD_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_APP_URL`

## Build

```bash
npm run build
```

## Deploy (Vercel)

1. Authenticate:
```bash
npm exec vercel login
```

2. Link and deploy production:
```bash
npm exec vercel --prod
```

3. Set Vercel env vars to match `.env.local` values.

After deployment, update:
- `NEXT_PUBLIC_APP_URL` to your production URL
- Redeploy once so metadata/share URLs are correct

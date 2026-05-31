# Vercel preview deployments

The `apps/web` Next.js app deploys to Vercel. Every push to `main` becomes a
production build; every PR gets its own ephemeral preview URL — that's the
prototype link you'll share for review.

The NestJS API (`apps/api`) is **not** deployed to Vercel. It's a long-running
server and will get its own deploy target in a later sprint. The web app does
not call the API yet — it only imports types from `@muqsit/shared-types`.

## One-time setup (Vercel UI, ~60 seconds)

1. Go to https://vercel.com/new and import `hassanalthurwi-sys/muqsit-platform`.
2. **Root Directory** → `apps/web`.
3. Framework Preset is auto-detected as **Next.js**.
4. Install / Build commands are picked up from `apps/web/vercel.json`.
5. Click **Deploy**.

Vercel auto-detects the pnpm workspace at the repo root and installs from there.

## Environment variables

For the prototype (mock data only) none are required.

When the API is deployed later, add this in **Project Settings → Environment
Variables** (Preview + Production scopes):

| Name                 | Value                                           |
| -------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_API_URL`| URL of the deployed API (e.g. `https://api.muqsit.dev`) |

## Preview URLs

After the GitHub integration is connected, every open PR shows its preview URL
in the PR's checks section. Click the **"Preview"** check or the comment Vercel
posts on the PR.

## Notes

- The `installCommand` in `apps/web/vercel.json` walks up to the workspace root
  so pnpm resolves `@muqsit/shared-types` via `workspace:*`.
- `next.config.ts` already lists `@muqsit/shared-types` under
  `transpilePackages`, so the TypeScript source is bundled directly with no
  build step in the package.

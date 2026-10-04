# Cloudflare Workers Builds deployment

This repository targets Cloudflare **Workers Static Assets**, not a server-side
Worker and not the older manual upload workflow.

## Recommended setup

1. Push this repository to GitHub as `lepczynski-cloud/scratch-to-html-converter`.
2. In Cloudflare, open **Workers & Pages** and create a Worker connected to Git.
3. Select the GitHub repository.
4. Use the following build settings:

   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Root directory | `/` |
   | Build command | `npm run build` |
   | Deploy command | `npm run deploy` |
   | Preview command | `npm run deploy:preview` |

5. Name the Worker `scratch-to-html-converter`. The dashboard name must match
   `name` in `wrangler.jsonc`.
6. Save the configuration and run the first deployment.

No application secrets are required. Cloudflare creates the deployment token for
Git-connected builds.

## What happens after connection

- Every push to `main` clones the pinned TurboWarp Packager tag, verifies its full
  commit SHA, applies the UI overrides, builds `dist/`, creates a new Cloudflare version, and deploys it.
- A push to another enabled branch runs the Preview command and creates or updates
  an isolated Cloudflare Preview without replacing production.
- The build label shown in the interface contains the application version and
  short Git commit hash.

## Custom domain

Start with the generated `workers.dev` address. After the first successful
production deployment, add a custom domain in the Worker's **Settings > Domains
& Routes** section.

After choosing the public domain, update `WEBSITE` in
`overrides/src/packager/brand.js`. The value is embedded in the license notice of
generated games, so it should remain a durable address. The GitHub repository URL
is a safe default.

## Local manual deployment

```bash
npm install
npm run build
npx wrangler login
npm run deploy
```

The `wrangler` version is pinned in `package.json`. Do not replace it with an
unversioned global installation in CI.

## Troubleshooting

### Worker name mismatch

If Cloudflare reports that the project name does not match, rename the Worker or
change `name` in `wrangler.jsonc`. Keep the same value in both places.

### Build cannot download TurboWarp dependencies

The build needs outbound access to GitHub and npm. Retry transient failures. If a
corporate network blocks Git dependencies, build in GitHub Actions and deploy the
result from an environment with normal npm/GitHub access.

### Build is slow

The project deliberately builds from a pinned upstream source instead of using an
unreviewed browser bundle. The first build downloads and compiles TurboWarp. A
subsequent build may be faster when the platform restores its dependency cache.

### Old interface after deployment

The hosted build does not enable an application service worker, specifically to
avoid stale UI after deployments. Clear the browser cache only when the
Cloudflare deployment itself is already current but an intermediate CDN or local
cache still serves an older asset.

# Contributing

1. Use Node.js 24 or newer and Git.
2. Run `npm install` once to install the pinned Wrangler CLI.
3. Run `npm run verify` before committing.
4. Run `npm run build` for every change that affects the interface, build scripts,
   branding, or upstream version.
5. Test both `dist/index.html` through `npm run serve` and
   `dist/offline/scratch-to-html-converter.html` opened directly from disk.

Do not change `config/upstream.json` to `latest` or an unpinned branch. Keep the
release tag, version, and full commit SHA aligned. Upstream updates must be reviewed explicitly because the browser-facing Packager API is
not guaranteed to stay compatible between releases.

Contributions are accepted under the Mozilla Public License 2.0.

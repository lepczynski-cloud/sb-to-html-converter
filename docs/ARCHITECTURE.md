# Architecture

## Why an overlay build

The public `@turbowarp/packager` package exposes a Node.js API. The official
browser application is built from a different entry point with a browser adapter,
webpack chunks, scaffolding assets, and a standalone mode. The repository
therefore does not attempt to import the npm Node bundle in client-side code.

Instead, `scripts/build.mjs` performs these steps:

1. clone the exact tag from `config/upstream.json`;
2. verify that the tag resolves to the pinned full commit SHA;
3. verify the version and MPL-2.0 license from upstream `package.json`;
4. install upstream's locked dependencies with `npm ci`;
5. copy `overrides/` over the upstream source tree;
6. run the upstream production website build;
7. copy that build to this repository's `dist/`;
8. run the upstream standalone build;
9. add the single-file converter at
   `dist/offline/scratch-to-html-converter.html`;
10. copy privacy, 404, favicon, license, notice, and build metadata files.

## Runtime data flow

```text
User selects .sb/.sb2/.sb3
        ↓
File API reads the project in the browser
        ↓
TurboWarp loadProject analyses and normalizes it
        ↓
UI maps project extensions and selected settings into Packager options
        ↓
TurboWarp Packager creates one HTML document in browser memory
        ↓
Blob URL triggers a local download
```

The selected Scratch file is not posted to this application's server.

## Deliberate defaults

- Turbo mode: enabled.
- Autoplay: disabled to avoid browser audio/autoplay surprises.
- Green flag and Stop controls: enabled.
- Fullscreen control: enabled.
- Cloud variables: local storage, so the generated file is offline-friendly and
  does not silently connect players to a public cloud-variable server.
- Custom extensions: baked into the generated file when available.

## Version model

There are three distinct identifiers:

- `package.json` version: semantic application release, for example `0.1.0`;
- Git commit: immutable source revision and Cloudflare deployment build label;
- TurboWarp version: separately pinned upstream engine version.

A Cloudflare deployment is created per production commit. A GitHub Release is
created only for a semantic version tag.

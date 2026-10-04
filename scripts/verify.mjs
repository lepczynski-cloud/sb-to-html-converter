import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const requireFile = (relativePath) => {
  const absolutePath = path.join(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`Missing required file: ${relativePath}`);
  }
};

[
  'README.md',
  'LICENSE',
  'NOTICE',
  'PRIVACY.md',
  'package.json',
  'wrangler.jsonc',
  'config/upstream.json',
  'overrides/src/p4/P4.svelte',
  'overrides/src/p4/template.ejs',
  'overrides/src/packager/brand.js',
  '.github/workflows/ci.yml',
  '.github/workflows/release.yml'
].forEach(requireFile);

const packageJSON = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const upstream = JSON.parse(readFileSync(path.join(root, 'config', 'upstream.json'), 'utf8'));
if (packageJSON.license !== 'MPL-2.0') failures.push('package.json must use MPL-2.0.');
if (upstream.tag !== `v${upstream.version}`) failures.push('Pinned upstream tag and version do not match.');
if (!/^\d+\.\d+\.\d+$/.test(packageJSON.version)) failures.push('App version must be SemVer.');
if (!/^v\d+\.\d+\.\d+$/.test(upstream.tag)) failures.push('Upstream tag must be an exact release tag.');
if (!/^[0-9a-f]{40}$/.test(upstream.commit || '')) failures.push('Upstream commit must be a full 40-character SHA.');

const interfaceSource = readFileSync(path.join(root, 'overrides', 'src', 'p4', 'P4.svelte'), 'utf8');
for (const phrase of ['pl:', 'en:', 'loadProject.fromFile', 'new Packager()', 'options.extensions', 'bakeExtensions']) {
  if (!interfaceSource.includes(phrase)) failures.push(`Interface is missing expected marker: ${phrase}`);
}
if (interfaceSource.includes('innerHTML')) failures.push('Avoid innerHTML in the browser interface.');

const brandSource = readFileSync(path.join(root, 'overrides', 'src', 'packager', 'brand.js'), 'utf8');
if (!brandSource.includes('lepczynski-cloud/scratch-to-html-converter')) {
  failures.push('Branding does not point to the expected GitHub repository.');
}

const walk = (directory) => {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const absolute = path.join(directory, entry);
    if (statSync(absolute).isDirectory()) files.push(...walk(absolute));
    else files.push(absolute);
  }
  return files;
};

for (const file of walk(path.join(root, 'scripts')).filter((item) => item.endsWith('.mjs'))) {
  try {
    execFileSync(process.execPath, ['--check', file], {stdio: 'pipe'});
  } catch (error) {
    failures.push(`JavaScript syntax check failed: ${path.relative(root, file)}\n${error.stderr || error.message}`);
  }
}

if (failures.length) {
  console.error('Verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Repository structure and JavaScript syntax checks passed.');

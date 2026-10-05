import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const read = (relativePath) => readFileSync(path.join(root, relativePath), 'utf8');
const requireFile = (relativePath) => {
  if (!existsSync(path.join(root, relativePath))) failures.push(`Missing required file: ${relativePath}`);
};

[
  'README.md',
  'LICENSE',
  'NOTICE',
  'SECURITY.md',
  'package.json',
  'wrangler.jsonc',
  'config/upstream.json',
  'overrides/src/p4/P4.svelte',
  'overrides/src/p4/template.ejs',
  'overrides/src/packager/brand.js',
  'static/privacy.html',
  '.github/workflows/ci.yml',
  '.github/workflows/release.yml'
].forEach(requireFile);

const packageJSON = JSON.parse(read('package.json'));
const upstream = JSON.parse(read('config/upstream.json'));
const wrangler = JSON.parse(read('wrangler.jsonc'));
const readme = read('README.md');
const interfaceSource = read('overrides/src/p4/P4.svelte');
const brandSource = read('overrides/src/packager/brand.js');
const templateSource = read('overrides/src/p4/template.ejs');
const domain = 'sbtohtml.lepczynski.it';

if (packageJSON.license !== 'MPL-2.0') failures.push('package.json must use MPL-2.0.');
if (packageJSON.name !== 'sb-to-html-converter') failures.push('package.json name is incorrect.');
if (wrangler.name !== 'sb-to-html-converter') failures.push('wrangler.jsonc Worker name is incorrect.');
if (packageJSON.homepage !== `https://${domain}`) failures.push('package.json homepage is incorrect.');
if (!/^\d+\.\d+\.\d+$/.test(packageJSON.version)) failures.push('App version must be SemVer.');
if (upstream.tag !== `v${upstream.version}`) failures.push('Pinned upstream tag and version do not match.');
if (!/^v\d+\.\d+\.\d+$/.test(upstream.tag)) failures.push('Upstream tag must be an exact release tag.');
if (!/^[0-9a-f]{40}$/.test(upstream.commit || '')) failures.push('Upstream commit must be a full 40-character SHA.');

const customDomain = wrangler.routes?.find((route) => route.pattern === domain && route.custom_domain === true);
if (!customDomain) failures.push('wrangler.jsonc does not configure the expected custom domain.');
if (wrangler.assets?.directory !== './dist') failures.push('wrangler.jsonc must publish ./dist.');

const englishHeading = readme.indexOf('## English');
const polishHeading = readme.indexOf('## Polski');
if (englishHeading < 0 || polishHeading < 0 || englishHeading > polishHeading) {
  failures.push('README must contain English first and Polish second.');
}
if (!readme.includes(`https://${domain}`)) failures.push('README does not link to the public website.');

for (const phrase of ['pl:', 'en:', 'loadProject.fromFile', 'new Packager()', 'options.extensions', 'bakeExtensions']) {
  if (!interfaceSource.includes(phrase)) failures.push(`Interface is missing expected marker: ${phrase}`);
}
if (interfaceSource.includes('innerHTML')) failures.push('Avoid innerHTML in the browser interface.');
if (!brandSource.includes(`https://${domain}`)) failures.push('Branding does not point to the public website.');
if (!brandSource.includes('lepczynski-cloud/sb-to-html-converter')) failures.push('Branding does not point to the GitHub repository.');
if (!templateSource.includes(`https://${domain}/`)) failures.push('The HTML template does not contain the canonical website URL.');

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

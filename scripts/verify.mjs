import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const absolute = (relativePath) => path.join(root, relativePath);
const read = (relativePath) => readFileSync(absolute(relativePath), 'utf8');
const requireFile = (relativePath) => {
  if (!existsSync(absolute(relativePath)) || !statSync(absolute(relativePath)).isFile()) {
    failures.push(`Missing required file: ${relativePath}`);
  }
};
const forbidPath = (relativePath) => {
  if (existsSync(absolute(relativePath))) failures.push(`Obsolete path must be removed: ${relativePath}`);
};

const requiredFiles = [
  '.gitattributes',
  '.gitignore',
  '.node-version',
  '.github/dependabot.yml',
  '.github/workflows/ci.yml',
  '.github/workflows/release.yml',
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
  'scripts/build.mjs',
  'scripts/check-dist.mjs',
  'scripts/clean.mjs',
  'scripts/serve.mjs',
  'scripts/verify.mjs',
  'static/404.html',
  'static/favicon.svg',
  'static/privacy.html',
  'static/robots.txt'
];
requiredFiles.forEach(requireFile);

[
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'PRIVACY.md',
  'docs',
  '.github/ISSUE_TEMPLATE'
].forEach(forbidPath);

if (failures.length === 0) {
  const packageJSON = JSON.parse(read('package.json'));
  const upstream = JSON.parse(read('config/upstream.json'));
  const wrangler = JSON.parse(read('wrangler.jsonc'));
  const readme = read('README.md');
  const interfaceSource = read('overrides/src/p4/P4.svelte');
  const brandSource = read('overrides/src/packager/brand.js');
  const templateSource = read('overrides/src/p4/template.ejs');
  const gitignore = read('.gitignore');
  const releaseWorkflow = read('.github/workflows/release.yml');
  const ciWorkflow = read('.github/workflows/ci.yml');
  const domain = 'sbtohtml.lepczynski.it';

  if (packageJSON.license !== 'MPL-2.0') failures.push('package.json must use MPL-2.0.');
  if (packageJSON.name !== 'sb-to-html-converter') failures.push('package.json name is incorrect.');
  if (packageJSON.description.includes('Scratch')) failures.push('The repository description should use file formats rather than Scratch as the product name.');
  if (packageJSON.homepage !== `https://${domain}`) failures.push('package.json homepage is incorrect.');
  if (packageJSON.repository?.url !== 'https://github.com/lepczynski-cloud/sb-to-html-converter.git') {
    failures.push('package.json repository URL is incorrect.');
  }
  if (packageJSON.bugs?.url !== 'https://github.com/lepczynski-cloud/sb-to-html-converter/issues') {
    failures.push('package.json issues URL is incorrect.');
  }
  if (!/^\d+\.\d+\.\d+$/.test(packageJSON.version)) failures.push('App version must be SemVer.');

  if (upstream.tag !== `v${upstream.version}`) failures.push('Pinned upstream tag and version do not match.');
  if (!/^v\d+\.\d+\.\d+$/.test(upstream.tag)) failures.push('Upstream tag must be an exact release tag.');
  if (!/^[0-9a-f]{40}$/.test(upstream.commit || '')) failures.push('Upstream commit must be a full 40-character SHA.');

  if (wrangler.name !== 'sb-to-html-converter') failures.push('wrangler.jsonc Worker name is incorrect.');
  if (wrangler.workers_dev !== false) failures.push('wrangler.jsonc must disable the production workers.dev route.');
  const customDomain = wrangler.routes?.find((route) => route.pattern === domain && route.custom_domain === true);
  if (!customDomain) failures.push('wrangler.jsonc does not configure the expected custom domain.');
  if (wrangler.assets?.directory !== './dist') failures.push('wrangler.jsonc must publish ./dist.');
  if (wrangler.assets?.not_found_handling !== '404-page') failures.push('wrangler.jsonc must use the custom 404 page.');

  const englishHeading = readme.indexOf('## English');
  const polishHeading = readme.indexOf('## Polski');
  if (englishHeading < 0 || polishHeading < 0 || englishHeading > polishHeading) {
    failures.push('README must contain the complete English section before the Polish section.');
  }
  if ((readme.match(/^## English$/gm) || []).length !== 1 || (readme.match(/^## Polski$/gm) || []).length !== 1) {
    failures.push('README must contain exactly one English heading and one Polish heading.');
  }
  if (!readme.includes(`https://${domain}`)) failures.push('README does not link to the public website.');
  if (readme.includes('Metadane repozytorium') || readme.includes('Repository metadata')) {
    failures.push('README contains unnecessary repository metadata.');
  }
  if (readme.includes('Cloudflare')) failures.push('README should describe the online and offline versions without deployment details.');

  for (const phrase of [
    'pl:',
    'en:',
    "setLanguage('pl')",
    "setLanguage('en')",
    'loadProject.fromFile',
    'new Packager()',
    'options.extensions',
    'bakeExtensions',
    'downloadAgain'
  ]) {
    if (!interfaceSource.includes(phrase)) failures.push(`Interface is missing expected marker: ${phrase}`);
  }
  if (interfaceSource.includes('innerHTML')) failures.push('Avoid innerHTML in the browser interface.');
  if (interfaceSource.includes('<svelte:head>')) failures.push('The interface must not create duplicate title or description elements.');
  if (!brandSource.includes(`https://${domain}`)) failures.push('Branding does not point to the public website.');
  if (!brandSource.includes('lepczynski-cloud/sb-to-html-converter')) failures.push('Branding does not point to the GitHub repository.');
  if (!templateSource.includes(`https://${domain}/`)) failures.push('The HTML template does not contain the canonical website URL.');
  if ((templateSource.match(/<meta name="description"/g) || []).length !== 1) {
    failures.push('The HTML template must contain exactly one description meta tag.');
  }

  for (const entry of ['node_modules/', 'dist/', '.cache/', '.wrangler/', '.DS_Store']) {
    if (!gitignore.includes(entry)) failures.push(`.gitignore is missing: ${entry}`);
  }

  if (!releaseWorkflow.includes('dist/offline/sb-to-html-converter.html')) {
    failures.push('Release workflow uses an incorrect offline filename.');
  }
  if (!ciWorkflow.includes('actions/checkout@v7') || !ciWorkflow.includes('actions/setup-node@v7')) {
    failures.push('CI workflow does not use the expected current GitHub Actions versions.');
  }
}

const walk = (directory) => {
  const files = [];
  for (const entry of readdirSync(directory)) {
    if (entry === '.git' || entry === 'node_modules' || entry === 'dist' || entry === '.cache') continue;
    const item = path.join(directory, entry);
    if (statSync(item).isDirectory()) files.push(...walk(item));
    else files.push(item);
  }
  return files;
};

const textExtensions = new Set(['', '.cjs', '.css', '.ejs', '.html', '.js', '.json', '.jsonc', '.md', '.mjs', '.svelte', '.txt', '.yml', '.yaml']);
const forbiddenStrings = [
  'scratch-to-html-converter',
  'scratch2html.lepczynski.it',
  'github.com/lepczynski-cloud/scratch-to-html-converter',
  'Scratch to HTML Converter'
];

for (const file of walk(root)) {
  const relative = path.relative(root, file);
  const extension = path.extname(file).toLowerCase();
  if (relative === 'LICENSE' || relative === 'scripts/verify.mjs' || !textExtensions.has(extension)) continue;
  const content = readFileSync(file, 'utf8');
  for (const forbidden of forbiddenStrings) {
    if (content.includes(forbidden)) failures.push(`Old project identifier found in ${relative}: ${forbidden}`);
  }
}

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

console.log('Repository structure, naming, documentation order, hidden files, and JavaScript syntax checks passed.');

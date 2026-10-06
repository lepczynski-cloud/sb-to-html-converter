import {existsSync, readFileSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const requiredFiles = [
  'index.html',
  'offline/sb-to-html-converter.html',
  'build-info.json',
  'version.txt',
  'LICENSE.txt',
  'NOTICE.txt',
  'social-preview.png'
];
const failures = [];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(dist, relativePath);
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    failures.push(`Missing build output: dist/${relativePath}`);
  } else if (statSync(absolutePath).size === 0) {
    failures.push(`Empty build output: dist/${relativePath}`);
  }
}

if (failures.length === 0) {
  const index = readFileSync(path.join(dist, 'index.html'), 'utf8');
  const offlinePath = path.join(dist, 'offline', 'sb-to-html-converter.html');
  const offline = readFileSync(offlinePath, 'utf8');
  const buildInfo = JSON.parse(readFileSync(path.join(dist, 'build-info.json'), 'utf8'));
  const upstream = JSON.parse(readFileSync(path.join(root, 'config', 'upstream.json'), 'utf8'));

  if (!index.toLowerCase().includes('<!doctype html>')) {
    failures.push('dist/index.html is not an HTML document.');
  }
  if (!index.includes('https://sbtohtml.lepczynski.it/social-preview.png')) {
    failures.push('dist/index.html is missing the social preview image metadata.');
  }
  if (!offline.toLowerCase().includes('<!doctype html>')) {
    failures.push('Offline converter is not an HTML document.');
  }
  if (statSync(offlinePath).size < 500_000) {
    failures.push('Offline converter is unexpectedly small; standalone assets may be missing.');
  }
  if (buildInfo.upstream?.commit !== upstream.commit) {
    failures.push('build-info.json does not contain the pinned upstream commit.');
  }
  if (buildInfo.upstream?.tag !== upstream.tag) {
    failures.push('build-info.json does not contain the pinned upstream tag.');
  }
}

if (failures.length > 0) {
  console.error('Build output verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Hosted and offline build outputs passed smoke checks.');

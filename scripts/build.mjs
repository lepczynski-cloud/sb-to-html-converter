import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, rmSync, cpSync, writeFileSync, copyFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, '..');
const config = JSON.parse(readFileSync(path.join(root, 'config', 'upstream.json'), 'utf8'));
const packageJSON = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const distDirectory = path.join(root, 'dist');
const overridesDirectory = path.join(root, 'overrides');
const extraStaticDirectory = path.join(root, 'static');

const run = (command, args, options = {}) => {
  console.log(`> ${command} ${args.join(' ')}`);
  execFileSync(command, args, {
    cwd: options.cwd || root,
    env: options.env || process.env,
    stdio: 'inherit'
  });
};

const getGitValue = (args, fallback) => {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim() || fallback;
  } catch {
    return fallback;
  }
};

const validateConfiguration = () => {
  if (!/^v\d+\.\d+\.\d+$/.test(config.tag)) {
    throw new Error(`Invalid pinned TurboWarp tag: ${config.tag}`);
  }
  if (config.tag !== `v${config.version}`) {
    throw new Error(`TurboWarp tag ${config.tag} does not match version ${config.version}.`);
  }
  if (config.repository !== 'https://github.com/TurboWarp/packager.git') {
    throw new Error('Unexpected upstream repository. Review config/upstream.json before building.');
  }
  if (!/^[0-9a-f]{40}$/.test(config.commit)) {
    throw new Error(`Invalid pinned TurboWarp commit: ${config.commit}`);
  }
};

validateConfiguration();

const shortCommit = getGitValue(['rev-parse', '--short=8', 'HEAD'], 'local');
const exactTag = getGitValue(['describe', '--tags', '--exact-match'], '');
const releaseTag = `v${packageJSON.version}`;
const buildVersion = process.env.APP_VERSION || (
  exactTag === releaseTag
    ? releaseTag
    : `${releaseTag}+${shortCommit}`
);

const configuredSource = process.env.TURBOWARP_SOURCE_DIR;
const upstreamDirectory = configuredSource
  ? path.resolve(configuredSource)
  : path.join(root, '.cache', `turbowarp-packager-${config.version}`);

if (configuredSource) {
  console.log(`Using TurboWarp source from TURBOWARP_SOURCE_DIR: ${upstreamDirectory}`);
  if (!existsSync(path.join(upstreamDirectory, 'package.json'))) {
    throw new Error('TURBOWARP_SOURCE_DIR does not contain a package.json file.');
  }
  if (!existsSync(path.join(upstreamDirectory, '.git'))) {
    throw new Error('TURBOWARP_SOURCE_DIR must point to a Git checkout so the pinned commit can be verified.');
  }
} else if (!existsSync(path.join(upstreamDirectory, '.git'))) {
  rmSync(upstreamDirectory, {recursive: true, force: true});
  mkdirSync(path.dirname(upstreamDirectory), {recursive: true});
  run('git', [
    'clone',
    '--depth', '1',
    '--branch', config.tag,
    '--single-branch',
    config.repository,
    upstreamDirectory
  ]);
} else {
  run('git', ['reset', '--hard'], {cwd: upstreamDirectory});
  run('git', ['clean', '-fdx'], {cwd: upstreamDirectory});
  run('git', ['fetch', '--force', '--depth', '1', 'origin', `refs/tags/${config.tag}:refs/tags/${config.tag}`], {
    cwd: upstreamDirectory
  });
  run('git', ['checkout', '--force', '--detach', config.tag], {cwd: upstreamDirectory});
}

const upstreamCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: upstreamDirectory,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit']
}).trim();
if (upstreamCommit !== config.commit) {
  throw new Error(
    `Pinned TurboWarp tag ${config.tag} resolved to ${upstreamCommit}, expected ${config.commit}.`
  );
}

const upstreamPackage = JSON.parse(readFileSync(path.join(upstreamDirectory, 'package.json'), 'utf8'));
if (upstreamPackage.version !== config.version) {
  throw new Error(
    `Pinned TurboWarp source reports version ${upstreamPackage.version}, expected ${config.version}.`
  );
}
if (upstreamPackage.license !== config.license) {
  throw new Error(
    `Pinned TurboWarp source reports license ${upstreamPackage.license}, expected ${config.license}.`
  );
}

run('npm', ['ci', '--no-audit', '--no-fund'], {cwd: upstreamDirectory});

console.log('Applying project-specific interface and branding...');
cpSync(overridesDirectory, upstreamDirectory, {recursive: true, force: true});

rmSync(distDirectory, {recursive: true, force: true});
const buildEnvironment = {
  ...process.env,
  VERSION: `${buildVersion} · TurboWarp ${config.version}`
};

console.log('Building hosted browser version...');
run('npm', ['run', 'build-prod'], {
  cwd: upstreamDirectory,
  env: buildEnvironment
});
cpSync(path.join(upstreamDirectory, 'dist'), distDirectory, {recursive: true, force: true});

console.log('Building single-file offline version...');
run('npm', ['run', 'build-standalone-prod'], {
  cwd: upstreamDirectory,
  env: buildEnvironment
});
const standaloneSource = path.join(upstreamDirectory, 'dist', 'standalone.html');
if (!existsSync(standaloneSource)) {
  throw new Error('TurboWarp standalone build did not create dist/standalone.html.');
}
const offlineDirectory = path.join(distDirectory, 'offline');
mkdirSync(offlineDirectory, {recursive: true});
copyFileSync(
  standaloneSource,
  path.join(offlineDirectory, 'scratch-to-html-converter.html')
);

if (existsSync(extraStaticDirectory)) {
  cpSync(extraStaticDirectory, distDirectory, {recursive: true, force: true});
}
copyFileSync(path.join(root, 'LICENSE'), path.join(distDirectory, 'LICENSE.txt'));
copyFileSync(path.join(root, 'NOTICE'), path.join(distDirectory, 'NOTICE.txt'));

const buildInfo = {
  appVersion: packageJSON.version,
  displayVersion: buildVersion,
  commit: getGitValue(['rev-parse', 'HEAD'], 'local'),
  builtAt: new Date().toISOString(),
  upstream: {
    repository: config.repository,
    tag: config.tag,
    version: config.version,
    license: config.license,
    commit: config.commit
  }
};
writeFileSync(
  path.join(distDirectory, 'build-info.json'),
  `${JSON.stringify(buildInfo, null, 2)}\n`,
  'utf8'
);
writeFileSync(
  path.join(distDirectory, 'version.txt'),
  `${buildVersion}\nTurboWarp ${config.version}\n`,
  'utf8'
);

console.log('');
console.log(`Build complete: ${distDirectory}`);
console.log(`Hosted version: ${buildVersion}`);
console.log('Offline file: dist/offline/scratch-to-html-converter.html');

import {rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['dist', '.cache']) {
  rmSync(path.join(root, name), {recursive: true, force: true});
}
console.log('Removed dist/ and .cache/.');

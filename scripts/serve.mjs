import http from 'node:http';
import {createReadStream, existsSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, '..');
const requestedDirectory = process.argv[2] || 'dist';
const publicDirectory = path.resolve(root, requestedDirectory);
const port = Number.parseInt(process.argv[3] || '8080', 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Port must be an integer between 1 and 65535.');
}
if (!existsSync(publicDirectory)) {
  throw new Error(`Directory does not exist: ${publicDirectory}. Run npm run build first.`);
}

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json']
]);

const sendFile = (response, filePath, statusCode = 200) => {
  response.writeHead(statusCode, {
    'Content-Type': mimeTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  createReadStream(filePath).pipe(response);
};

const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Bad request');
    return;
  }

  const relative = pathname.replace(/^\/+/, '');
  let target = path.resolve(publicDirectory, relative || 'index.html');
  const publicPrefix = `${publicDirectory}${path.sep}`;
  if (target !== publicDirectory && !target.startsWith(publicPrefix)) {
    response.writeHead(403, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Forbidden');
    return;
  }
  if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (existsSync(target) && statSync(target).isFile()) {
    sendFile(response, target);
    return;
  }
  const notFound = path.join(publicDirectory, '404.html');
  if (existsSync(notFound)) sendFile(response, notFound, 404);
  else {
    response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${publicDirectory}`);
  console.log(`Open http://127.0.0.1:${port}`);
});

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);

function getArg(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) {
    return fallback;
  }

  return args[index + 1] ?? fallback;
}

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, getArg('--root', '../web/dist'));
const port = Number(getArg('--port', '4173'));
const host = getArg('--host', '127.0.0.1');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function resolvePath(urlPath) {
  const safePath = decodeURIComponent(urlPath.split('?')[0] || '/');
  const requested = safePath === '/' ? '/index.html' : safePath;
  const absolutePath = path.resolve(root, `.${requested}`);

  if (!absolutePath.startsWith(root)) {
    return null;
  }

  if (existsSync(absolutePath) && statSync(absolutePath).isFile()) {
    return absolutePath;
  }

  if (!path.extname(absolutePath)) {
    const fallback = path.join(root, 'index.html');
    if (existsSync(fallback)) {
      return fallback;
    }
  }

  return null;
}

const server = createServer((request, response) => {
  if ((request.url ?? '') === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  const filePath = resolvePath(request.url ?? '/');
  if (!filePath) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    'Content-Type': contentTypes[extension] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });

  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Portable web server listening on http://${host}:${port}`);
});

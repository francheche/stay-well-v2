import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const publicRoot = join(repositoryRoot, 'public');
const port = Number(process.argv[2] || 4173);

const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.xml': 'application/xml; charset=utf-8'
};

createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const relativePath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    const filePath = normalize(join(publicRoot, relativePath));

    if (!filePath.startsWith(publicRoot) || !existsSync(filePath) || !statSync(filePath).isFile()) {
        response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Not found');
        return;
    }

    response.writeHead(200, {
        'Content-Type': contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream'
    });
    createReadStream(filePath).pipe(response);
}).listen(port, '127.0.0.1', () => {
    console.log(`Stay Well preview: http://127.0.0.1:${port}/`);
});

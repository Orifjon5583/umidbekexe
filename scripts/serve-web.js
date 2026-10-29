const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// dist papkasini aniqlash
let DIST_DIR = path.resolve(__dirname, '..', 'apps', 'web', 'dist');
if (!fs.existsSync(DIST_DIR)) {
  DIST_DIR = path.resolve(process.cwd(), 'apps', 'web', 'dist');
}
if (!fs.existsSync(DIST_DIR)) {
  DIST_DIR = path.resolve(__dirname, '..', 'dist');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const ext = path.extname(urlPath).toLowerCase();

      if (ext === '.css') {
        const assetsDir = path.join(DIST_DIR, 'assets');
        if (fs.existsSync(assetsDir)) {
          const cssFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
          if (cssFiles.length > 0) {
            filePath = path.join(assetsDir, cssFiles[0]);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/css' });
            res.end('/* CSS topilmadi */');
            return;
          }
        }
      } else if (ext === '.js') {
        const assetsDir = path.join(DIST_DIR, 'assets');
        if (fs.existsSync(assetsDir)) {
          const jsFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
          if (jsFiles.length > 0) {
            filePath = path.join(assetsDir, jsFiles[0]);
          } else {
            res.writeHead(404, { 'Content-Type': 'application/javascript' });
            res.end('// JS topilmadi');
            return;
          }
        }
      } else if (ext === '.png' || ext === '.jpg' || ext === '.svg' || ext === '.ico') {
        const publicFile = path.join(DIST_DIR, path.basename(urlPath));
        if (fs.existsSync(publicFile)) {
          filePath = publicFile;
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Rasm topilmadi');
          return;
        }
      } else {
        // SPA fallback
        filePath = path.join(DIST_DIR, 'index.html');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(data);
    });
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[CodePractice Web Server] Port ${PORT} band, qayta ulanmoqda...`);
  } else {
    console.error(`[CodePractice Web Server] Xatolik: ${err.message}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[CodePractice Web Server] http://127.0.0.1:${PORT} da muvaffaqiyatli ishga tushdi`);
});

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8000;
const base = process.cwd();

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(base, reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }

      if (stats.isDirectory()) filePath = path.join(filePath, 'index.html');

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Server error');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const ct = mime[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': ct });
        res.end(data);
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.end('Server error');
  }
}).listen(port, () => console.log(`Serving ${base} at http://localhost:${port}`));

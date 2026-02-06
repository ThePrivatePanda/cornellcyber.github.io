const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const HOSTNAME = 'localhost';

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Route mapping
  const routes = {
    '/': '/index.html',
    '/join': '/views/join.html',
    '/people': '/views/people.html',
    '/contact': '/views/contact.html',
    '/events': '/views/contact.html'
  };

  // Map routes to files
  if (routes[pathname]) {
    pathname = routes[pathname];
  }

  // Default to index.html for root
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Get file path
  const filePath = path.join(__dirname, pathname);

  // Security: prevent directory traversal
  const realPath = fs.realpathSync(__dirname);
  if (!filePath.startsWith(realPath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // Get MIME type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`🚀 Server running at http://${HOSTNAME}:${PORT}/`);
  console.log(`📄 Home: http://${HOSTNAME}:${PORT}/`);
  console.log(`🔗 Join: http://${HOSTNAME}:${PORT}/join`);
  console.log(`\nPress Ctrl+C to stop the server`);
});

const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const server = http.createServer((req, res) => {

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // LOGIN
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const data = JSON.parse(body);

      db.get(
        `SELECT * FROM usuarios WHERE usuario = ? AND password = ?`,
        [data.usuario, data.password],
        (err, row) => {
          if (err) {
            res.writeHead(500);
            return res.end('Error');
          }

          if (row) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } else {
            res.writeHead(401);
            res.end(JSON.stringify({ success: false }));
          }
        }
      );
    });

  }

  // GET /productos
  else if (req.method === 'GET' && req.url === '/productos') {
    db.all(`SELECT * FROM productos`, [], (err, rows) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
    });
  }

  // POST /productos
  else if (req.method === 'POST' && req.url === '/productos') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const { nombre, categoria, unidad, precio } = JSON.parse(body);
      db.run(
        `INSERT INTO productos (nombre, categoria, unidad, precio) VALUES (?, ?, ?, ?)`,
        [nombre, categoria, unidad, precio],
        function(err) {
          if (err) {
            res.writeHead(500);
            return res.end('Error');
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ id: this.lastID }));
        }
      );
    });
  }

  // SERVIR ARCHIVOS (HTML, CSS, JS, PNG, JSON...)
  else {

    let filePath = '.' + (req.url === '/' ? '/login.html' : req.url);

    // SW header obligatorio
    if (req.url === '/sw.js') {
      res.setHeader('Service-Worker-Allowed', '/');
    }

    const ext = path.extname(filePath);

    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon',
      '.json': 'application/json',
      '.webp': 'image/webp'
    }[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Archivo no encontrado');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  }

});

server.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
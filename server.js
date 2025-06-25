const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.jsx': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Normaliza a URL para evitar path traversal
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Obtém a extensão do arquivo
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  // Verifica se o arquivo existe em src/ ou public/
  const checkPaths = [
    filePath,
    path.join('./src', req.url),
    path.join('./public', req.url)
  ];

  // Tenta encontrar o arquivo em diferentes diretórios
  const tryReadFile = (paths, index) => {
    if (index >= paths.length) {
      // Arquivo não encontrado em nenhum diretório
      fs.readFile('./index.html', (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Erro no servidor: ' + err.code);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        }
      });
      return;
    }

    fs.readFile(paths[index], (error, content) => {
      if (error) {
        // Tenta o próximo caminho
        tryReadFile(paths, index + 1);
      } else {
        // Sucesso
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  };

  tryReadFile(checkPaths, 0);
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

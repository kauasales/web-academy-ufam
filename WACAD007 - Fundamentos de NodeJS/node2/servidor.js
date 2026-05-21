import fs from 'fs';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { createLink } from './util.js';
import { fileURLToPath } from 'url';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({ path: envFile });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT;
const diretorioAlvo = process.argv[2] || '.';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  fs.readdir(diretorioAlvo, { withFileTypes: true }, (err, arquivos) => {
    if (err) {
      res.end(`<h1>Erro ao ler o diretório</h1><p>${err.message}</p>`);
      return;
    }

    let html = `<h1>Conteúdo de: ${path.resolve(diretorioAlvo)}</h1>`;
    
    const diretorios = arquivos.filter(arquivo => arquivo.isDirectory());
    const arquivosLista = arquivos.filter(arquivo => !arquivo.isDirectory());
    
    if (diretorios.length > 0) {
      html += `<h2>Diretórios</h2>`;
      diretorios.forEach(dir => {
        html += createLink(dir.name, true);
      });
    }
    
    // Depois lista os arquivos
    if (arquivosLista.length > 0) {
      html += `<h2>Arquivos</h2>`;
      arquivosLista.forEach(arquivo => {
        html += createLink(arquivo.name, false);
      });
    }
    
    res.end(html);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Listando o diretório: ${path.resolve(diretorioAlvo)}`);
});

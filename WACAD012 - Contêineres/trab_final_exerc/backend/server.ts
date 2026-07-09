import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4444;
const logDir = '/log';

// Garante que a pasta de logs exigida existe
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Configuração da conexão com o banco via variáveis de ambiente
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'senha_webacademy',
    database: process.env.DB_NAME || 'web_academy_books',
    port: Number(process.env.DB_PORT) || 3306
});

app.get('/books', async (req, res) => {
    // Grava o log exigido no enunciado
    const logMessage = `[${new Date().toISOString()}] Requisição recebida em /books\n`;
    fs.appendFileSync(path.join(logDir, 'acesso.log'), logMessage);

    try {
        const [rows] = await pool.query('SELECT * FROM livros');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao conectar ao Banco de Dados' });
    }
});

app.listen(port, () => {
    console.log(`Backend escutando na porta ${port}`);
});
import express from 'express';
import dotenv from 'dotenv';
import { logger } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3333;

app.use(logger('completo'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
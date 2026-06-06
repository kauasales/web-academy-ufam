import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import { logger } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3333;

app.use(logger('completo'));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
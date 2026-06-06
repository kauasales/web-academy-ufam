import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import { logger } from './middleware/logger.js';
import { engine } from 'express-handlebars';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3333;

app.use(logger('completo'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.set('views', path.join(process.cwd(), 'src', 'views'));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
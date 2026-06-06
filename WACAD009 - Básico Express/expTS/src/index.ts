import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import { logger } from './middleware/logger.js';
import { engine } from 'express-handlebars';
import { Technology } from './interfaces/Technology.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3333;

app.use(logger('completo'));

app.engine(
  'handlebars',
  engine({
    helpers: {
      nodeTechnologies: (technologies) => {
        let result = '<ul>';

        technologies
          .filter((tech: Technology) => tech.poweredByNodejs)
          .forEach((tech: Technology) => {
            result += `<li>${tech.name} (${tech.type})</li>`;
          });

        result += '</ul>';

        return result;
      },
    },
  })
);

app.set('view engine', 'handlebars');

app.set('views', path.join(process.cwd(), 'src', 'views'));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
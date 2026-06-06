import express from 'express';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import path from 'path';

import routes from './routes/routes.js';

dotenv.config();

const app = express();

app.engine(
  'handlebars',
  engine({
    helpers: {
      nodeTechnologies: (technologies: any[]) => {
        let result = '<ul>';

        technologies
          .filter((tech) => tech.poweredByNodejs)
          .forEach((tech) => {
            result += `<li>${tech.name} (${tech.type})</li>`;
          });

        result += '</ul>';

        return result;
      },
    },
  }),
);

app.set('view engine', 'handlebars');

app.set('views', path.join(process.cwd(), 'src/views'));

app.use(routes);

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
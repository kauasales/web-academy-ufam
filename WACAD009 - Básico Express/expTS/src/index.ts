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

app.use(express.static(path.join(process.cwd(), 'src/public')));

app.use(logger('completo'));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.engine(
  'handlebars',
  engine({
    helpers: {
      isActive: (currentPath: string, path: string) => {
        return currentPath === path ? 'active' : '';
      },

      startsWith: (currentPath: string, prefix: string) => {
        return currentPath.startsWith(prefix) ? 'active' : '';
      },

      nodeTechnologies: (technologies: Technology[]) => {
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
app.set('views', path.join(process.cwd(), 'src', 'views'));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
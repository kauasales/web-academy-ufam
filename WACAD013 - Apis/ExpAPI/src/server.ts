import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getLanguageFromCookie } from './resources/language/language';
import { userRouter } from './resources/user/user.routes';
import { productRouter } from './resources/product/product.routes';
import { languageRouter } from './resources/language/language.routes';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/language', languageRouter);

app.use((req, res, next) => {
  const language = getLanguageFromCookie(req.headers.cookie);
  res.locals.language = language;
  next();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
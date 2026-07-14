import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getLanguageFromCookie } from './resources/language/language';
import { userRouter } from './resources/user/user.routes';
import { productRouter } from './resources/product/product.routes';
import { languageRouter } from './resources/language/language.routes';
import { setAuthUser, isAuth, isAdmin } from './middlewares/auth.middleware';
import { comparePassword, sanitizeUser } from './resources/user/user.utils';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/language', languageRouter);

app.get('/auth-demo', isAuth, (req, res) => {
  res.json({ user: req.user });
});

app.get('/admin-demo', isAdmin, (req, res) => {
  res.json({ user: req.user });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword || (user.userTypeId !== 1 && user.userTypeId !== 2)) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    setAuthUser({ id: user.id, name: user.name, email: user.email, userTypeId: user.userTypeId });
    res.json({ ok: true, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: 'Unable to authenticate user.' });
  }
});

app.post('/auth/mock', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword || (user.userTypeId !== 1 && user.userTypeId !== 2)) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    setAuthUser({ id: user.id, name: user.name, email: user.email, userTypeId: user.userTypeId });
    res.json({ ok: true, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: 'Unable to authenticate user.' });
  }
});

app.post('/auth/logout', isAuth, (_req, res) => {
  setAuthUser(null);
  res.json({ ok: true });
});

app.use((req, res, next) => {
  const language = getLanguageFromCookie(req.headers.cookie);
  res.locals.language = language;
  next();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, sanitizeUser } from './user.utils';
import { validateUserBody, createUserSchema, updateUserSchema } from '../../validators/user.validator';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { userType: true },
    });

    res.json(users.map((user) => sanitizeUser(user)));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { userType: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

router.post('/', validateUserBody(createUserSchema), async (req: Request, res: Response) => {
  const { name, email, password, userTypeId } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userTypeId: Number(userTypeId),
      },
      include: { userType: true },
    });

    res.status(201).json(sanitizeUser(user));
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário.' });
  }
});

router.put('/:id', validateUserBody(updateUserSchema), async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = { ...req.body };

  try {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data,
      include: { userType: true },
    });

    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário.' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar usuário.' });
  }
});

export { router as userRouter };

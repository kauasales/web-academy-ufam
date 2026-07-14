import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, sanitizeUser } from './user.utils';
import { validateUserBody, createUserSchema, updateUserSchema } from '../../validators/user.validator';
import { getLanguageFromCookie, getLanguageMessage } from '../language/language';

const router = Router();
const prisma = new PrismaClient();

const getLocalizedMessage = (req: Request, key: string, fallback: string) => {
  const language = getLanguageFromCookie(req.headers.cookie);
  return getLanguageMessage(key, language, fallback);
};

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     description: Retorna uma lista com todos os usuários cadastrados (requer autenticação de admin)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - id: 1
 *                 name: "João Silva"
 *                 email: "joao@email.com"
 *                 userTypeId: 1
 *                 userType:
 *                   id: 1
 *                   name: "Admin"
 *               - id: 2
 *                 name: "Maria Santos"
 *                 email: "maria@email.com"
 *                 userTypeId: 2
 *                 userType:
 *                   id: 2
 *                   name: "User"
 *       401:
 *         description: Não autorizado - Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acesso negado - Usuário não é admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno ao buscar usuários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { userType: true },
    });

    res.json(users.map((user) => sanitizeUser(user)));
  } catch (error) {
    res.status(500).json({ error: getLocalizedMessage(req, 'user-fetch-error', 'Error fetching users.') });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca um usuário por ID
 *     tags: [Users]
 *     description: Retorna os detalhes de um usuário específico (requer autenticação)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do usuário
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               name: "João Silva"
 *               email: "joao@email.com"
 *               userTypeId: 1
 *               userType:
 *                 id: 1
 *                 name: "Admin"
 *       401:
 *         description: Não autorizado - Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "User not found."
 *       500:
 *         description: Erro interno ao buscar usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { userType: true },
    });

    if (!user) {
      return res.status(404).json({ error: getLocalizedMessage(req, 'user-not-found', 'User not found.') });
    }

    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ error: getLocalizedMessage(req, 'user-not-found', 'User not found.') });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     description: Registra um novo usuário no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - userTypeId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Carlos Souza"
 *                 description: Nome completo do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "carlos@email.com"
 *                 description: E-mail do usuário (deve ser único)
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 format: password
 *                 example: "senha123"
 *                 description: Senha do usuário (mínimo 6 caracteres)
 *               userTypeId:
 *                 type: integer
 *                 enum: [1, 2]
 *                 example: 2
 *                 description: "Tipo de usuário (1: Admin, 2: User)"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 3
 *               name: "Carlos Souza"
 *               email: "carlos@email.com"
 *               userTypeId: 2
 *               userType:
 *                 id: 2
 *                 name: "User"
 *       400:
 *         description: Dados inválidos ou erro ao criar usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 value:
 *                   errors:
 *                     - field: "email"
 *                       message: "Invalid email format"
 *                     - field: "password"
 *                       message: "Password must be at least 6 characters"
 *               dbError:
 *                 value:
 *                   error: "Error creating user."
 *       409:
 *         description: Conflito - E-mail já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Email already registered."
 *       500:
 *         description: Erro interno ao criar usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
    res.status(400).json({ error: getLocalizedMessage(req, 'user-create-error', 'Error creating user.') });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Users]
 *     description: Atualiza os dados de um usuário específico (requer autenticação)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do usuário a ser atualizado
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "João Silva Santos"
 *                 description: Nome atualizado do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao.santos@email.com"
 *                 description: E-mail atualizado
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 format: password
 *                 example: "novaSenha123"
 *                 description: Nova senha (opcional - se não informada, mantém a atual)
 *               userTypeId:
 *                 type: integer
 *                 enum: [1, 2]
 *                 example: 2
 *                 description: "Tipo de usuário (1: Admin, 2: User)"
 *             example:
 *               name: "João Silva Santos"
 *               email: "joao.santos@email.com"
 *               userTypeId: 2
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               name: "João Silva Santos"
 *               email: "joao.santos@email.com"
 *               userTypeId: 2
 *               userType:
 *                 id: 2
 *                 name: "User"
 *       400:
 *         description: Dados inválidos ou erro ao atualizar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Error updating user."
 *       401:
 *         description: Não autorizado - Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "User not found."
 *       409:
 *         description: Conflito - E-mail já cadastrado para outro usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno ao atualizar usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
    res.status(400).json({ error: getLocalizedMessage(req, 'user-update-error', 'Error updating user.') });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Users]
 *     description: Remove um usuário do sistema (requer autenticação de admin)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do usuário a ser removido
 *         example: 3
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso (sem conteúdo)
 *       400:
 *         description: Erro ao deletar usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Error deleting user."
 *       401:
 *         description: Não autorizado - Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acesso negado - Usuário não é admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno ao deletar usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: getLocalizedMessage(req, 'user-delete-error', 'Error deleting user.') });
  }
});

export { router as userRouter };
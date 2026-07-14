import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getLanguageFromCookie } from './resources/language/language';
import { userRouter } from './resources/user/user.routes';
import { productRouter } from './resources/product/product.routes';
import { languageRouter } from './resources/language/language.routes';
import { checkoutRouter } from './resources/checkout/checkout.routes';
import { setAuthUser, isAuth, isAdmin } from './middlewares/auth.middleware';
import { comparePassword, sanitizeUser } from './resources/user/user.utils';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExpAPI - Documentação',
      version: '1.0.0',
      description: 'API de e-commerce com autenticação e gerenciamento de produtos',
      contact: {
        name: 'Suporte',
        email: 'suporte@expapi.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'auth_token' 
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            userTypeId: { type: 'integer', enum: [1, 2] }
          }
        },
        UserWithType: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            userTypeId: { type: 'integer', enum: [1, 2] },
            userType: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' }
              }
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            price: { type: 'number' },
            description: { type: 'string' },
            stock: { type: 'integer' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@email.com' },
            password: { type: 'string', format: 'password', example: 'senha123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: true },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        AuthDemoResponse: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email: { type: 'string' },
                userTypeId: { type: 'integer' }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    security: [{ cookieAuth: [] }]
  },
  apis: ['./src/resources/**/*.routes.ts', './src/resources/**/*.ts']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
const app = express();
const prisma = new PrismaClient();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/language', languageRouter);
app.use('/checkout', checkoutRouter);

/**
 * @swagger
 * /auth-demo:
 *   get:
 *     summary: Demonstração de autenticação básica
 *     tags: [Auth]
 *     description: Endpoint de teste que retorna os dados do usuário autenticado
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthDemoResponse'
 *             example:
 *               user:
 *                 id: 1
 *                 name: "João Silva"
 *                 email: "joao@email.com"
 *                 userTypeId: 1
 *       401:
 *         description: Não autorizado - Cookie de autenticação ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized"
 */
app.get('/auth-demo', isAuth, (req, res) => {
  res.json({ user: req.user });
});

/**
 * @swagger
 * /admin-demo:
 *   get:
 *     summary: Demonstração de autenticação de admin
 *     tags: [Auth]
 *     description: Endpoint de teste que só permite acesso a usuários com permissão de admin
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Admin autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthDemoResponse'
 *             example:
 *               user:
 *                 id: 1
 *                 name: "João Silva"
 *                 email: "joao@email.com"
 *                 userTypeId: 1
 *       401:
 *         description: Não autorizado - Cookie de autenticação ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized"
 *       403:
 *         description: Acesso negado - Usuário não tem permissão de admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Forbidden: Admin access required"
 */
app.get('/admin-demo', isAdmin, (req, res) => {
  res.json({ user: req.user });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Auth]
 *     description: |
 *       Autentica um usuário e define um cookie de sessão.
 *       O cookie 'auth_token' será usado em requisições subsequentes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "joao@email.com"
 *             password: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               ok: true
 *               user:
 *                 id: 1
 *                 name: "João Silva"
 *                 email: "joao@email.com"
 *                 userTypeId: 1
 *       400:
 *         description: Email e senha são obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Email and password are required."
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Invalid credentials."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unable to authenticate user."
 */
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

/**
 * @swagger
 * /auth/mock:
 *   post:
 *     summary: Login mock para testes
 *     tags: [Auth]
 *     description: |
 *       Endpoint de login para testes que funciona de forma idêntica ao /auth/login.
 *       Útil para ambientes de desenvolvimento e testes automatizados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "teste@email.com"
 *             password: "teste123"
 *     responses:
 *       200:
 *         description: Login mock realizado com sucesso
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               ok: true
 *               user:
 *                 id: 2
 *                 name: "Maria Santos"
 *                 email: "maria@email.com"
 *                 userTypeId: 2
 *       400:
 *         description: Email e senha são obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Realiza logout do usuário
 *     tags: [Auth]
 *     description: |
 *       Remove o cookie de autenticação e encerra a sessão do usuário.
 *       Requer que o usuário esteja autenticado.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Não autorizado - Usuário não está autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized"
 */
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
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateBody, createProductSchema, updateProductSchema } from '../../validators/product.validator';
import { getLanguageFromCookie, getLanguageMessage } from '../language/language';

const router = Router();
const prisma = new PrismaClient();

const getLocalizedMessage = (req: Request, fallback: string) => {
  const language = getLanguageFromCookie(req.headers.cookie);
  return getLanguageMessage('product-error', language, fallback);
};

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     description: Retorna uma lista com todos os produtos disponíveis no catálogo
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             example:
 *               - id: 1
 *                 name: "Notebook Gamer"
 *                 description: "Notebook com placa de vídeo dedicada"
 *                 price: 5999.99
 *                 stock: 10
 *                 createdAt: "2024-01-15T10:00:00Z"
 *                 updatedAt: "2024-01-15T10:00:00Z"
 *               - id: 2
 *                 name: "Mouse Sem Fio"
 *                 description: "Mouse ergonômico com conectividade Bluetooth"
 *                 price: 149.90
 *                 stock: 25
 *                 createdAt: "2024-01-15T10:00:00Z"
 *                 updatedAt: "2024-01-15T10:00:00Z"
 *       500:
 *         description: Erro interno ao buscar produtos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: getLocalizedMessage(_req, 'Erro ao buscar produtos.') });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca um produto por ID
 *     tags: [Products]
 *     description: Retorna os detalhes de um produto específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto
 *         example: 1
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 1
 *               name: "Notebook Gamer"
 *               description: "Notebook com placa de vídeo dedicada"
 *               price: 5999.99
 *               stock: 10
 *               createdAt: "2024-01-15T10:00:00Z"
 *               updatedAt: "2024-01-15T10:00:00Z"
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Produto não encontrado."
 *       500:
 *         description: Erro interno ao buscar o produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ error: getLocalizedMessage(req, 'Produto não encontrado.') });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: getLocalizedMessage(req, 'Erro ao buscar o produto.') });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     description: Adiciona um novo produto ao catálogo (requer autenticação de admin)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Teclado Mecânico"
 *                 description: Nome do produto
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Teclado mecânico com switches blue e RGB"
 *                 description: Descrição detalhada do produto
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 299.99
 *                 description: Preço do produto
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *                 description: Quantidade em estoque
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 3
 *               name: "Teclado Mecânico"
 *               description: "Teclado mecânico com switches blue e RGB"
 *               price: 299.99
 *               stock: 50
 *               createdAt: "2024-01-15T10:00:00Z"
 *               updatedAt: "2024-01-15T10:00:00Z"
 *       400:
 *         description: Dados inválidos ou erro ao salvar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 value:
 *                   errors:
 *                     - field: "name"
 *                       message: "Name must be at least 3 characters"
 *               dbError:
 *                 value:
 *                   error: "Erro ao salvar o produto no banco."
 *       401:
 *         description: Não autorizado - Usuário não autenticado
 *       403:
 *         description: Acesso negado - Usuário não é admin
 *       500:
 *         description: Erro interno ao criar produto
 */
router.post('/', validateBody(createProductSchema), async (req: Request, res: Response) => {
  const { name, description, price, stock } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: { name, description, price, stock },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: getLocalizedMessage(req, 'Erro ao salvar o produto no banco.') });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Products]
 *     description: Atualiza os dados de um produto específico (requer autenticação de admin)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto a ser atualizado
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
 *                 example: "Notebook Gamer Pro"
 *                 description: Nome atualizado do produto
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Notebook gamer com processador i7 e RTX 4060"
 *                 description: Descrição atualizada
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 6999.99
 *                 description: Preço atualizado
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 5
 *                 description: Quantidade em estoque atualizada
 *             example:
 *               name: "Notebook Gamer Pro"
 *               price: 6999.99
 *               stock: 5
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 1
 *               name: "Notebook Gamer Pro"
 *               description: "Notebook gamer com processador i7 e RTX 4060"
 *               price: 6999.99
 *               stock: 5
 *               createdAt: "2024-01-15T10:00:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Dados inválidos ou erro ao atualizar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Erro ao atualizar produto ou produto inexistente."
 *       401:
 *         description: Não autorizado - Usuário não autenticado
 *       403:
 *         description: Acesso negado - Usuário não é admin
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno ao atualizar produto
 */
router.put('/:id', validateBody(updateProductSchema), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: getLocalizedMessage(req, 'Erro ao atualizar produto ou produto inexistente.') });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Products]
 *     description: Remove um produto do catálogo (requer autenticação de admin)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto a ser removido
 *         example: 3
 *     responses:
 *       204:
 *         description: Produto removido com sucesso (sem conteúdo)
 *       400:
 *         description: Erro ao deletar produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Erro ao deletar produto ou produto inexistente."
 *       401:
 *         description: Não autorizado - Usuário não autenticado
 *       403:
 *         description: Acesso negado - Usuário não é admin
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno ao deletar produto
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: getLocalizedMessage(req, 'Erro ao deletar produto ou produto inexistente.') });
  }
});

export { router as productRouter };
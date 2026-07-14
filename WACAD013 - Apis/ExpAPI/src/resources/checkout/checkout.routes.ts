import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAuth } from '../../middlewares/auth.middleware';
import { getLanguageFromCookie, getLanguageMessage } from '../language/language';
import { addProductToCart, clearCart, getCart } from './checkout.service';

const router = Router();
const prisma = new PrismaClient();

const getLocalizedMessage = (req: Request, key: string, fallback: string) => {
  const language = getLanguageFromCookie(req.headers.cookie);
  return getLanguageMessage(key, language, fallback);
};

/**
 * @swagger
 * /checkout/add:
 *   post:
 *     summary: Adiciona um produto ao carrinho
 *     tags: [Checkout]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *                 description: ID do produto
 *               quantity:
 *                 type: integer
 *                 example: 2
 *                 description: Quantidade do produto
 *     responses:
 *       200:
 *         description: Produto adicionado ao carrinho com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product added to cart."
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *       400:
 *         description: Requisição inválida (ID inválido, quantidade inválida ou estoque insuficiente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     invalidId:
 *                       value: "The product id is invalid."
 *                     invalidQuantity:
 *                       value: "The quantity must be greater than zero."
 *                     stockUnavailable:
 *                       value: "Stock unavailable for the requested quantity."
 *       401:
 *         description: Não autorizado - Usuário não autenticado
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno ao adicionar produto ao carrinho
 */
router.post('/add', isAuth, async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: getLocalizedMessage(req, 'checkout-forbidden', 'Unauthorized') });
  }

  if (!Number.isInteger(Number(productId)) || Number(productId) <= 0) {
    return res.status(400).json({ error: getLocalizedMessage(req, 'checkout-invalid-product-id', 'The product id is invalid.') });
  }

  if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    return res.status(400).json({ error: getLocalizedMessage(req, 'checkout-invalid-quantity', 'The quantity must be greater than zero.') });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });

    if (!product) {
      return res.status(404).json({ error: getLocalizedMessage(req, 'checkout-product-not-found', 'Product not found.') });
    }

    if (product.stock < Number(quantity)) {
      return res.status(400).json({ error: getLocalizedMessage(req, 'checkout-stock-unavailable', 'Stock unavailable for the requested quantity.') });
    }

    addProductToCart(userId, Number(productId), Number(quantity));
    res.json({ message: getLocalizedMessage(req, 'checkout-add-success', 'Product added to cart.'), cart: getCart(userId) });
  } catch (error) {
    res.status(500).json({ error: getLocalizedMessage(req, 'checkout-add-error', 'Error adding product to cart.') });
  }
});

/**
 * @swagger
 * /checkout/finish:
 *   post:
 *     summary: Finaliza a compra do carrinho atual
 *     tags: [Checkout]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Compra finalizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Purchase completed successfully."
 *                 cart:
 *                   type: array
 *                   example: []
 *       400:
 *         description: Carrinho vazio ou erro ao finalizar compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     emptyCart:
 *                       value: "The cart is empty."
 *                     completeError:
 *                       value: "Error completing the purchase."
 *       401:
 *         description: Não autorizado - Usuário não autenticado
 *       500:
 *         description: Erro interno ao finalizar compra
 */
router.post('/finish', isAuth, async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: getLocalizedMessage(req, 'checkout-forbidden', 'Unauthorized') });
  }

  const cart = getCart(userId);

  if (!cart.length) {
    return res.status(400).json({ error: getLocalizedMessage(req, 'checkout-empty-cart', 'The cart is empty.') });
  }

  try {
    const validatedItems = [] as Array<{ productId: number; quantity: number; unitPrice: number }>;

    for (const item of cart) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < item.quantity) {
        throw new Error('Stock unavailable');
      }

      validatedItems.push({ productId: item.productId, quantity: item.quantity, unitPrice: product.price });
    }

    await prisma.$transaction(async (tx) => {
      const order = await tx.checkoutOrder.create({
        data: {
          userId,
        },
      });

      await tx.checkoutOrderItem.createMany({
        data: validatedItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    });

    clearCart(userId);
    res.json({ message: getLocalizedMessage(req, 'checkout-complete-success', 'Purchase completed successfully.'), cart: [] });
  } catch (error) {
    res.status(400).json({ error: getLocalizedMessage(req, 'checkout-complete-error', 'Error completing the purchase.') });
  }
});

export { router as checkoutRouter };
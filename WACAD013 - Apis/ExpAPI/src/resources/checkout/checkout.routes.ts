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

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

router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: getLocalizedMessage(_req, 'Erro ao buscar produtos.') });
  }
});

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

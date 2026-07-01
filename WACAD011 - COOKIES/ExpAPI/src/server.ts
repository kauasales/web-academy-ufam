import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateBody, createProductSchema, updateProductSchema } from './validators/product.validator';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// 1. INDEX
app.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

// 2. READ
app.get('/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o produto.' });
  }
});

// 3. CREATE - Adicionado o middleware do Joi aqui 
app.post('/products', validateBody(createProductSchema), async (req: Request, res: Response) => {
  const { name, description, price, stock } = req.body;
  try {
    const newProduct = await prisma.product.create({ 
      data: { name, description, price, stock },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao salvar o produto no banco.' });
  }
});

app.put('/products/:id', validateBody(updateProductSchema), async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: req.body, 
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar produto ou produto inexistente.' });
  }
});

app.delete('/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar produto ou produto inexistente.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const PORT = process.env.PORT || 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

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

app.post('/products', async (req: Request, res: Response) => {
  const { name, description, price, stock } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: { name, description, price: Number(price), stock: Number(stock) || 0 },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar produto. Verifique os dados.' });
  }
});

app.put('/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: price ? Number(price) : undefined,
        stock: stock ? Number(stock) : undefined,
      },
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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
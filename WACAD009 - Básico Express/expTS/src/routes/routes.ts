import { Router, Request, Response } from 'express';
import { LoremIpsum } from 'lorem-ipsum';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello World!</h1>');
});

router.get('/lorem/:quantidade', (req: Request, res: Response) => {
  const quantidade = Number(req.params.quantidade);

  if (isNaN(quantidade) || quantidade <= 0) {
    res.status(400).send('Informe uma quantidade válida.');
    return;
  }

  const lorem = new LoremIpsum();

  const paragrafos = Array.from(
    { length: quantidade },
    () => lorem.generateParagraphs(1)
  );

  res.send(paragrafos.join('<br><br>'));
});

export default router;
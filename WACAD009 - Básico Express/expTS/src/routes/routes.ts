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

router.get('/hb1', (req: Request, res: Response) => {
  res.render('hb1', {
    mensagem: 'Olá, você está aprendendo Express + Handlebars!',
    layout: false
  });
});

router.get('/hb2', (req: Request, res: Response) => {
  res.render('hb2', {
    poweredByNodejs: true,
    nome: 'Express',
    tipo: 'Framework',
    layout: false
  });
});

router.get('/hb3', (req: Request, res: Response) => {
  const professores = [
    { nome: 'David Fernandes', sala: 1238 },
    { nome: 'Horácio Fernandes', sala: 1233 },
    { nome: 'Edleno Moura', sala: 1236 },
    { nome: 'Elaine Harada', sala: 1231 }
  ];

  res.render('hb3', {
    professores,
    layout: false
  });
});

export default router;
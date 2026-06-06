import { Request, Response } from 'express';
import { LoremIpsum } from 'lorem-ipsum';

export default class MainController {

  static home(req: Request, res: Response): void {
    res.render('home', {
      mensagem: 'Hello World'
    })
  }

  static lorem(req: Request, res: Response): void {
    const quantidade = Number(req.params.quantidade);

    if (isNaN(quantidade) || quantidade <= 0) {
      res.status(400).send('Informe uma quantidade válida.');
      return;
    }

    const lorem = new LoremIpsum();

    const paragrafos = Array.from(
      { length: quantidade },
      () => lorem.generateParagraphs(1),
    );

    res.render('lorem', {
      quantidade,
      paragrafos,
    });
  }

  static hb1(req: Request, res: Response): void {
    res.render('hb1', {
      mensagem: 'Olá, você está aprendendo Express + Handlebars!',
    });
  }

  static hb2(req: Request, res: Response): void {
    res.render('hb2', {
      poweredByNodejs: true,
      nome: 'Express',
      tipo: 'Framework',
    });
  }

  static hb3(req: Request, res: Response): void {
    const professores = [
      { nome: 'David Fernandes', sala: 1238 },
      { nome: 'Horácio Fernandes', sala: 1233 },
      { nome: 'Edleno Moura', sala: 1236 },
      { nome: 'Elaine Harada', sala: 1231 },
    ];

    res.render('hb3', {
      professores,
    });
  }

  static hb4(req: Request, res: Response): void {
    const technologies = [
      { name: 'Express', type: 'Framework', poweredByNodejs: true },
      { name: 'Laravel', type: 'Framework', poweredByNodejs: false },
      { name: 'React', type: 'Library', poweredByNodejs: true },
      { name: 'Handlebars', type: 'Engine View', poweredByNodejs: true },
      { name: 'Django', type: 'Framework', poweredByNodejs: false },
      { name: 'Docker', type: 'Virtualization', poweredByNodejs: false },
      { name: 'Sequelize', type: 'ORM tool', poweredByNodejs: true },
    ];

    res.render('hb4', {
      technologies,
    });
  }
}
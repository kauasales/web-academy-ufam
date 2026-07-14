import { Router, Request, Response } from 'express';
import { getLanguageFromCookie, getLanguageMessage, parseLanguage, setLanguageCookie, type Language } from './language';

const router = Router();

/**
 * @swagger
 * /language:
 *   get:
 *     summary: Obtém o idioma atual do usuário
 *     tags: [Language]
 *     description: Retorna o idioma configurado no cookie do usuário ou o padrão (pt-BR)
 *     responses:
 *       200:
 *         description: Idioma atual retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 language:
 *                   type: string
 *                   enum: [pt-BR, en-US, es-ES]
 *                   example: "pt-BR"
 *                   description: Idioma atual do usuário
 *                 message:
 *                   type: string
 *                   example: "Current language is pt-BR"
 *                   description: Mensagem de confirmação no idioma atual
 *       500:
 *         description: Erro interno ao obter idioma
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (req: Request, res: Response) => {
  const language = (res.locals.language as Language) ?? 'pt-BR';

  res.json({
    language,
    message: getLanguageMessage('current-language', language).replace('{language}', language),
  });
});

/**
 * @swagger
 * /language:
 *   post:
 *     summary: Define o idioma do usuário
 *     tags: [Language]
 *     description: |
 *       Define o idioma do usuário através de um cookie.
 *       O idioma é armazenado no cookie 'language' e será usado em todas as mensagens localizadas.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [pt-BR, en-US, es-ES]
 *                 example: "en-US"
 *                 description: Idioma desejado (opcional - se não informado, usa 'pt-BR')
 *             example:
 *               language: "en-US"
 *     responses:
 *       200:
 *         description: Idioma definido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 language:
 *                   type: string
 *                   enum: [pt-BR, en-US, es-ES]
 *                   example: "en-US"
 *                   description: Idioma definido
 *                 message:
 *                   type: string
 *                   example: "Language set to en-US"
 *                   description: Mensagem de confirmação no idioma definido
 *       400:
 *         description: Idioma inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Invalid language. Supported: pt-BR, en-US, es-ES"
 *       500:
 *         description: Erro interno ao definir idioma
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *     examples:
 *       request:
 *         summary: Definindo idioma para inglês
 *         value:
 *           language: "en-US"
 *       request_pt:
 *         summary: Definindo idioma para português
 *         value:
 *           language: "pt-BR"
 */
router.post('/', (req: Request, res: Response) => {
  const requestedLanguage = parseLanguage(req.body?.language);
  setLanguageCookie(res, requestedLanguage);

  res.json({
    language: requestedLanguage,
    message: getLanguageMessage('set-success', requestedLanguage),
  });
});

export { router as languageRouter };
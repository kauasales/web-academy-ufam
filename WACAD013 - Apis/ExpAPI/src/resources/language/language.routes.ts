import { Router, Request, Response } from 'express';
import { getLanguageFromCookie, getLanguageMessage, parseLanguage, setLanguageCookie, type Language } from './language';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const language = (res.locals.language as Language) ?? 'pt-BR';

  res.json({
    language,
    message: getLanguageMessage('current-language', language).replace('{language}', language),
  });
});

router.post('/', (req: Request, res: Response) => {
  const requestedLanguage = parseLanguage(req.body?.language);
  setLanguageCookie(res, requestedLanguage);

  res.json({
    language: requestedLanguage,
    message: getLanguageMessage('set-success', requestedLanguage),
  });
});

export { router as languageRouter };

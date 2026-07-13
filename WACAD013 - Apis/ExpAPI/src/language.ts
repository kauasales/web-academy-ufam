export type Language = 'pt-BR' | 'en';

const supportedLanguages = ['pt-BR', 'en'] as const;

export const parseLanguage = (value?: string): Language => {
  if (value && supportedLanguages.includes(value as Language)) {
    return value as Language;
  }

  return 'pt-BR';
};

export const getLanguageFromCookie = (cookieHeader?: string): Language => {
  if (!cookieHeader) return 'pt-BR';

  const cookie = cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith('lang='));

  if (!cookie) return 'pt-BR';

  const [, value] = cookie.split('=');
  return parseLanguage(value);
};

export const setLanguageCookie = (res: { cookie: (name: string, value: string, options: Record<string, unknown>) => void }, language: Language): void => {
  res.cookie('lang', language, {
    path: '/',
    httpOnly: true,
  });
};

export const getLanguageMessage = (key: string, language: Language, fallback = key): string => {
  const translations: Record<string, Record<Language, string>> = {
    'set-success': {
      'pt-BR': 'Idioma definido com sucesso.',
      en: 'Language set successfully.',
    },
    'current-language': {
      'pt-BR': 'Idioma atual: {language}',
      en: 'Current language: {language}',
    },
  };

  return translations[key]?.[language] ?? fallback;
};

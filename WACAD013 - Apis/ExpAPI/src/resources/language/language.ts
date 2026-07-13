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
    'user-name-required': {
      'pt-BR': 'O campo nome é obrigatório.',
      en: 'The name field is required.',
    },
    'user-email-required': {
      'pt-BR': 'O campo e-mail é obrigatório.',
      en: 'The email field is required.',
    },
    'user-email-invalid': {
      'pt-BR': 'O e-mail deve ser um endereço válido.',
      en: 'The email must be a valid email address.',
    },
    'user-password-required': {
      'pt-BR': 'O campo senha é obrigatório.',
      en: 'The password field is required.',
    },
    'user-password-min': {
      'pt-BR': 'A senha deve ter pelo menos {#limit} caracteres.',
      en: 'The password must be at least {#limit} characters long.',
    },
    'user-type-required': {
      'pt-BR': 'O campo userTypeId é obrigatório.',
      en: 'The userTypeId field is required.',
    },
    'user-type-positive': {
      'pt-BR': 'O tipo de usuário deve ser um número maior que zero.',
      en: 'The user type must be a number greater than zero.',
    },
    'product-error': {
      'pt-BR': 'Erro ao buscar produtos.',
      en: 'Error fetching products.',
    },
    'product-name-empty': {
      'pt-BR': 'O nome do produto não pode estar vazio.',
      en: 'Product name cannot be empty.',
    },
    'product-name-min': {
      'pt-BR': 'O nome deve ter pelo menos {#limit} caracteres.',
      en: 'Product name must have at least {#limit} characters.',
    },
    'product-name-required': {
      'pt-BR': 'O campo nome é obrigatório.',
      en: 'The name field is required.',
    },
    'product-price-positive': {
      'pt-BR': 'O preço deve ser um número maior que zero.',
      en: 'Price must be a number greater than zero.',
    },
    'product-stock-min': {
      'pt-BR': 'O estoque não pode ser negativo.',
      en: 'Stock cannot be negative.',
    },
    'user-name-empty': {
      'pt-BR': 'O nome do usuário não pode estar vazio.',
      en: 'User name cannot be empty.',
    },
    'user-name-min': {
      'pt-BR': 'O nome deve ter pelo menos {#limit} caracteres.',
      en: 'User name must have at least {#limit} characters.',
    },
  };

  return translations[key]?.[language] ?? fallback;
};

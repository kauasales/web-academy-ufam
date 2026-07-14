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
    'user-type-invalid': {
      'pt-BR': 'O tipo de usuário deve ser 1 ou 2.',
      en: 'The user type must be 1 or 2.',
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
    'auth-unauthorized': {
      'pt-BR': 'Não autorizado.',
      en: 'Unauthorized.',
    },
    'auth-forbidden': {
      'pt-BR': 'Acesso proibido.',
      en: 'Forbidden.',
    },
    'auth-login-user-not-found': {
      'pt-BR': 'Usuário não encontrado.',
      en: 'User not found.',
    },
    'user-not-found': {
      'pt-BR': 'Usuário não encontrado.',
      en: 'User not found.',
    },
    'user-fetch-error': {
      'pt-BR': 'Erro ao buscar usuários.',
      en: 'Error fetching users.',
    },
    'user-create-error': {
      'pt-BR': 'Erro ao criar usuário.',
      en: 'Error creating user.',
    },
    'user-update-error': {
      'pt-BR': 'Erro ao atualizar usuário.',
      en: 'Error updating user.',
    },
    'user-delete-error': {
      'pt-BR': 'Erro ao deletar usuário.',
      en: 'Error deleting user.',
    },
    'product-not-found': {
      'pt-BR': 'Produto não encontrado.',
      en: 'Product not found.',
    },
    'product-fetch-error': {
      'pt-BR': 'Erro ao buscar produtos.',
      en: 'Error fetching products.',
    },
    'product-create-error': {
      'pt-BR': 'Erro ao salvar o produto no banco.',
      en: 'Error saving the product to the database.',
    },
    'product-update-error': {
      'pt-BR': 'Erro ao atualizar produto ou produto inexistente.',
      en: 'Error updating product or product does not exist.',
    },
    'product-delete-error': {
      'pt-BR': 'Erro ao deletar produto ou produto inexistente.',
      en: 'Error deleting product or product does not exist.',
    },
    'checkout-forbidden': {
      'pt-BR': 'Acesso permitido apenas para usuários do tipo 2.',
      en: 'Access allowed only for users of type 2.',
    },
    'checkout-invalid-product-id': {
      'pt-BR': 'O id do produto é inválido.',
      en: 'The product id is invalid.',
    },
    'checkout-invalid-quantity': {
      'pt-BR': 'A quantidade deve ser maior que zero.',
      en: 'The quantity must be greater than zero.',
    },
    'checkout-empty-cart': {
      'pt-BR': 'O carrinho está vazio.',
      en: 'The cart is empty.',
    },
    'checkout-product-not-found': {
      'pt-BR': 'Produto não encontrado.',
      en: 'Product not found.',
    },
    'checkout-stock-unavailable': {
      'pt-BR': 'Estoque indisponível para a quantidade solicitada.',
      en: 'Stock unavailable for the requested quantity.',
    },
    'checkout-add-success': {
      'pt-BR': 'Produto adicionado ao carrinho.',
      en: 'Product added to cart.',
    },
    'checkout-complete-success': {
      'pt-BR': 'Compra concluída com sucesso.',
      en: 'Purchase completed successfully.',
    },
    'checkout-add-error': {
      'pt-BR': 'Erro ao adicionar produto ao carrinho.',
      en: 'Error adding product to cart.',
    },
    'checkout-complete-error': {
      'pt-BR': 'Erro ao concluir a compra.',
      en: 'Error completing the purchase.',
    },
  };

  return translations[key]?.[language] ?? fallback;
};

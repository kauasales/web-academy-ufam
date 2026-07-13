import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { getLanguageFromCookie, getLanguageMessage } from '../resources/language/language';

export type ValidationLanguage = 'pt-BR' | 'en';

const createMessages = (language: ValidationLanguage) => ({
  'string.empty': getLanguageMessage('product-name-empty', language, 'O nome do produto não pode estar vazio.'),
  'string.min': getLanguageMessage('product-name-min', language, 'O nome deve ter pelo menos {#limit} caracteres.'),
  'any.required': getLanguageMessage('product-name-required', language, 'O campo nome é obrigatório.'),
  'number.positive': getLanguageMessage('product-price-positive', language, 'O preço deve ser um número maior que zero.'),
  'number.min': getLanguageMessage('product-stock-min', language, 'O estoque não pode ser negativo.'),
});

export const createProductSchema = (language: ValidationLanguage = 'pt-BR') => Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages(createMessages(language)),
  description: Joi.string().trim().max(500).allow('', null),
  price: Joi.number().positive().required().messages(createMessages(language)),
  stock: Joi.number().integer().min(0).default(0).messages(createMessages(language)),
});

export const updateProductSchema = (language: ValidationLanguage = 'pt-BR') => Joi.object({
  name: Joi.string().trim().min(3).max(100).messages(createMessages(language)),
  description: Joi.string().trim().max(500).allow('', null),
  price: Joi.number().positive().messages(createMessages(language)),
  stock: Joi.number().integer().min(0).messages(createMessages(language)),
}).min(1);

export const validateBody = (schemaOrFactory: Joi.ObjectSchema | ((language: ValidationLanguage) => Joi.ObjectSchema)) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const language = getLanguageFromCookie(req.headers.cookie);
    const schema = typeof schemaOrFactory === 'function' ? schemaOrFactory(language) : schemaOrFactory;

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }

    req.body = value;
    next();
  };
};
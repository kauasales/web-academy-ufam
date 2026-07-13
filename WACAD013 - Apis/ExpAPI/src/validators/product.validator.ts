import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export type ValidationLanguage = 'pt-BR' | 'en';

const messagesByLanguage = {
  'pt-BR': {
    'string.empty': 'O nome do produto não pode estar vazio.',
    'string.min': 'O nome deve ter pelo menos {#limit} caracteres.',
    'any.required': 'O campo nome é obrigatório.',
    'number.positive': 'O preço deve ser um número maior que zero.',
    'number.min': 'O estoque não pode ser negativo.',
  },
  en: {
    'string.empty': 'Product name cannot be empty.',
    'string.min': 'Product name must have at least {#limit} characters.',
    'any.required': 'This field is required.',
    'number.positive': 'Price must be a number greater than zero.',
    'number.min': 'Stock cannot be negative.',
  },
} as const;

const createMessages = (language: ValidationLanguage) => ({
  'string.empty': messagesByLanguage[language]['string.empty'],
  'string.min': messagesByLanguage[language]['string.min'],
  'any.required': messagesByLanguage[language]['any.required'],
  'number.positive': messagesByLanguage[language]['number.positive'],
  'number.min': messagesByLanguage[language]['number.min'],
});

export const createProductSchema = (language: ValidationLanguage = 'pt-BR') => Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages(createMessages(language)),
  description: Joi.string().trim().max(500).allow('', null),
  price: Joi.number().positive().required().messages(createMessages(language)),
  stock: Joi.number().integer().min(0).default(0).messages(createMessages(language))
});

export const updateProductSchema = (language: ValidationLanguage = 'pt-BR') => Joi.object({
  name: Joi.string().trim().min(3).max(100).messages(createMessages(language)),
  description: Joi.string().trim().max(500).allow('', null),
  price: Joi.number().positive().messages(createMessages(language)),
  stock: Joi.number().integer().min(0).messages(createMessages(language))
}).min(1);

export const validateBody = (schemaOrFactory: Joi.ObjectSchema | ((language: ValidationLanguage) => Joi.ObjectSchema)) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const language = (res.locals?.language as ValidationLanguage | undefined) ?? 'pt-BR';
    const schema = typeof schemaOrFactory === 'function' ? schemaOrFactory(language) : schemaOrFactory;

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }

    req.body = value;
    next();
  };
};
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { getLanguageFromCookie, getLanguageMessage, type Language } from '../resources/language/language';

const getLanguage = (req: Request): Language => getLanguageFromCookie(req.headers.cookie);

const createMessages = (language: Language) => ({
  'string.empty': getLanguageMessage('user-name-empty', language, 'O nome do usuário não pode estar vazio.'),
  'string.min': getLanguageMessage('user-name-min', language, 'O nome deve ter pelo menos {#limit} caracteres.'),
  'string.email': getLanguageMessage('user-email-invalid', language, 'O e-mail deve ser um endereço válido.'),
  'any.required': getLanguageMessage('user-required', language, 'O campo é obrigatório.'),
  'number.positive': getLanguageMessage('user-type-positive', language, 'O tipo de usuário deve ser um número maior que zero.'),
  'any.only': getLanguageMessage('user-type-invalid', language, 'O tipo de usuário deve ser 1 ou 2.'),
});

export const createUserSchema = (language: Language = 'pt-BR') => Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages(createMessages(language)),
  email: Joi.string().trim().email().required().messages(createMessages(language)),
  password: Joi.string().min(6).required().messages(createMessages(language)),
  userTypeId: Joi.number().integer().valid(1, 2).required().messages(createMessages(language)),
});

export const updateUserSchema = (language: Language = 'pt-BR') => Joi.object({
  name: Joi.string().trim().min(3).max(100).messages(createMessages(language)),
  email: Joi.string().trim().email().messages(createMessages(language)),
  password: Joi.string().min(6).messages(createMessages(language)),
  userTypeId: Joi.number().integer().valid(1, 2).messages(createMessages(language)),
}).min(1);

export const validateUserBody = (schemaOrFactory: Joi.ObjectSchema | ((language: Language) => Joi.ObjectSchema)) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const language = getLanguage(req);
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

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'O nome do produto não pode estar vazio.',
    'string.min': 'O nome deve ter pelo menos {#limit} caracteres.',
    'any.required': 'O campo nome é obrigatório.'
  }),
  description: Joi.string().trim().max(500).allow('', null),
  price: Joi.number().positive().required().messages({
    'number.positive': 'O preço deve ser um número maior que zero.',
    'any.required': 'O campo preço é obrigatório.'
  }),
  stock: Joi.number().integer().min(0).default(0).messages({
    'number.min': 'O estoque não pode ser negativo.'
  })
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().max(500).allow('', null),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0)
}).min(1);

export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }

    req.body = value;
    next();
  };
};
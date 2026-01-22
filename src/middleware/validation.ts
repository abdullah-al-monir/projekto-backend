import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { createError, ErrorMessages } from '../utils/errors.js';

export const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details: Record<string, string> = {};
      error.details.forEach((detail) => {
        details[detail.context?.key || ''] = detail.message;
      });

      next(
        createError(400, ErrorMessages.VALIDATION_ERROR, details)
      );
      return;
    }

    req.body = value;
    next();
  };

// Validation schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const inviteSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid('MANAGER', 'STAFF').required(),
});

export const registerSchema = Joi.object({
  token: Joi.string().required(),
  name: Joi.string().min(2).max(100).required(),
  password: Joi.string().min(6).required(),
});

export const projectSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).allow(''),
  status: Joi.string().valid('ACTIVE', 'ARCHIVED', 'DELETED').required(),
});

export const updateRoleSchema = Joi.object({
  role: Joi.string().valid('ADMIN', 'MANAGER', 'STAFF').required(),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE').required(),
});

export default { validate };
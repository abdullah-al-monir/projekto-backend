import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload): string => {
  if (!config.jwtSecret) {
    throw new Error('JWT secret is not configured in environment variables');
  }

  const jwtSecret = config.jwtSecret as Secret;

  const options: SignOptions = {
    expiresIn: (config.jwtExpire ?? '7d') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, jwtSecret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  if (!config.jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.verify(token, config.jwtSecret as Secret) as JWTPayload;
};

export const decodeToken = (token: string): JWTPayload | null => {
  return jwt.decode(token) as JWTPayload | null;
};

export default { generateToken, verifyToken, decodeToken };

import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
};

export const config = {
  // Server
  port: parseInt(getEnv('PORT', '5000')),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  
  // Database
  mongodbUri: getEnv('MONGODB_URI'),
  
  // JWT
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpire: getEnv('JWT_EXPIRE', '7d'),
  
  // Email
  emailServiceId: getEnv('EMAIL_SERVICE_ID'),
  emailTemplateId: getEnv('EMAIL_TEMPLATE_ID'),
  emailPublicKey: getEnv('EMAIL_PUBLIC_KEY'),
  emailPrivateKey: getEnv('EMAIL_PRIVATE_KEY'),
  emailFrom: getEnv('EMAIL_FROM', 'noreply@projekto.com'),
  
  // Frontend
  frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:5173'),
  
  // CORS
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
  
  // Invite
  inviteExpiryDays: parseInt(getEnv('INVITE_EXPIRY_DAYS', '7')),
  
  // Derived
  isDevelopment: getEnv('NODE_ENV', 'development') === 'development',
  isProduction: getEnv('NODE_ENV', 'development') === 'production',
};
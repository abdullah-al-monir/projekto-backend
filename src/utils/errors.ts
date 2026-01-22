export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const createError = (
  statusCode: number,
  message: string,
  details?: Record<string, unknown>
): AppError => {
  return new AppError(statusCode, message, details);
};

export const ErrorMessages = {
  // Auth
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  TOKEN_EXPIRED: 'Invite token has expired',
  INVALID_TOKEN: 'Invalid invite token',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden: insufficient permissions',
  
  // User
  USER_NOT_FOUND: 'User not found',
  USER_INACTIVE: 'User account is inactive',
  
  // Project
  PROJECT_NOT_FOUND: 'Project not found',
  PROJECT_DELETED: 'Project has been deleted',
  
  // Validation
  VALIDATION_ERROR: 'Validation failed',
  MISSING_FIELDS: 'Missing required fields',
};

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
};
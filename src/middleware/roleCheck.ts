import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.js";
import { createError, ErrorMessages } from "../utils/errors.js";

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(createError(401, ErrorMessages.UNAUTHORIZED));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(createError(403, ErrorMessages.FORBIDDEN));
      return;
    }

    next();
  };
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  requireRole("ADMIN")(req, res, next);
};

export default { requireRole, requireAdmin };

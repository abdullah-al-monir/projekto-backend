import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Error:", error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: "error",
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    });
    return;
  }

  // Mongoose validation error
  if (error.name === "ValidationError") {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation failed",
      details: error.message,
    });
    return;
  }

  // Mongoose duplicate key error
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue)[0];
    res.status(409).json({
      status: "error",
      statusCode: 409,
      message: `${field} already exists`,
    });
    return;
  }

  // Default error
  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Internal server error",
    details: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

export default { errorHandler };

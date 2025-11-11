import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Error handling middleware
 * Catches and formats errors consistently
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message
      }))
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token expired'
    });
    return;
  }

  // Prisma errors
  if ((err as any).code === 'P2002') {
    res.status(409).json({
      success: false,
      error: 'Resource already exists'
    });
    return;
  }

  if ((err as any).code === 'P2025') {
    res.status(404).json({
      success: false,
      error: 'Resource not found'
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};
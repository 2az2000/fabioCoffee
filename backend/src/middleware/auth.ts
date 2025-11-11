import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { AuthRequest } from '../types';

/**
 * JWT Authentication middleware
 * Verifies the token and adds admin info to request
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required'
    });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.admin = {
      id: decoded.id,
      email: decoded.email
    };
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};
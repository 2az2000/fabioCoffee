import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { loginSchema } from '../utils/validation';
import { ApiResponse, LoginResponse } from '../types';

/**
 * Admin login controller
 */
export const login = async (req: Request, res: Response<ApiResponse<LoginResponse>>): Promise<void> => {
  try {
    // Validate request body
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    const { email, password } = validationResult.data;

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
      return;
    }

    // Check password
    const isValidPassword = await comparePassword(password, admin.password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email
    });

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
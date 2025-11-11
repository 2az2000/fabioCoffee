import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { ApiResponse } from '../types';

/**
 * Get all tables
 */
export const getTables = async (req: Request, res: Response<ApiResponse<any[]>>): Promise<void> => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { number: 'asc' }
    });

    res.json({
      success: true,
      data: tables
    });
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get table by ID
 */
export const getTableById = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Table ID is required'
      });
      return;
    }

    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        orders: {
          where: {
            status: {
              in: ['PENDING', 'PREPARING', 'READY']
            }
          },
          include: {
            items: {
              include: {
                item: true
              }
            }
          }
        }
      }
    });

    if (!table) {
      res.status(404).json({
        success: false,
        error: 'Table not found'
      });
      return;
    }

    res.json({
      success: true,
      data: table
    });
  } catch (error) {
    console.error('Get table error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
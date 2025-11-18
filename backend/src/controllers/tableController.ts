import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { ApiResponse } from '../types';

/**
 * کنترلر دریافت تمام میزها
 * وظیفه: بازیابی لیست تمام میزها، مرتب شده بر اساس شماره میز.
 */
export const getTables = async (req: Request, res: Response<ApiResponse<any[]>>): Promise<void> => {
  try {
    // بازیابی تمام میزها
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
 * کنترلر دریافت میز بر اساس شناسه
 * وظیفه: بازیابی جزئیات یک میز خاص به همراه سفارشات فعال (PENDING, PREPARING, READY) مرتبط با آن.
 * منطق پیاده‌سازی: استفاده از `include` و `where` تو در تو برای فیلتر کردن سفارشات فعال.
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

    // بازیابی میز و سفارشات فعال
    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        orders: {
          where: {
            status: {
              // فیلتر برای وضعیت‌های فعال سفارش
              in: ['PENDING', 'PREPARING', 'READY']
            }
          },
          include: {
            items: {
              include: {
                item: true // جزئیات آیتم‌های سفارش
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
import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { createOrderSchema } from '../utils/validation';
import { ApiResponse, Order, OrderItem, Table } from '../types';
// OrderStatus و Item از @prisma/client به صورت مستقیم export نمی‌شوند، بنابراین از تایپ any استفاده می‌کنیم.
// اگرچه بهتر است از تایپ‌های تولید شده توسط Prisma استفاده شود، اما برای رفع خطای فعلی و حفظ عملکرد، از any استفاده می‌شود.

/**
 * کنترلر دریافت تمام سفارشات (Admin Only)
 * وظیفه: بازیابی لیست سفارشات، با قابلیت فیلتر بر اساس وضعیت (status) و شماره میز (tableNumber).
 */
export const getOrders = async (req: Request, res: Response<ApiResponse<any[]>>): Promise<void> => {
  try {
    const { status, tableNumber } = req.query;
    
    const where: any = {};
    
    // فیلتر بر اساس وضعیت سفارش
    if (status && typeof status === 'string') {
      where.status = status;
    }
    
    // فیلتر بر اساس شماره میز
    if (tableNumber) {
      where.tableNumber = parseInt(tableNumber as string);
    }

    // بازیابی سفارشات به همراه جزئیات آیتم‌ها و میز مرتبط
    const orders = await prisma.order.findMany({
      where: where,
      include: {
        items: {
          include: {
            item: true // اطلاعات آیتم منو
          }
        },
        table: true // اطلاعات میز
      },
      orderBy: {
        createdAt: 'desc' // مرتب‌سازی بر اساس زمان ایجاد (جدیدترین اول)
      }
    }) as Order[];

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * کنترلر دریافت سفارش بر اساس شناسه (Admin Only)
 * وظیفه: بازیابی جزئیات یک سفارش خاص.
 */
export const getOrderById = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
      return;
    }

    // بازیابی سفارش با جزئیات کامل
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true
          }
        },
        table: true
      }
    }) as Order | null;

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * کنترلر ایجاد سفارش جدید (Customer/Client)
 * وظیفه: اعتبارسنجی ورودی، بررسی موجودیت میز و آیتم‌ها، محاسبه قیمت کل و ثبت سفارش.
 * منطق پیاده‌سازی:
 * 1. اعتبارسنجی ساختار داده‌های ورودی (tableId و items).
 * 2. بررسی وجود میز و فعال بودن آن.
 * 3. بررسی وجود و فعال بودن تمامی آیتم‌های سفارش داده شده.
 * 4. محاسبه `totalPrice` بر اساس قیمت‌های فعلی آیتم‌ها.
 * 5. ایجاد سفارش و آیتم‌های سفارش مرتبط به صورت تراکنشی (توسط Prisma).
 */
export const createOrder = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    // 1. اعتبارسنجی بدنه درخواست
    const validationResult = createOrderSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    const { tableId, items } = validationResult.data;

    // 2. بررسی وجود میز
    const table = await prisma.table.findUnique({
      where: { id: tableId }
    });

    if (!table) {
      res.status(400).json({
        success: false,
        error: 'Table not found'
      });
      return;
    }

    // 3. بررسی وجود و فعال بودن تمامی آیتم‌ها
    const itemIds = items.map((item: { itemId: string; quantity: number }) => item.itemId);
    const existingItems = await prisma.item.findMany({
      where: {
        id: { in: itemIds },
        isActive: true // فقط آیتم‌های فعال قابل سفارش هستند
      }
    });

    if (existingItems.length !== items.length) {
      res.status(400).json({
        success: false,
        error: 'Some items not found or inactive'
      });
      return;
    }

    // 4. محاسبه قیمت کل سفارش
    let totalPrice = 0;
    for (const orderItem of items) {
      const item = existingItems.find((i: any) => i.id === orderItem.itemId);
      if (item) {
        // قیمت آیتم در زمان سفارش ثبت می‌شود (برای حفظ تاریخچه)
        totalPrice += Number(item.price) * orderItem.quantity;
      }
    }

    // 5. ایجاد سفارش و آیتم‌های سفارش مرتبط
    const order = await prisma.order.create({
      data: {
        tableId,
        tableNumber: table.number, // ذخیره شماره میز
        totalPrice,
        items: {
          create: items.map((item: { itemId: string; quantity: number }) => {
            const foundItem = existingItems.find((i: any) => i.id === item.itemId);
            return {
              itemId: item.itemId,
              quantity: item.quantity,
              price: foundItem!.price // استفاده از قیمت فعلی آیتم
            };
          })
        }
      },
      include: {
        items: {
          include: {
            item: true
          }
        },
        table: true
      }
    }) as Order;

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * کنترلر به‌روزرسانی وضعیت سفارش (Admin Only)
 * وظیفه: تغییر وضعیت یک سفارش (مانند PENDING به PREPARING).
 */
export const updateOrderStatus = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
      return;
    }
    
    const { status } = req.body;

    // اعتبارسنجی وضعیت جدید
    if (!['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status. Valid statuses are: PENDING, PREPARING, READY, COMPLETED, CANCELLED'
      });
      return;
    }

    // به‌روزرسانی وضعیت سفارش
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            item: true
          }
        },
        table: true
      }
    }) as Order;

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    // مدیریت خطای P2025 (رکورد پیدا نشد)
    if ((error as any).code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
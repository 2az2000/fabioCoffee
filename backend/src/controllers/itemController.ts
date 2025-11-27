import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { createItemSchema, updateItemSchema } from '../utils/validation';
import { ApiResponse, Item } from '../types';

/**
 * کنترلر دریافت تمام آیتم‌های فعال
 * وظیفه: بازیابی لیست آیتم‌های فعال منو، با قابلیت فیلتر بر اساس دسته‌بندی و جستجو بر اساس نام/توضیحات.
 * الگوریتم: استفاده از فیلتر `where` در Prisma برای اعمال فیلترها و جستجوی case-insensitive.
 */
export const getItems = async (req: Request, res: Response<ApiResponse<Item[]>>): Promise<void> => {
  try {
    const { categoryId, search, active } = req.query;
    
    // شرط اولیه: تمام آیتم‌ها (برای ادمین)
    const where: any = {};
    
    // فیلتر بر اساس شناسه دسته‌بندی
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    // فیلتر جستجو بر اساس نام یا توضیحات (جستجوی OR)
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } }, // جستجوی نام
        { description: { contains: search as string, mode: 'insensitive' } } // جستجوی توضیحات
      ];
    }

    // فقط آیتم‌های فعال (برای منوی عمومی)
    if (active === 'true') {
      where.isActive = true;
    }

    // بازیابی آیتم‌ها به همراه اطلاعات دسته‌بندی مرتبط
    const items = await prisma.item.findMany({
      where,
      include: { category: true },
      orderBy: { name: 'asc' }
    });

    // تبدیل نوع Decimal قیمت به Number برای سازگاری با پاسخ JSON
    const formattedItems = items.map((item: any) => ({
      ...item,
      price: Number(item.price)
    }));

    res.json({
      success: true,
      data: formattedItems
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * کنترلر دریافت آیتم بر اساس شناسه
 * وظیفه: بازیابی جزئیات یک آیتم خاص.
 */
export const getItemById = async (req: Request, res: Response<ApiResponse<Item>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Item ID is required'
      });
      return;
    }

    // بازیابی آیتم به همراه دسته‌بندی
    const item = await prisma.item.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }

    // تبدیل Decimal به number برای قیمت
    const formattedItem = {
      ...item,
      price: Number(item.price)
    };

    res.json({
      success: true,
      data: formattedItem
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * کنترلر ایجاد آیتم جدید (Admin Only)
 * وظیفه: اعتبارسنجی ورودی، بررسی وجود دسته‌بندی و ایجاد آیتم جدید.
 */
export const createItem = async (req: Request, res: Response<ApiResponse<Item>>): Promise<void> => {
  try {
    // 1. اعتبارسنجی بدنه درخواست
    const validationResult = createItemSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    // 2. بررسی وجود دسته‌بندی مرتبط
    const category = await prisma.category.findUnique({
      where: { id: validationResult.data.categoryId }
    });

    if (!category) {
      res.status(400).json({
        success: false,
        error: 'Category not found'
      });
      return;
    }

    // 3. پاکسازی داده‌ها
    const cleanData = Object.fromEntries(
      Object.entries(validationResult.data).filter(([_, value]) => value !== undefined)
    );

    // 4. ایجاد آیتم
    const item = await prisma.item.create({
      data: cleanData as any
    });

    // 5. بازیابی آیتم ایجاد شده به همراه اطلاعات دسته‌بندی برای پاسخ
    const itemWithCategory = await prisma.item.findUnique({
      where: { id: item.id },
      include: { category: true }
    });

    // 6. تبدیل Decimal به number
    const formattedItem = {
      ...itemWithCategory!,
      price: Number(itemWithCategory!.price)
    };

    res.status(201).json({
      success: true,
      data: formattedItem,
      message: 'Item created successfully'
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * کنترلر به‌روزرسانی آیتم (Admin Only)
 * وظیفه: اعتبارسنجی ورودی، بررسی وجود دسته‌بندی جدید (در صورت تغییر) و به‌روزرسانی آیتم.
 */
export const updateItem = async (req: Request, res: Response<ApiResponse<Item>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Item ID is required'
      });
      return;
    }

    // 1. اعتبارسنجی بدنه درخواست
    const validationResult = updateItemSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    // 2. اگر categoryId در حال به‌روزرسانی است، وجود آن را بررسی کنید
    if (validationResult.data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validationResult.data.categoryId }
      });

      if (!category) {
        res.status(400).json({
          success: false,
          error: 'Category not found'
        });
        return;
      }
    }

    // 3. پاکسازی داده‌ها
    const cleanData = Object.fromEntries(
      Object.entries(validationResult.data).filter(([_, value]) => value !== undefined)
    );

    // 4. به‌روزرسانی آیتم و بازیابی اطلاعات دسته‌بندی
    const item = await prisma.item.update({
      where: { id },
      data: cleanData as any,
      include: { category: true }
    });

    // 5. تبدیل Decimal به number
    const formattedItem = {
      ...item,
      price: Number(item.price)
    };

    res.json({
      success: true,
      data: formattedItem,
      message: 'Item updated successfully'
    });
  } catch (error) {
    console.error('Update item error:', error);
    // مدیریت خطای P2025 (رکورد پیدا نشد)
    if ((error as any).code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * کنترلر حذف آیتم (Admin Only)
 * وظیفه: حذف یک آیتم بر اساس شناسه.
 */
export const deleteItem = async (req: Request, res: Response<ApiResponse<null>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Item ID is required'
      });
      return;
    }

    // حذف رکورد
    await prisma.item.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    // مدیریت خطای P2025 (رکورد پیدا نشد)
    if ((error as any).code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

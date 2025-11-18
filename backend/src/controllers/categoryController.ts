import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { createCategorySchema, updateCategorySchema, idParamSchema } from '../utils/validation';
import { ApiResponse, Category } from '../types';

/**
 * کنترلر دریافت تمام دسته‌بندی‌های فعال
 * وظیفه: بازیابی لیست دسته‌بندی‌هایی که isActive=true هستند (برای نمایش در منوی مشتری).
 */
export const getCategories = async (req: Request, res: Response<ApiResponse<Category[]>>): Promise<void> => {
  try {
    // بازیابی دسته‌بندی‌های فعال و مرتب‌سازی بر اساس نام
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: categories as Category[]
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * کنترلر دریافت دسته‌بندی بر اساس شناسه
 * وظیفه: بازیابی جزئیات یک دسته‌بندی خاص، شامل آیتم‌های مرتبط با آن.
 */
export const getCategoryById = async (req: Request, res: Response<ApiResponse<Category>>): Promise<void> => {
  try {
    const { id } = req.params;

    // اعتبارسنجی پارامتر ID
    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Category ID is required'
      });
      return;
    }

    // بازیابی دسته‌بندی و آیتم‌های مرتبط (Include items)
    const category = await prisma.category.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!category) {
      // در صورت پیدا نشدن، خطای 404
      res.status(404).json({
        success: false,
        error: 'Category not found'
      });
      return;
    }

    res.json({
      success: true,
      data: category as Category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * کنترلر ایجاد دسته‌بندی جدید (Admin Only)
 * وظیفه: اعتبارسنجی ورودی و ذخیره یک دسته‌بندی جدید در دیتابیس.
 * الگوی پیاده‌سازی: استفاده از Zod برای اعتبارسنجی و حذف فیلدهای undefined قبل از ارسال به Prisma.
 */
export const createCategory = async (req: Request, res: Response<ApiResponse<Category>>): Promise<void> => {
  try {
    // 1. اعتبارسنجی بدنه درخواست
    const validationResult = createCategorySchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    // 2. پاکسازی داده‌ها: حذف فیلدهایی که مقدار undefined دارند (برای جلوگیری از خطای Prisma)
    const cleanData = Object.fromEntries(
      Object.entries(validationResult.data).filter(([_, value]) => value !== undefined)
    );

    // 3. ایجاد رکورد جدید در دیتابیس
    const category = await prisma.category.create({
      data: cleanData as any // استفاده از 'as any' برای سازگاری با تایپ‌های جزئی Zod
    });

    // 4. ارسال پاسخ موفقیت‌آمیز
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Create category error:', error);
    // مدیریت خطای احتمالی تکراری بودن نام (اگر Unique بود) یا خطاهای دیگر
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * کنترلر به‌روزرسانی دسته‌بندی (Admin Only)
 * وظیفه: اعتبارسنجی ورودی و به‌روزرسانی یک دسته‌بندی موجود.
 */
export const updateCategory = async (req: Request, res: Response<ApiResponse<Category>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Category ID is required'
      });
      return;
    }

    // 1. اعتبارسنجی بدنه درخواست (از شمای partial استفاده می‌شود)
    const validationResult = updateCategorySchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    // 2. پاکسازی داده‌ها
    const cleanData = Object.fromEntries(
      Object.entries(validationResult.data).filter(([_, value]) => value !== undefined)
    );

    // 3. به‌روزرسانی رکورد
    const category = await prisma.category.update({
      where: { id },
      data: cleanData as any
    });

    // 4. ارسال پاسخ موفقیت‌آمیز
    res.json({
      success: true,
      data: category as Category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);
    // مدیریت خطای P2025 (رکورد پیدا نشد)
    if ((error as any).code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Category not found'
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
 * کنترلر حذف دسته‌بندی (Admin Only)
 * وظیفه: حذف یک دسته‌بندی بر اساس شناسه.
 */
export const deleteCategory = async (req: Request, res: Response<ApiResponse<null>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Category ID is required'
      });
      return;
    }

    // حذف رکورد (Prisma به طور خودکار روابط آبشاری را مدیریت می‌کند)
    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    // مدیریت خطای P2025 (رکورد پیدا نشد)
    if ((error as any).code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Category not found'
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
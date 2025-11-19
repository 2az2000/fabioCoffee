// این فایل شامل شمای اعتبارسنجی داده‌ها با استفاده از کتابخانه Zod است.
// این شِماها برای اعتبارسنجی ورودی‌های API در کنترلرها استفاده می‌شوند.

import { z } from 'zod';

// -----------------------------------------------------------------------------
// شمای اعتبارسنجی دسته‌بندی (Category)
// -----------------------------------------------------------------------------

// شمای ایجاد دسته‌بندی جدید
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must be less than 100 characters'),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

// شمای به‌روزرسانی دسته‌بندی (تمامی فیلدها اختیاری هستند)
export const updateCategorySchema = createCategorySchema.partial();

// -----------------------------------------------------------------------------
// شمای اعتبارسنجی آیتم (Item)
// -----------------------------------------------------------------------------

// شمای ایجاد آیتم جدید
export const createItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Item name must be less than 100 characters'),
  description: z.string().nullable().optional(),
  price: z.number().positive('Price must be positive').max(1000000, 'Price must be less than 1000000'),
  imageUrl: z.string().url('Must be a valid URL').nullable().optional().or(z.literal('')),
  isActive: z.boolean().optional().default(true),
  categoryId: z.string().min(1, 'Category ID is required'), // شناسه دسته‌بندی الزامی است
});

// شمای به‌روزرسانی آیتم (تمامی فیلدها اختیاری هستند)
export const updateItemSchema = createItemSchema.partial();

// -----------------------------------------------------------------------------
// شمای اعتبارسنجی احراز هویت (Auth)
// -----------------------------------------------------------------------------

// شمای ورود مدیر
export const loginSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// -----------------------------------------------------------------------------
// شمای اعتبارسنجی پارامترهای عمومی
// -----------------------------------------------------------------------------

// شمای اعتبارسنجی پارامترهای صفحه‌بندی (Pagination)
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
});

// شمای اعتبارسنجی پارامتر ID در مسیر (مانند /items/:id)
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// -----------------------------------------------------------------------------
// شمای اعتبارسنجی سفارش (Order)
// -----------------------------------------------------------------------------

// شمای ایجاد سفارش جدید
export const createOrderSchema = z.object({
  tableId: z.string().min(1, 'Table ID is required'), // شناسه میز الزامی است
  items: z.array(z.object({
    itemId: z.string().min(1, 'Item ID is required'), // شناسه آیتم
    quantity: z.number().int().positive('Quantity must be positive').max(100, 'Quantity must be 100 or less'), // تعداد
  })).min(1, 'At least one item is required'), // حداقل یک آیتم باید وجود داشته باشد
});
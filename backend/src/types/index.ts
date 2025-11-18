// این فایل شامل تعریف تایپ‌های TypeScript برای مدل‌های داده و ساختار پاسخ‌های API است.

// -----------------------------------------------------------------------------
// تایپ‌های مدل‌های داده (برگرفته از Prisma Schema)
// -----------------------------------------------------------------------------

// تایپ Category (دسته‌بندی)
export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  items?: Item[]; // آیتم‌های مرتبط (اختیاری برای Include)
}

// تایپ Item (آیتم منو)
export interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number | any; // قیمت (از نوع Decimal در Prisma، در کنترلرها به number تبدیل می‌شود)
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category?: Category; // دسته‌بندی مرتبط (اختیاری برای Include)
}

// تایپ Admin (مدیر)
export interface Admin {
  id: string;
  email: string;
  password: string; // رمز عبور هش شده
  createdAt: Date;
  updatedAt: Date;
}

// تایپ Table (میز)
export interface Table {
  id: string;
  number: number;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  orders?: Order[]; // سفارشات فعال مرتبط (اختیاری برای Include)
}

// تایپ OrderItem (جزئیات آیتم سفارش)
export interface OrderItem {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  price: number | any; // قیمت آیتم در زمان سفارش
  item?: Item; // آیتم مرتبط (اختیاری برای Include)
}

// تایپ Order (سفارش)
export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  totalPrice: number | any; // مجموع قیمت سفارش
  status: string; // وضعیت سفارش (مانند PENDING, READY)
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[]; // آیتم‌های سفارش
  table?: Table; // میز مرتبط
}

// -----------------------------------------------------------------------------
// تایپ‌های API و احراز هویت
// -----------------------------------------------------------------------------

import { Request } from 'express';

// تایپ درخواست احراز هویت شده (برای استفاده در میان‌افزار Auth)
export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
  };
}

// ساختار استاندارد پاسخ API
export interface ApiResponse<T = any> {
  success: boolean; // وضعیت موفقیت عملیات
  data?: T; // داده‌های اصلی پاسخ
  error?: string; // پیام خطای اصلی
  message?: string; // پیام موفقیت
  details?: any[]; // جزئیات خطا (مانند خطاهای اعتبارسنجی Zod)
}

// تایپ بدنه درخواست ورود
export interface LoginRequest {
  email: string;
  password: string;
}

// تایپ داده‌های پاسخ ورود موفق
export interface LoginResponse {
  token: string; // توکن JWT
  admin: {
    id: string;
    email: string;
  };
}
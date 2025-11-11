import { z } from 'zod';

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must be less than 100 characters'),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

// Item validation schemas
export const createItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Item name must be less than 100 characters'),
  description: z.string().nullable().optional(),
  price: z.number().positive('Price must be positive').max(10000, 'Price must be less than 10000'),
  imageUrl: z.string().url('Must be a valid URL').nullable().optional().or(z.literal('')),
  isActive: z.boolean().optional().default(true),
  categoryId: z.string().min(1, 'Category ID is required'),
});

export const updateItemSchema = createItemSchema.partial();

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Query validation schemas
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
});

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// Order validation schemas
export const createOrderSchema = z.object({
  tableId: z.string().min(1, 'Table ID is required'),
  items: z.array(z.object({
    itemId: z.string().min(1, 'Item ID is required'),
    quantity: z.number().int().positive('Quantity must be positive').max(100, 'Quantity must be 100 or less'),
  })).min(1, 'At least one item is required'),
});
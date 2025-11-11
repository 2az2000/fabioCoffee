import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { createCategorySchema, updateCategorySchema, idParamSchema } from '../utils/validation';
import { ApiResponse, Category } from '../types';

/**
 * Get all categories
 */
export const getCategories = async (req: Request, res: Response<ApiResponse<Category[]>>): Promise<void> => {
  try {
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
 * Get category by ID
 */
export const getCategoryById = async (req: Request, res: Response<ApiResponse<Category>>): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Category ID is required'
      });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!category) {
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
 * Create new category
 */
export const createCategory = async (req: Request, res: Response<ApiResponse<Category>>): Promise<void> => {
  try {
    const validationResult = createCategorySchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    // Clean data by removing undefined properties
    const cleanData = Object.fromEntries(
      Object.entries(validationResult.data).filter(([_, value]) => value !== undefined)
    );

    const category = await prisma.category.create({
      data: cleanData as any
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Update category
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

    const validationResult = updateCategorySchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return;
    }

    // Clean data by removing undefined properties
    const cleanData = Object.fromEntries(
      Object.entries(validationResult.data).filter(([_, value]) => value !== undefined)
    );

    const category = await prisma.category.update({
      where: { id },
      data: cleanData as any
    });

    res.json({
      success: true,
      data: category as Category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);
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
 * Delete category
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

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
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